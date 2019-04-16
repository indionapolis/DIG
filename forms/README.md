# DIG Forms
Functionality for professors to collect the data with all necessary information to be considered from students for further use by breakdown algorithm.

The site allows to create/delete form, share the link to it with the students in order to get their responses, and then download the dataset (JSON file) with all received information.

_All the code is written on clear JavaScript, HTML and CSS without any frameworks, bootstrap and predefined styles - everything is written manually._

[Sprint 2 presentation](https://paper.dropbox.com/doc/present/x839DAQq6RFRGoQ13Qgkz)

### How to run
Clone the repository
> `git clon git@github.com:indionapolis/DIG.git`

Go to the 'forms' folder
> `cd forms`

Open index.html in your browser

### TypeForm
The forms processing is performed by using [TypeForm API](https://developer.typeform.com/). That's why only a frontend part is implemented, because the rest of actions is done by the TypeForm backend.

Data received from the user on our site, then is sent to the **TypeForm endpoint** by using POST request in order to create a form stored on TypeForm servers. Also we can collect responses received from the users, edit/delete the form by using DELETE, GET, POST requests.

All the forms are added to and stored on private account created specially for these needs.

### Complete folder tree

```
DIG/forms
│   index.html
│   style.css
│   index.js
│   README.md
│   default.conf
│   Dockerfile
│
└───img
        check-box.svg
        delete-icon.svg
        download-icon.svg
        edit-icon.svg
        flower.png
        preload.svg
        radio-button.svg
        save-icon.svg
        share-icon.svg
        text-field.svg
```
