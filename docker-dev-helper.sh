#!/bin/bash
if [ "$1" = "--up" ]; then
    if [ "$2" = "-d" ]; then
        docker-compose -f 'docker-compose.dev.yml' up -d
    else 
        docker-compose -f 'docker-compose.dev.yml' up
    fi
fi

if [ "$1" = "--migrate" ]; then
    docker-compose -f 'docker-compose.dev.yml' exec app yarn ./node_modules/.bin/env-cmd --no-override -f ./env/test.docker.env ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run
fi

if [ "$1" = "--test" ]; then
    declare -fx _Test_Method
    _Test_Method() {
        docker-compose -f 'docker-compose.dev.yml' exec app yarn env-cmd -f ./env/test.docker.env jest --runInBand --ci
    }
    
    ( _Test_Method; )
    ERROR_CODE=$?
    echo $ERROR_CODE
    if [[ $ERROR_CODE -eq 0 ]]; then 
        exit 0;
    else
        exit 1;
    fi
fi

if [ "$1" = "--bash" ]; then
    docker-compose -f 'docker-compose.dev.yml' up --no-start
    docker-compose -f 'docker-compose.dev.yml' start # ensure we are started, handle also allowed to be consumed by vscode
    docker-compose -f 'docker-compose.dev.yml' exec app bash
fi

if [ "$1" = "--halt" ]; then
    docker-compose -f 'docker-compose.dev.yml' stop
fi

if [ "$1" = "--rebuild" ]; then
    docker-compose -f 'docker-compose.dev.yml' up -d --force-recreate --no-deps --build app
fi

if [ "$1" = "--destroy" ]; then
    docker-compose -f 'docker-compose.dev.yml' down --rmi local -v --remove-orphans
fi

[ -n "$1" -a \( "$1" = "--up" -o "$1" = "--bash" -o  "$1" = "--halt" -o "$1" = "--rebuild" -o "$1" = "--destroy" \) ] \
    || { echo "usage: $0 --up | --halt | --rebuild | --destroy" >&2; exit 1; }