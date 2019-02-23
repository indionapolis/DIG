import json

from flask import Flask, request, Response, redirect
from werkzeug.utils import secure_filename
import pandas as pd
import os
from flask_cors import CORS

UPLOAD_FOLDER = './uploads'
WORKING_FOLDER = './working'
RESULT_FOLDER = './results'
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
            colums=list(df.keys())
        )

        os.rename(f'{UPLOAD_FOLDER}/{file}', f'{WORKING_FOLDER}/{file}')
        return Response(json.dumps(result), status=200)
    else:
        return Response(status=404)


@app.route('/divide_into_groups', methods=['POST'])
def divide_into_groups():
    projects = json.loads(request.data)
    # TODO algorithm

    for file in os.listdir(WORKING_FOLDER):
        if not allowed_file(file): continue

        df = pd.read_excel(f'{UPLOAD_FOLDER}/{file}')

        for project in projects:
            for team in project['teams']:
                print(team["skills"])


        os.rename(f'{WORKING_FOLDER}/{file}', f'{RESULT_FOLDER}/{file}')
        return Response(status=200)
    else:
        return Response(status=404)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return Response('You want path: %s' % path, status=404)


if __name__ == '__main__':
    app.run()