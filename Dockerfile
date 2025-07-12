FROM node:18
# Set the working directory
WORKDIR /app    

COPY . .

EXPOSE 5005

COPY package*.json ./
RUN npm install

ENTRYPOINT [ "node","app.js" ]