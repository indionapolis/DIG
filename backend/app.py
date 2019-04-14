from flask import Flask, request, Response, redirect, send_from_directory
from flask_cors import CORS
import pandas as pd
import json
import os
import sys
import uuid
import redis

from type_form import TypeForm
from division_core import divide

UPLOAD_FOLDER = './uploads'
WORKING_FOLDER = './working'
RESULT_FOLDER = './results'
DELETE_FOLDER = './delete'

FILES_MAP = {}

SKILL_SET = []

ALLOWED_EXTENSIONS = {'xlsx', 'csv', 'xls'}

app = Flask(__name__)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.database = redis.Redis(host='redis' if len(sys.argv) == 2 and sys.argv[1] == 'docker' else 'localhost', port=6379)

app.outsource = TypeForm(app.config['UPLOAD_FOLDER'])

CORS(app)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload_from_outsource', methods=['POST'])
def upload_from_outsource():
    data = json.loads(request.data) if request.data else {}
    try:
        form_id = data['form_id']
    except KeyError:
        return Response(status=400)

    filename = app.outsource.upload_adapter(form_id)

    if filename and allowed_file(filename):

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

        configuration = json.loads(request.data)

        divide(configuration, f'{WORKING_FOLDER}/{file}')

        os.rename(f'{WORKING_FOLDER}/{file}', f'{RESULT_FOLDER}/{file}')
        return Response(json.dumps(configuration), status=200)
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


@app.route('/projects', methods=['GET', 'POST'])
def projects():
    if request.method == 'GET':
        data = request.args if request.args else {}
        try:
            email = data.get('email')
        except KeyError:
            return Response(status=400)

        proj_list = app.database.lrange(email, 0, -1)
        result = {'email': email, 'projects': []}
        for item in proj_list:
            result['projects'].append({
                'title': json.loads(item)[1],
                'form_id': json.loads(item)[0]
            })

        return Response(json.dumps(result), status=200)

    else:
        data = json.loads(request.data)
        try:
            form_id = data['form_id']
            title = data['title']
            email = data['email']
        except KeyError:
            return Response(status=400)

        app.database.rpush(email, json.dumps([form_id, title]))

        return Response(status=200)


@app.route('/skill_suggestion', methods=['GET'])
def skill_suggestion():
    try:
        sub = str(request.args.get('input'))
        print(sub)

        res = [match for match in SKILL_SET if match.lower().startswith(sub.lower())]
        print(res)
        print(SKILL_SET)

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
    # todo remove
    SKILL_SET = open('dataset/soft_skills.txt', 'r').read().split('\n') + open('dataset/hard_skills.txt',
                                                                               'r').read().split('\n')
    app.run(debug=False, host='0.0.0.0', port=5000)
