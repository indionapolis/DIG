# DIG Forms
Functionality for professors to collect the data with all necessary information to be considered from students for further use by breakdown algorithm.

_All the code is written on clear JavaScript, HTML and CSS without any frameworks, bootstrap and predefined styles - everything is written manually._

### Sprint 2
The site allows to create/delete form, share the link to it with the students in order to get their responses, and then download the dataset (JSON file) with all received information.

[Sprint 2 presentation](https://paper.dropbox.com/doc/present/x839DAQq6RFRGoQ13Qgkz)

### Sprint 3
In addition to the Sprint 2 functionality, the site now has a login system which allows to load forms previously created by the user if he/she has already logged in and suggest to sign in otherwise. The forms were integrated to the backend and now automatically synchronize data with breakdown site: all forms are displayed there and allow to divide into groups without the need to download dataset from forms site and upload it to the breakdown one. Also an ability to edit forms right in the forms site was provided.

[Sprint 3 presentation](https://paper.dropbox.com/doc/present/94IdaUYgiGjw7LMIil2Gj)

### How to run
Clone the repository
> `git clone git@github.com:indionapolis/DIG.git`

Go to the 'forms' folder
> `cd forms`

Open index.html in your browser

### TypeForm
The forms processing is performed by using [TypeForm API](https://developer.typeform.com/). That's why only a frontend part is implemented, because the rest of actions is done by the TypeForm backend.

Data received from the user on our site, then is sent to the **TypeForm endpoint** by using POST request in order to create a form stored on TypeForm servers. Also we can collect responses received from the users, edit/delete the form by using DELETE, GET, POST requests.

All the forms are added to and stored on private account created specially for these needs.

### Complete folder tree

```
DIG/Forms
│   index.html
│   content.html
│   login.html
│   style.css
│   index.js
│   login.js
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
