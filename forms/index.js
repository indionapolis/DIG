const API_ENDPOINT = 'http://localhost';
const PORT = 5000;

/**
 * Get data about user's existing forms and create block for each one with data included.
 * @param {String} email - String with email address.
 * @returns {void} Nothing, just perform necessary actions.
 */
function loadBlocks(email) {
    const promise = makeRequest(`${API_ENDPOINT}:${PORT}/projects?email=` + email, {}, "GET", "cors");
    promise.then(function(data) {
        const projects = data.projects,
              preload = document.getElementById('preload');
              
        projects.forEach(item => {
            var block = addEmptyBlock();
            fillEmptyBlock(block, item.title, item.form_id);
        });
        preload.style.display = "none";
    });
}

/**
 * Get data from TypeForm server and make a block based on it.
 * @param {HTMLElement} block - Block to be filled in.
 * @param {String} title - Block's title.
 * @param {String} formId - Block's form id.
 * @returns {void} Nothing, just perform necessary actions.
 */
function fillEmptyBlock(block, title, formId) {
    var projectNameInput = block.getElementsByTagName('input')[0];
    const blockToolsTmpl = document.getElementById('block-tools-tmpl'),
          blockTools = getElementFromTemplate(blockToolsTmpl),
          blockEditPanel = block.getElementsByClassName('block-edit-panel')[0];

    projectNameInput.value = title;
    block.dataset.formId = formId;
    projectNameInput.disabled = true;
    block.classList.remove('empty');
    block.getElementsByClassName('block-tools')[0].replaceWith(blockTools);

    addBlockEditPanel(blockEditPanel);

    /**
     * Get all necessary fields from TypeForm server and add them to the block edit panel.
     * @param {HTMLElement} panel - Block edit panel to be fulfilled.
     * @returns {void} Nothing, just modify the necessary block(s).
     */
    function addBlockEditPanel(panel) {
        const addTextBtn = panel.getElementsByClassName("add-text-qn")[0],
              addChkBoxBtn = panel.getElementsByClassName("add-chk-box")[0],
              addRadioBtn = panel.getElementsByClassName("add-rad-btn")[0],
              url = "https://api.typeform.com/forms/" + formId,
              promise = makeRequest(url, {}, "GET", "cors");

        promise.then(function(data) {            
            data.fields.forEach(field => {
                if (field.type == "long_text") {
                    var textField = addFormField(addTextBtn, "text");
                    textField.getElementsByClassName('question')[0].firstElementChild.value = field.title;
                }
                else if (field.type == "multiple_choice" & field.properties.allow_multiple_selection) {
                    var checkBoxField = addFormField(addChkBoxBtn, "check"),
                        addListElBtn = checkBoxField.getElementsByClassName('add-list-element')[0];

                    checkBoxField.getElementsByClassName('question')[0].firstElementChild.value = field.title;
                    checkBoxField.getElementsByClassName("list-item")[0].remove();

                    field.properties.choices.forEach(choice => {
                        var listEl = addListElement(addListElBtn, "checkbox");                        
                        listEl.children[1].value = choice.label;
                    });
                }
                else if (field.type == "multiple_choice" & !field.properties.allow_multiple_selection) {                    
                    var radioBtnField = addFormField(addRadioBtn, "radio"),
                        addListElBtn = radioBtnField.getElementsByClassName('add-list-element')[0];

                    radioBtnField.getElementsByClassName('question')[0].firstElementChild.value = field.title;
                    radioBtnField.getElementsByClassName("list-item")[0].remove();

                    field.properties.choices.forEach(choice => {
                        var listEl = addListElement(addListElBtn, "radio");
                        listEl.children[1].value = choice.label;
                    });
                }
            });
        });
    }
}

/**
 * Add new block with input field for project name and 'save' and 'delete' buttons.
 * @returns {HTMLElement} The added block.
 */
