#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error

set -e

#don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

# Launch the CLI container in order to install, instantiate chaincode
echo Launching CLI...

docker-compose -f ./docker-compose.yml up -d cli0.org1
docker-compose -f ./docker-compose.yml up -d cli1.org1
docker-compose -f ./docker-compose.yml up -d cli0.org2
docker-compose -f ./docker-compose.yml up -d cli1.org2

echo CLI for peers are up.
