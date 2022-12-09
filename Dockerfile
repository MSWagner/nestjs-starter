FROM node:18
EXPOSE 3000

# Setup /app/ with current code
WORKDIR /app

# First only copy the package.json, yarn.lock, .yarnrc files + install all deps WITHOUT executing any scripts
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
# `--production=false` is required since the default node image sets `NODE_ENV production`, which causes yarn to not install any devDependencies
RUN yarn install --pure-lockfile --production=false 

# Now copy the project sources, link, and build project
COPY tsconfig.json /app/tsconfig.json
COPY ./src /app/src
COPY ./env /app/env
RUN yarn tsc

# Finally copy in all workspace files
COPY . /app/