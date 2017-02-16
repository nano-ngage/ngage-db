FROM netczuk/node-yarn
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn
# Bundle app source
COPY . /usr/src/app
EXPOSE 5000
CMD [ "yarn", "start" ]