function addEmptyBlock() {
    if (document.getElementsByClassName('empty').length > 0) {  // handle too much empty projects problem
        alert("You already have an empty project! Create it first before making a new one.");
        return;
    }
    
    const blocksWrapper = document.getElementById("add-block").parentElement,
          blockTmpl = document.getElementById('empty-block-tmpl'),
          block = getElementFromTemplate(blockTmpl);

    blocksWrapper.appendChild(block);
    
    var projectNameInput = block.getElementsByTagName('input')[0];
    projectNameInput.focus();    // focus on newly added block's input field

    projectNameInput.onkeydown = function(e) {   // save the project name by pressing 'enter' key
        if (e.keyCode == 13)
            saveBlock(block.getElementsByClassName('save')[0]);
    }

    return block;
}

/**
 * Complete block creation by saving it.
 * @param {*} saveBtn - Button which activated current function.
 * @returns {void} Nothing, just perform necessary actions.
 */
function saveBlock(saveBtn) {
    var block = getGrandParent(saveBtn),
        projectNameInput = block.getElementsByTagName('input')[0],
        title = projectNameInput.value;
    
    if (!blockIsOK())
        return;
    
    projectNameInput.disabled = true;

    block.classList.remove('empty');

    const form = block.getElementsByTagName('form')[0],
          fields = getFormFields(form);
    
    var promise = createForm(title, fields),
        preload = document.getElementById('preload');

    preload.style.display = "block";
    promise.then(function(data) {
        getGrandParent(saveBtn).dataset.formId = data.id;

        makeRequest(`${API_ENDPOINT}:${PORT}/projects`, {
            "form_id": data.id, 
            "title": title, 
            "email": getEmailFromCookies(),
        }, "POST", "no-cors");

        const blockToolsTmpl = document.getElementById('block-tools-tmpl'),
              blockTools = getElementFromTemplate(blockToolsTmpl);
        
        hide(saveBtn, 'block-edit-panel');
        block.getElementsByClassName('block-tools')[0].replaceWith(blockTools);
        preload.style.display = "none";
    });

    /**
     * Check whether there are some conditions obstructing the correct block creation process.
     */
    function blockIsOK() {
        if (titleIsEmpty()) {
            alert("Your project name is empty! Fill in something.");
            projectNameInput.value = "";
            return false;
        }
        else if (thereAreNoFields()) {
            alert("There are no fields in the form! Add at least one.");
            return false;
        }
        else if (thereAreEmptyFields()) {
            alert("There are empty fields in the form! Remove them or fill in.");
            return false;
        }
        else if (thereAreEmptyChecklists()) {
            alert("There are checklists without any choice! Add at least one choice.");
            return false;
        }

        return true;

        function titleIsEmpty() {
            return title.replace(/\s/g, '') == "";
        }

        function thereAreNoFields() {
            return block.getElementsByClassName('block-edit-panel')[0].children.length == 1;
        }

        function thereAreEmptyFields() {
            const fieldTitles = block.getElementsByClassName('question');

            for (let title of fieldTitles) {
                if (title.firstElementChild.value.replace(/\s/g, '') == "") {
                    title.firstElementChild.value = "";
                    return true;
                }
            }

            const listElTitles = block.getElementsByClassName('list-item');
            
            for (let elTitle of listElTitles) {
                if (elTitle.children[1].value.replace(/\s/g, '') == "") {
                    elTitle.children[1].value = "";
                    return true;
                }
            }

            return false;
        }

        function thereAreEmptyChecklists() {
            const answerLists = block.getElementsByClassName('answer-list');

            for (let list of answerLists)
                if (list.children.length == 1)
                    return true;
            
            return false;
        }
    }
}

/**
 * Delete the form from TypeForm site and approproate block found by given button.
 * @param {HTMLElement} deleteBtn - Button which activated current function.
 * @returns {void} Nothing, just perform necessary actions.
 */
function deleteBlock(deleteBtn) {
    var block = getGrandParent(deleteBtn),
        preload = document.getElementById('preload');

    if (!block.classList.contains('empty')) {
        const formId = block.dataset.formId,
              url = 'https://api.typeform.com/forms/' + formId;

        preload.style.display = "block";

        const promise = makeRequest(url, {}, 'DELETE', "cors");

        promise.then(function(data) {            
            block.remove();
            preload.style.display = "none";
        });
    } else
        block.remove();
}

