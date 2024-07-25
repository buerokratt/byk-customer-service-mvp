ARG node_version=node:lts
ARG nginx_version=nginx:1.26.1-alpine
# ARG sonarscanner_version=sonarsource/sonar-scanner-cli

FROM $node_version as image
WORKDIR /usr/customer-service
COPY ./package*.json ./

FROM image AS build
ARG env=DEV
RUN npm ci
COPY . .
# RUN npm run test:coverage
RUN npm run build

# FROM $sonarscanner_version as sonar
# ARG sonarscanner_params=-Dsonar.host.url=http://localhost:9000
# COPY --from=build ./usr/customer-service .
# RUN sonar-scanner $sonarscanner_params

FROM $nginx_version
COPY ./nginx/https-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build ./usr/customer-service/build /usr/share/nginx/html/customer-service
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
