FROM node:lts-bullseye-slim
WORKDIR /indexify
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "./start.sh" ]