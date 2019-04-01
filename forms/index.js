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

    var promise = createEmptyForm(title);

    promise.then(function(data) {
        getGrandParent(saveBtn).dataset.formId = data.id;
        const toolsHtml = '<button class="share" title="Get the link on form" onclick="copyToClipboard(\'https://ireknazmiev.typeform.com/to/' + data.id + '\');"></button>'
                        + '<button class="edit" title="Edit form"></button>'
                        + '<button class="download" title="Download dataset"></button>'
                        + '<button class="delete" title="Delete form" onclick="deleteBlock(this);"></button>';
        saveBtn.parentElement.innerHTML = toolsHtml.trim();

        const editPanel = block.getElementsByClassName('block-edit-panel')[0];
        hideEditPanel(editPanel);
    });
}

function hideEditPanel(editPanel) {
    editPanel.style.overflow = "hidden";
    editPanel.style.padding = "0";
    editPanel.style.maxHeight = "0";
}

/**
 * 
 * @param {*} template tamplate block.
 */
function getElementFromTemplate(template) {
    return template.content.children.item(0).cloneNode(true);
}

/**
 * Create an empty form on TypeForm site.
 * @param {*} title Title of the form.
 */
function createEmptyForm(title) {
    const url = "https://api.typeform.com/forms";
    const data = {
        "title": title
    };

    return makeRequest(url, data, "POST");
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
 * Make a request (GET, POST, ...) to the TypeForm's endpoint.
 * @param {*} url URL-address of the site to make a request on.
 * @param {*} data Data to be transfered.
 * @param {*} method Method of a request (GET, POST, ...).
 */
async function makeRequest(url, data, method) {
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
 * Add a new field with question of one of the given type to the form.
 * @param {} btn button which activated current function.
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

// get block's grandparent
function getGrandParent(elem) {
    return elem.parentElement.parentElement;
}