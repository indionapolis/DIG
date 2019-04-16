/**
 * Load necessary html-content into the main page depending on cookies.
 * It'll be either login page or page with form functionality.
 */
window.onload = function() {
    var body = document.getElementsByTagName('body')[0],
        preload = document.getElementById('preload');

    if (document.cookie == "") {
        const promise = loadFile("login.html");

        promise.then((html) => {            
            const login = createElementFromHtml(html);
            body.appendChild(login.firstElementChild);
            preload.style.display = "none";
        });
    }
    else {
        const promise = loadFile("content.html");

        promise.then((html) => {
            const content = createElementFromHtml(html);
            for (let item of content.childNodes)
                body.appendChild(item);
            preload.style.display = "none";
        });
    }
}

/**
 * Translate string with html-code into real html-code.
 * @param {String} html String with some html-code.
 */
function createElementFromHtml(html) {
    var element = document.createElement('div');
    element.innerHTML = html;
    return element;
}

/**
 * Load html-file for further use.
 * @param {String} fileName Name of the file to be loaded.
 */
async function loadFile(fileName) {
    const response = await fetch(fileName);
    return await response.text();
}

/**
 * Save email to the cookies.
 * @param {*} form Form block which called the function.
 */
function saveEmail(form) {
    const input = form.firstElementChild;
    document.cookie = "email=" + input.value;
    location.reload();
}