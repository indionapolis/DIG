/**
 * Add new block with input field for project name and 'save' and 'delete' buttons.
 */
function addBlock() {
    if (document.getElementsByClassName('empty').length > 0) {  // handle too much empty projects problem
        alert("You already have an empty project! Create it first before making a new one.");
        return;
    }

    const blockHtml = '<div class="block-title"><input type="text" placeholder="Project name" maxlength="69" autofocus></div>'
                    + '<div class="block-tools"><button class="save" title="Create a form" onclick="saveBlock(this);"></button>'
                    + '<button class="delete" title="Delete form" onclick="deleteBlock(this);"></button></div>',
        blocksWrapper = document.getElementById("add-block").parentElement;
    var block = createBlockFromHtml('div', 'block empty', blockHtml);
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
 * @param {*} saveBtn save button needed for getting the block itself.
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
    block.firstChild.textContent += title;

    block.classList.remove('empty');

    var promise = createEmptyForm(title);

    promise.then(function(data) {
        const toolsHtml = '<button class="share" title="Get the link on form" onclick="copyToClipboard(\'https://ireknazmiev.typeform.com/to/' + data.id + '\');"></button><button class="edit" title="Edit form"></button>'
                        + '<button class="download" title="Download dataset"></button><button class="delete" title="Delete form" onclick="deleteBlock(this);"></button>';
        saveBtn.parentElement.innerHTML = toolsHtml.trim();
    });
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
 * Delete given block's grandparent.
 * @param {*} deleteBtn delete button neede for getting its grandparent and deleting it.
 */
function deleteBlock(deleteBtn) {
    block = getGrandParent(deleteBtn);
    block.remove();
}

/**
 * Create block from html string.
 * @param {*} type Type of block.
 * @param {*} elemClass Block's class.
 * @param {*} html Html code for block.
 */
function createBlockFromHtml(type, elemClass, html) {
    var block = document.createElement(type);
    block.innerHTML = html.trim();
    block.classList = elemClass;

    return block;
}

// get block's grandparent
function getGrandParent(elem) {
    return elem.parentElement.parentElement;
}