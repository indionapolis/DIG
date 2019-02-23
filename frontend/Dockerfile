FROM node:latest as build
WORKDIR /home
COPY package.json ./

RUN npm install
COPY . ./
ARG backend_endpoint=http://localhost:5555
ENV REACT_APP_BACKEND_URL=$backend_endpoint
RUN npm run build

FROM nginx:1.15-alpine
WORKDIR /home
COPY --from=build /home/build /home/build

COPY default.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
