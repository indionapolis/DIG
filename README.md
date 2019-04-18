# DIG
Student breakdown into groups.
Project made for SWP course, 2019.

### Sample use case: 
1) run ```docker-compose build``` in the root of project
2) run ```docker-compose up``` and you should see how project starts running

### Repository tree

```
DIG
│   README.md
│   docker-compose.yml
│   .gitignore
│
├───backend
│   │   app.py
│   │   division_core.py
│   │   type_form.py
│   │   Dockerfile
│   │   requirements.txt
│   │
│   ├───dataset
│   │       create_dataset.py
│   │       sample.xlsx
│   │       names.txt
│   │       hard_skills.txt
│   │       soft_skills.txt
│   │
│   ├───tests
│   │       endpoints.py
│   │
│   ├───delete
│   ├───results
│   ├───uploads
│   └───working
│
├───forms
│   │   index.html
│   │   content.html
│   │   login.html
│   │   style.css
│   │   index.js
│   │   login.js
│   │   README.md
│   │   Dockerfile
│   │   default.conf
│   │
│   └───img
│
└───frontend
    │   package-lock.json
    │   package.json
    │   README.md
    │   Dockerfile
    │   default.conf
    │   .dockerignore
    │   .gitignore
    │
    ├───public
    │
    └───src
        │   App.css
        │   App.js
        │   App.test.js
        │   AppRoutes.jsx
        │   index.css
        │   index.js
        │   logo.svg
        │   serviceWorker.js
        │
        └───components
                Configurator.css
                Configurator.jsx
                Login.css
                Login.jsx
                MetaInfo.css
                MetaInfo.jsx
                Results.css
                Results.jsx
                UploadDataPage.css
                UploadDataPage.jsx
```

### Forms
[Readme file for the 'forms' part](forms/README.md)
