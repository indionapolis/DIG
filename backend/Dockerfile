FROM python:3.6
WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./

CMD python app.py docker
EXPOSE 5000

# redis docker run
# docker run --name some-redis --rm -p 6379:6379 -d -v $HOME/data:/data redis redis-server