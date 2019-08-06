FROM node:carbon-alpine

#ENV NODETMP "/usr/tmp"
ENV INSTALL "/usr/install"
ENV APP "/usr/src/app"
ENV USR "/usr"
ENV APPDIST "/usr/dist"

# Create app directory
RUN mkdir -p $APP

RUN mkdir -p $APPDIST

# Bundle app source

#RUN mkdir -p $NODETMP
COPY "package.json" "$USR/package.json"
#COPY "package-lock.json" "$USR/package-lock.json"
WORKDIR "/$USR/"
# Install app dependencies

RUN npm config set unsafe-perm true
RUN npm install
#RUN npm install pm2 -g

RUN mkdir -p "/$INSTALL/node_modules"
RUN cp -r "/$USR/node_modules/." "/$INSTALL/node_modules"


WORKDIR "/$INSTALL/"
RUN mkdir -p "/$INSTALL/src"
COPY "/src/." "/$INSTALL/src"
COPY "/angular.json" "/$INSTALL/"
COPY "/prerender.ts" "/$INSTALL/"
COPY "/server.ts" "/$INSTALL/"
COPY "/static.paths.ts" "/$INSTALL/"
COPY "/tsconfig.json" "/$INSTALL/"
COPY "/tsconfig.server.json" "/$INSTALL/"
COPY "/tslint.json" "/$INSTALL/"
COPY "/package.json" "/$INSTALL/"

RUN npm run build:universal

RUN cp -r "dist/." "/$APPDIST/"

WORKDIR "/$USR/"
RUN rm -rf "/$INSTALL"

CMD [ "node", "./dist/server.js" ]
EXPOSE 4000