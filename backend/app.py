from flask import Flask, request, Response, redirect, send_from_directory
from flask_cors import CORS
import pandas as pd
import json
import os

UPLOAD_FOLDER = './uploads'
WORKING_FOLDER = './working'
RESULT_FOLDER = './results'
DELETE_FOLDER = './delete'
ALLOWED_EXTENSIONS = {'xlsx', 'csv', 'xls'}

app = Flask(__name__)

CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():

    if request.method == 'POST':
        file = request.files['file']

        if file and allowed_file(file.filename):
            filename = file.filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect('/meta')

    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <p><input type=file name=file>
         <input type=submit value=Upload>
    </form>
    '''


@app.route('/meta', methods=['GET'])
def get_meta():
    for file in os.listdir(UPLOAD_FOLDER):
        if not allowed_file(file): continue
        df = pd.read_excel(f'{UPLOAD_FOLDER}/{file}')
        result = dict(
            name=file,
            len=len(df),
            columns=list(df.keys())
        )

        os.rename(f'{UPLOAD_FOLDER}/{file}', f'{WORKING_FOLDER}/{file}')
        return Response(json.dumps(result), status=200)
    else:
        return Response(status=404)


@app.route('/divide_into_groups', methods=['POST'])
def divide_into_groups():
    projects = json.loads(request.data)

    for file in os.listdir(WORKING_FOLDER):
        if not allowed_file(file): continue

        df = pd.read_excel(f'{WORKING_FOLDER}/{file}')
        df['project'] = ['' for i in range(len(df))]
        df['team'] = ['' for i in range(len(df))]

        for project in projects:
            for team in project['teams']:
                team_skills_set = set(team["skills"])
                team['members'] = []

                # search for people for team
                while len(team_skills_set):

                    # search for best people for team
                    best_person = None
                    best_person_id = 0
                    best_intersection = 0
                    for i, person in enumerate(df.values.tolist()):

                        # if person is free
                        if person[3] == '':
                            person_skills_set = set(person[1].split(', ') + person[2].split(', '))

                            # looking for person with biggest skill intersection with project
                            intersection_len = len(person_skills_set.intersection(team_skills_set))
                            if intersection_len > best_intersection:
                                best_intersection = intersection_len
                                best_person = person
                                best_person_id = i

                    # add best_person to the team
                    if best_person:
                        df['project'][best_person_id] = project['name']
                        df['team'][best_person_id] = team['name']
                        best_person_skills_set = set(best_person[1].split(', ') + best_person[2].split(', '))
                        team_skills_set = team_skills_set.difference(best_person_skills_set)
                        team['members'].append(best_person)
                    else:
                        # if we did not find more people for project
                        break

        # TODO fit in groups by number of people
        for project in projects:
            for team in project['teams']:
                team_skills_set = set(team["skills"])

                while len(team['members']) != team['size']:
                    # search for best people for team
                    best_person = None
                    best_person_id = 0
                    best_intersection = 0
                    for i, person in enumerate(df.values.tolist()):

                        # if person is free
                        if person[3] == '':
                            person_skills_set = set(person[1].split(', ') + person[2].split(', '))

                            # looking for person with biggest skill intersection with project
                            intersection_len = len(person_skills_set.intersection(team_skills_set))
                            if intersection_len > best_intersection:
                                best_intersection = intersection_len
                                best_person = person
                                best_person_id = i

                    # add best_person to the team
                    if best_person:
                        df['project'][best_person_id] = project['name']
                        df['team'][best_person_id] = team['name']
                        team['members'].append(best_person)
                    else:
                        # if we did not find more people for project
                        break

        df.to_excel(f'{WORKING_FOLDER}/{file}', index=False)

        os.rename(f'{WORKING_FOLDER}/{file}', f'{RESULT_FOLDER}/{file}')
        return Response(json.dumps(projects), status=200)
    else:
        return Response(status=404)


@app.route('/download', methods=['GET'])
def download():
    for file in os.listdir(RESULT_FOLDER):
        if not allowed_file(file): continue
        os.rename(f'{RESULT_FOLDER}/{file}', f'{DELETE_FOLDER}/{file}')
        return send_from_directory(DELETE_FOLDER, file)
    else:
        return Response(status=404)


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
    # drop_all_files()
    app.run(debug=False, host='0.0.0.0', port=5000)
