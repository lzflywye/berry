#!/usr/bin/bash

docker run \
    -d \
    -p 127.0.0.1:6379:6379 \
    valkey/valkey:9
