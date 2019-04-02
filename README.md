# DIG
Division into groups
Project made for SWP course 2019


### Sample use case: 
1) run ```docker-compose build``` in the root of project
2) run ```docker-compose up``` and you should see how project starts running

### In this repository:
```├── README.md
├── backend - main part of project
│   ├── Dockerfile
│   ├── app.py - flask server which computes all data
│   ├── dataset
│   ├── delete
│   ├── requirements.txt
│   ├── results
│   ├── uploads
│   └── working
├── docker-compose.yml
└── frontend - front side of the project
    ├── Dockerfile
    ├── README.md
    ├── default.conf
    ├── package-lock.json
    ├── package.json
    ├── public
    └── src```