#!/bin/bash
if [ "$1" = "--up" ]; then
    if [ "$2" = "-d" ]; then
        docker-compose -f 'docker-compose.dev.yml' up -d
    else 
        docker-compose -f 'docker-compose.dev.yml' up
    fi
fi

if [ "$1" = "--test" ]; then
    docker-compose -f 'docker-compose.dev.yml' exec app yarn env-cmd -f ./env/test.docker.env jest --detectOpenHandles --runInBand
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