from flask import Flask, request, Response, redirect, send_from_directory
from flask_cors import CORS
import pandas as pd
import json
import os
import uuid

UPLOAD_FOLDER = './uploads'
WORKING_FOLDER = './working'
RESULT_FOLDER = './results'
DELETE_FOLDER = './delete'

FILES_MAP = {}

SKILL_SET = []

ALLOWED_EXTENSIONS = {'xlsx', 'csv', 'xls'}

app = Flask(__name__)

CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload_file():

    file = request.files['file']

    if file and allowed_file(file.filename):
        filename = file.filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # map downloaded files to users
        uid = str(uuid.uuid4())
        FILES_MAP[uid] = filename

        # return meta data
        df = pd.read_excel(f'{UPLOAD_FOLDER}/{filename}')

        result = dict(
            name=filename,
            len=len(df),
            columns=list(df.keys())
        )

        os.rename(f'{UPLOAD_FOLDER}/{filename}', f'{WORKING_FOLDER}/{filename}')
        return Response(json.dumps(result), headers={'uuid': uid, 'Access-Control-Expose-Headers': 'uuid'}, status=200)
    else:
        return Response(status=400)


@app.route('/divide_into_groups', methods=['POST'])
def divide_into_groups():
    # TODO greedy on soft skills
    # TODO round robin distribution
    # TODO skill priority
    try:
        uid = request.headers['uuid']
        file = FILES_MAP[uid]

        projects = json.loads(request.data)
        df = pd.read_excel(f'{WORKING_FOLDER}/{file}')
        # to send JSON response
        people = df.to_dict('records')
        df['project'] = ['' for i in range(len(df))]
        df['team'] = ['' for i in range(len(df))]

        soft_skills = set(map(lambda x: x.lower(), open('./dataset/soft_skills.txt').read().split('\n')))

        for project in projects:
            for team in project['teams']:
                team_skills_set = set(map(lambda x: x.lower(), team["skills"]))
                team['members'] = []
                # in case team do not need soft skills
                skill_flag = len(soft_skills.intersection(team_skills_set))

                # search for people for team
                while len(team_skills_set):

                    # search for best people for team
                    best_person = None
                    best_person_id = 0
                    best_intersection = 0
                    for i, person in enumerate(df.to_dict('records')):

                        # if person is free
                        if person['project'] == '':
                            person_hard_skills_set = set(map(lambda x: x.lower(), person['Hard Skills'].split(', ')))
                            person_soft_skills_set = set(map(lambda x: x.lower(), person['Soft Skills'].split(', ')))

                            # looking for person with biggest skill intersection with project
                            hard_intersection_len = len(person_hard_skills_set.intersection(team_skills_set))
                            soft_intersection_len = len(person_soft_skills_set.intersection(team_skills_set))
                            if hard_intersection_len > best_intersection and (soft_intersection_len or not skill_flag):
                                best_intersection = hard_intersection_len
                                best_person = person
                                best_person_id = i

                    # add best_person to the team
                    if best_person:
                        df['project'][best_person_id] = project['name']
                        df['team'][best_person_id] = team['name']
                        best_person_skills_set = set(best_person['Hard Skills'].split(', '))
                        team_skills_set = team_skills_set.difference(best_person_skills_set)
                        team['members'].append(people[best_person_id])
                    else:
                        # if we did not find more people for project
                        break

        for project in projects:
            for team in project['teams']:
                team_skills_set = set(map(lambda x: x.lower(), team["skills"]))
                # in case team do not need soft skills
                skill_flag = len(soft_skills.intersection(team_skills_set))

                while len(team['members']) != team['size']:
                    # search for best people for team
                    best_person = None
                    best_person_id = 0
                    best_intersection = 0
                    for i, person in enumerate(df.to_dict('records')):

                        # if person is free
                        if person['project'] == '':
                            person_hard_skills_set = set(map(lambda x: x.lower(), person['Hard Skills'].split(', ')))
                            person_soft_skills_set = set(map(lambda x: x.lower(), person['Soft Skills'].split(', ')))

                            # looking for person with biggest skill intersection with project
                            hard_intersection_len = len(person_hard_skills_set.intersection(team_skills_set))
                            soft_intersection_len = len(person_soft_skills_set.intersection(team_skills_set))
                            if hard_intersection_len > best_intersection and (soft_intersection_len or not skill_flag):
                                best_intersection = hard_intersection_len
                                best_person = person
                                best_person_id = i

                    # add best_person to the team
                    if best_person:
                        df['project'][best_person_id] = project['name']
                        df['team'][best_person_id] = team['name']
                        team['members'].append(people[best_person_id])
                    else:
                        # if we did not find more people for project
                        break

        df.to_excel(f'{WORKING_FOLDER}/{file}', index=False)

        os.rename(f'{WORKING_FOLDER}/{file}', f'{RESULT_FOLDER}/{file}')
        return Response(json.dumps(projects), status=200)
    except KeyError:
        return Response(status=401)


@app.route('/download', methods=['GET'])
def download():
    try:
        uid = request.headers['uuid']
        file = FILES_MAP[uid]
        os.rename(f'{RESULT_FOLDER}/{file}', f'{DELETE_FOLDER}/{file}')
        del FILES_MAP[uid]
        return send_from_directory(DELETE_FOLDER, file)
    except KeyError:
        return Response(status=401)


@app.route('/skill_suggestion', methods=['GET'])
def skill_suggestion():
    try:
        sub = request.form['input']

        res = [match for match in SKILL_SET if match.lower().startswith(sub.lower())]

        return Response(json.dumps(res), status=200)
    except KeyError:
        return Response(status=400)


# TODO 404 handler
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return Response('You want path: %s' % path, status=404)


def drop_all_files():
    folders = [UPLOAD_FOLDER, WORKING_FOLDER, RESULT_FOLDER, DELETE_FOLDER]
    for folder in folders:
        for file in os.listdir(folder):
            if not allowed_file(file): continue
            os.remove(f'{folder}/{file}')


if __name__ == '__main__':
    drop_all_files()
    SKILL_SET = open('dataset/soft_skills.txt', 'r').read().split('\n') + open('dataset/hard_skills.txt', 'r').read().split('\n')
    app.run(debug=False, host='0.0.0.0', port=5000)
