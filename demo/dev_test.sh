#!/usr/bin/env bash
docker-compose -f docker-compose-dev.yml down
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
./dev_build.sh
rm -rf truffledrizzle/client/src/contracts
docker-compose -f docker-compose-test.yml up