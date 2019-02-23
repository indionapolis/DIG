import json

from flask import Flask, request, Response, redirect
from werkzeug.utils import secure_filename
import pandas as pd
import os

UPLOAD_FOLDER = './backend/uploads'
ALLOWED_EXTENSIONS = {'xlsx', 'csv', 'xls'}

app = Flask(__name__)

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
            filename = secure_filename(file.filename)
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
        df = pd.read_excel(f'{UPLOAD_FOLDER}/{file}')
        result = dict(
            name=file,
            len=len(df),
            colums=list(df.keys())
        )

        return Response(json.dumps(result), status=200)
    else:
        return Response(status=404)


@app.route('/divide_into_groups', methods=['POST'])
def divide_into_groups():
    if request.method == 'POST':
        print(request.data)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return Response('You want path: %s' % path, status=404)