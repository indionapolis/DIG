function addBlock() {
    if (document.getElementsByClassName('empty').length > 0) {
        alert("You already have an empty project! Create it first before making a new one.");
        return;
    }

    var blockHtml = '<div class="block-title"><input type="text" placeholder="Project name" maxlength="69" autofocus></div>'
                  + '<div class="block-tools"><button class="save" title="Create a form" onclick="saveBlock(this);"></button>'
                  + '<button class="delete" title="Delete form" onclick="deleteBlock(this);"></button></div>',
        blocksWrapper = document.getElementById("add-block").parentElement;
    var block = createBlockFromHtml('div', 'block empty', blockHtml);
    blocksWrapper.appendChild(block);
}

function saveBlock(saveBtn) {
    block = saveBtn.parentElement.parentElement;
    var title = block.firstChild.firstChild.value;
    if (title.replace(/\s/g, '') == "") {
        alert("Your project name is empty! Fill in something.");
        block.firstChild.firstChild.value = "";
        return;
    }
    
    block.firstChild.firstChild.remove();
    block.firstChild.textContent += title;

    block.classList.remove('empty');
    var toolsHtml = '<button class="share" title="Get the link on form"></button><button class="edit" title="Edit form"></button>'
                  + '<button class="download" title="Download dataset"></button><button class="delete" title="Delete form" onclick="deleteBlock(this);"></button>';
    saveBtn.parentElement.innerHTML = toolsHtml.trim();
}

function deleteBlock(deleteBtn) {
    block = deleteBtn.parentElement.parentElement;
    block.remove();
}

function createBlockFromHtml(type, elemClass, html) {
    var block = document.createElement(type);
    block.innerHTML = html.trim();
    block.classList = elemClass;

    return block;
}