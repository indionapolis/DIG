# DIG
Student breakdown into groups.
Project made for SWP course, 2019.

### Sample use case: 
1) run ```docker-compose build``` in the root of project
2) run ```docker-compose up``` and you should see how project starts running

### Repository tree

```
DIG
│   docker-compose.yml
│   README.md
│
├───backend
│   │   app.py
│   │   Dockerfile
│   │   requirements.txt
│   │
│   ├───dataset
│   ├───delete
│   ├───results
│   ├───uploads
│   └───working
│
├───forms
│   │   default.conf
│   │   Dockerfile
│   │   index.html
│   │   index.js
│   │   style.css
│   │
│   └───img
│
└───frontend
    │   default.conf
    │   Dockerfile
    │   package-lock.json
    │   package.json
    │   README.md
    │
    ├───public
    └───src
```

### Forms
[Readme file for the 'forms' part](forms/README.md)