/**
 * Make a request (GET, POST, ...) to the TypeForm's endpoint.
 * @param {String} url - URL-address of the site to make a request on.
 * @param {Object} body - Data to be transfered.
 * @param {String} method - Method of a request (GET, POST, ...).
 * @param {String} mode - Mode of a request (no-cors, cors).
 * @returns {Promise} Promise file with some data got from the request.
 */
async function makeRequest(url, body={}, method, mode) {
    const token = "EY4YA4XgJwuQyVLUVKNpW2inHBqyW6vZWzYD5D4a3DLF",
          data = {
              "method" : method,
              "headers" : {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
              },
              "mode" : mode
          };

    if (Object.keys(body).length > 0)
        data.body = JSON.stringify(body);

    var response = await fetch(url, data);

    return await response.text().then(function(text) {
        return text ? JSON.parse(text) : {}
    })
}

/**
 * Create a form with given fields filled in on TypeForm site.
 * @param {String} title - Title of the form.
 * @param {Array} fields - Fields to be inserted into the form.
 * @returns {Promise} Promise file with some data got from the request.
 */
function createForm(title, fields=[]) {
    const url = "https://api.typeform.com/forms";
    const data = {
        "title": title,
        "fields" : fields
    };

    return makeRequest(url, data, "POST", "cors");
}

/**
 * Update form data with given new information.
 * @param {*} btn button which activated current function.
 * @returns {void} Nothing, just perform necessary actions.
 */
function updateForm(btn) {
    const block = getGrandParent(btn),
          blockTitle = block.getElementsByClassName('block-title')[0].firstElementChild;

    if (btn.classList.contains('edit')) {
        btn.classList.replace('edit', 'save');
        btn.title = "Save changes";
        hide(btn, 'block-edit-panel');
        blockTitle.disabled = false;
    }
    else if (btn.classList.contains('save')) {
        const preload = document.getElementById('preload'),
              form = block.getElementsByTagName('form')[0],
              formId = block.dataset.formId,
              url = "https://api.typeform.com/forms/" + formId,
              data = {
                  "title" : blockTitle.value,
                  "fields" : getFormFields(form)
              };
        
        preload.style.display = "block";

        makeRequest(url, data, "PUT", "cors").then(function(data) {
            btn.classList.replace('save', 'edit');
            btn.title = "Edit form";
            preload.style.display = "none";
            blockTitle.disabled = true;
            hide(btn, 'block-edit-panel');
        })
    }
}

/**
 * Get fields from given form and translate them to a specific format.
 * @param {HTMLElement} form - Form to be translated.
 * @returns {Array} Array of JSONs containing the data from given form in a specific format.
 */
function getFormFields(form) {
    var fields = [],
        fieldBLocks = form.getElementsByClassName('form-field');

    for (let field of fieldBLocks) {        
        if (field.classList.contains("text")) {
            const question = field.getElementsByClassName('question')[0].firstElementChild.value;

            fields.push(
                {
                    "title": question,
                    "type": "long_text",
                    "validations": {
                        "required": true,
                        "max_length": 40
                    }
                }
            );
        }
        else if (field.classList.contains("radio") || field.classList.contains("check-box")) {
            const question = field.getElementsByClassName('question')[0].firstElementChild.value,
                  choices = getChoices(field);

            fields.push(
                {
                    "title": question,
                    "type": "multiple_choice",
                    "properties": {
                        "randomize": false,
                        "allow_multiple_selection": field.classList.contains("check-box"),
                        "allow_other_choice": false,
                        "vertical_alignment": true,
                        "choices": choices
                    },
                    "validations": {
                        "required": true
                    }
                }
            );
        }
    }

    return fields;

    /**
     * Get unordered list elements translated to a specific format.
     * @param {HTMLElement} field - The field containing the list.
     * @returns {Array} Values of list elements in a JSON format.
     */
    function getChoices(field) {
        var choices = [];
        const uList = field.getElementsByClassName('list-item');
        
        for (let liElem of uList) {            
            choices.push(
                {
                    "label" : liElem.children[1].value
                }
            );
        }
        
        return choices;
    }
}

