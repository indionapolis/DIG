FROM python:3.6
WORKDIR /app

RUN pip install flask
RUN pip install flask-cors
RUN pip install pandas
RUN pip install xlrd openpyxl

COPY . ./

CMD python app.py
EXPOSE 5000