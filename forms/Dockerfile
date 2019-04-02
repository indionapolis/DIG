FROM nginx:1.15-alpine
WORKDIR /home
COPY . /home/build

COPY default.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
