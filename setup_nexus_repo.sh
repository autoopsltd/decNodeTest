#!/bin/bash

echo "email=jenkins@jenkins.com" > .npmrc
echo "always-auth=true" >> .npmrc
echo "_auth=YWRtaW46YWRtaW4xMjM=" >> .npmrc
echo "registry=http://192.168.1.15:8082/repository/npm-internal/" >> .npmrc