/**
 * Transform given template block into the element.
 * @param {HTMLElement} template - Template block.
 * @returns {HTMLElement} Block inside the template.
 */
function getElementFromTemplate(template) {
    return template.content.children.item(0).cloneNode(true);
}

/**
 * Save link to the clipboard.
 * @param {String} link - Link to be saved.
 * @returns {void} Nothing, just perform necessary actions.
 */
function copyToClipboard(btn) {
    const formId = getGrandParent(btn).dataset.formId,
          el = document.createElement('textarea');
    var link = 'https://ireknazmiev.typeform.com/to/' + formId
    el.value = link;
    el.style.position = 'absolute';
    el.style.left = '-9000px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert("The link to the form is copied to the clipboard");
};

/**
 * Redirect to the 'breakdown' page with necessary dataset already sent and prepared.
 * @param {HTMLElement} btn - Button which activated current function.
 * @returns {void} Nothing, just modify the necessary block(s).
 */
function sendDataset(btn) {
    const block = getGrandParent(btn),
          formId = block.dataset.formId;

    window.open(`${API_ENDPOINT}/dig/?form_id=${formId}`, "_blank");
}

/**
 * Hide and show the element with given class.
 * @param {HTMLElement} btn - Button which activated current function.
 * @param {String} blockClass - Class of element to be hidden/shown.
 * @returns {void} Nothing, just modify the necessary block(s).
 */
function hide(btn, blockClass) {
    block = getGrandParent(btn).getElementsByClassName(blockClass)[0];
    if (!block.classList.contains('hidden')) {
        block.classList.add("hidden");
        btn.classList.add("activated");
    }
    else {
        block.classList.remove("hidden");
        btn.classList.remove("activated");
    }
}

/**
 * Add a new question field of a given type to the form.
 * @param {HTMLElement} btn - Button which activated current function.
 * @param {String} type - Type of a field to be added.
 * @returns {HTMLElement} Inserted field.
 */
function addFormField(btn, type) {
    const textFieldTmpl = document.getElementById('form-text-field-tmpl'),
          radioBtnTmpl = document.getElementById('form-radio-field-tmpl'),
          chkBoxBtnTmpl = document.getElementById('form-chk-box-field-tmpl');

    if (type == "text")
        return getGrandParent(btn).parentElement.insertBefore(getElementFromTemplate(textFieldTmpl), getGrandParent(btn));
    else if (type == "radio")
        return getGrandParent(btn).parentElement.insertBefore(getElementFromTemplate(radioBtnTmpl), getGrandParent(btn));
    else if (type == "check")
        return getGrandParent(btn).parentElement.insertBefore(getElementFromTemplate(chkBoxBtnTmpl), getGrandParent(btn));
}

/**
 * Add list element of a chosen type right after the activating button.
 * @param {HTMLElement} btn - Button which activated current function.
 * @param {String} type - Type of a list element.
 * @returns {HTMLElement} Inserted list element.
 */
function addListElement(btn, type) {
    var elementTmpl = '';

    if (type == "radio")
        elementTmpl = document.getElementById('radio-tmpl');
    else if (type == "checkbox")
        elementTmpl = document.getElementById('checkbox-tmpl');

    return getGrandParent(btn).insertBefore(getElementFromTemplate(elementTmpl), btn.parentElement)
}

/**
 * Remove a form element of a chosen type.
 * @param {HTMLElement} btn - Button which activated current function.
 * @param {String} type - Type of a form element.
 * @returns {void} Nothing, just modify the necessary block.
 */
function removeFormElement(btn, type) {
    if (type == "question")
        getGrandParent(btn).remove();
    else
        btn.parentElement.remove();
}

/**
 * Get block's grandparent.
 * @param {HTMLElement} elem - Original block.
 * @returns {HTMLElement} Block's grandparent.
 */
function getGrandParent(elem) {
    return elem.parentElement.parentElement;
}
