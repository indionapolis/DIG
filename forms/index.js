/**
 * Add new block with input field for project name and 'save' and 'delete' buttons.
 */
function addBlock() {
    if (document.getElementsByClassName('empty').length > 0) {  // handle too much empty projects problem
        alert("You already have an empty project! Create it first before making a new one.");
        return;
    }

    var blockHtml = '<div class="block-title"><input type="text" placeholder="Project name" maxlength="69" autofocus></div>'
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
    block = saveBtn.getGrandParent(saveBtn);
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
    var toolsHtml = '<button class="share" title="Get the link on form"></button><button class="edit" title="Edit form"></button>'
                  + '<button class="download" title="Download dataset"></button><button class="delete" title="Delete form" onclick="deleteBlock(this);"></button>';
    saveBtn.parentElement.innerHTML = toolsHtml.trim();
}

/**
 * Delete given block's grandparent.
 * @param {*} deleteBtn delete button neede for getting its grandparent and deleting it.
 */
function deleteBlock(deleteBtn) {
    block = deleteBtn.getGrandParent(deleteBtn);
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