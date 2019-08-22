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

docker-compose -f docker-compose-org3.yml up -d cli0.org3
docker-compose -f docker-compose-org3.yml up -d cli1.org3

echo CLI for peers are up.
