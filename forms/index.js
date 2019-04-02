/**
 * Add new block with input field for project name and 'save' and 'delete' buttons.
 */
function addBlock() {
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
}

/**
 * Complete block creation by saving it.
 * @param {*} saveBtn button which activated current function.
 */
function saveBlock(saveBtn) {
    block = getGrandParent(saveBtn);
    var projectNameInput = block.getElementsByTagName('input')[0];
    var title = projectNameInput.value;
    
    if (title.replace(/\s/g, '') == "") {   // handle empty project name problem
        alert("Your project name is empty! Fill in something.");
        projectNameInput.value = "";
        return;
    }
    
    projectNameInput.remove();
    block.firstElementChild.textContent += title;

    block.classList.remove('empty');

    const form = block.getElementsByTagName('form')[0],
          fields = getFormFields(form);
    
    var promise = createForm(title, fields),
        preload = document.getElementById('preload');

    preload.style.display = "block";
    promise.then(function(data) {
        getGrandParent(saveBtn).dataset.formId = data.id;
        const toolsHtml = '<button class="share" title="Get the link on form" onclick="copyToClipboard(\'https://ireknazmiev.typeform.com/to/' + data.id + '\');"></button>'
                        + '<button class="edit" title="Edit form"></button>'
                        + '<button class="download" title="Download dataset"></button>'
                        + '<button class="delete" title="Delete form" onclick="deleteBlock(this);"></button>';
        saveBtn.parentElement.innerHTML = toolsHtml.trim();

        const editPanel = block.getElementsByClassName('block-edit-panel')[0];
        hideEditPanel(editPanel);
        preload.style.display = "none";
    });
}

/**
 * Delete the form from TypeForm site and approproate block found by given button.
 * @param {*} deleteBtn button which activated current function.
 */
function deleteBlock(deleteBtn) {
    block = getGrandParent(deleteBtn);

    if (!block.classList.contains('empty')) {
        const formId = block.dataset.formId,
              url = 'https://api.typeform.com/forms/' + formId;

        const promise = makeRequest(url, {}, 'DELETE');
        promise.then(block.remove());
    } else
        block.remove();
}

/**
 * Make a request (GET, POST, ...) to the TypeForm's endpoint.
 * @param {*} url URL-address of the site to make a request on.
 * @param {*} data Data to be transfered.
 * @param {*} method Method of a request (GET, POST, ...).
 */
async function makeRequest(url, data={}, method) {
    const token = "EY4YA4XgJwuQyVLUVKNpW2inHBqyW6vZWzYD5D4a3DLF";

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data),
    });
    
    return await response.json();
}

/**
 * Create a form with given fields filled in on TypeForm site.
 * @param {*} title Title of the form.
 * @param {*} fields Fields to be inserted into the form.
 */
function createForm(title, fields=[]) {
    const url = "https://api.typeform.com/forms";
    const data = {
        "title": title,
        "fields" : fields
    };

    return makeRequest(url, data, "POST");
}

/**
 * Get fields from given form and translate them to a specific format.
 * @param {*} form form to be translated.
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
     * @param {*} field field containing the list.
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
 * @param {*} template template block.
 */
function getElementFromTemplate(template) {
    return template.content.children.item(0).cloneNode(true);
}

/**
 * Save link to the clipboard.
 * @param {*} link Link to be saved.
 */
function copyToClipboard(link) {
    const el = document.createElement('textarea');
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
 * Hide and show the element with given ID
 * @param {*} btn button which activated current function.
 * @param {*} blockId id of element to be hidden/shown
 */
function hide(btn, blockId) {
    block = document.getElementById(blockId);
    if (block.classList.length == 0) {
        block.classList.add("hidden");
        btn.style.transform = "rotate(0deg)";
    }
    else {
        block.classList.remove("hidden");
        btn.style.transform = "rotate(45deg)";
    }
}

/**
 * Hide edit panel smoothly.
 * @param {*} editPanel panel element to be hidden smoothly.
 */
function hideEditPanel(editPanel) {
    editPanel.style.overflow = "hidden";
    editPanel.style.padding = "0";
    editPanel.style.maxHeight = "0";
}

/**
 * Add a new field with question of one of the given type to the form.
 * @param {*} btn button which activated current function.
 * @param {*} type the type of a field to be added.
 */
function addFormField(btn, type) {
    const textFieldTmpl = document.getElementById('form-text-field-tmpl'),
          radioBtnTmpl = document.getElementById('form-radio-field-tmpl'),
          chkBoxBtnTmpl = document.getElementById('form-chk-box-field-tmpl');

    if (type == "text")
        getGrandParent(btn).parentElement.insertBefore(getElementFromTemplate(textFieldTmpl), getGrandParent(btn));
    else if (type == "radio")
        getGrandParent(btn).parentElement.insertBefore(getElementFromTemplate(radioBtnTmpl), getGrandParent(btn));
    else if (type == "check")
        getGrandParent(btn).parentElement.insertBefore(getElementFromTemplate(chkBoxBtnTmpl), getGrandParent(btn));
}

/**
 * Add list element of a chosen type near the activating button.
 * @param {*} btn button which activated current function.
 * @param {*} type type of a list element.
 */
function addListElement(btn, type) {
    var elementTmpl = '';

    if (type == "radio")
        elementTmpl = document.getElementById('radio-tmpl');
    else if (type == "checkbox")
        elementTmpl = document.getElementById('checkbox-tmpl');

    getGrandParent(btn).insertBefore(getElementFromTemplate(elementTmpl), btn.parentElement)
}

/**
 * Remove a form element of a chosen type;
 * @param {*} btn button which activated current function.
 * @param {*} type type of a form element.
 */
function removeFormElement(btn, type) {
    if (type == "question")
        getGrandParent(btn).remove();
    else
        btn.parentElement.remove();
}

// get block's grandparent
function getGrandParent(elem) {
    return elem.parentElement.parentElement;
}