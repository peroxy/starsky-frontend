FROM node:14.15.5-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@4.0.3 -g --silent

COPY . ./

EXPOSE 3000
CMD ["npm", "start"]