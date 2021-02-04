# Production Dockerfile - multi phase build 
FROM node:14-alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install 
COPY . . 
RUN npm run build 

FROM nginx
EXPOSE 3000
# make a copy of config file in local machine to remote container
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# make a copy of prod asset to remote html directory 
COPY --from=builder /app/build /usr/share/nginx/html