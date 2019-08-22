#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error

set -e

if [ -z "$4" ];
then
  echo "Syntax : ./view-chaincode-logs.sh <org index> <peer index> <chaincode name> <chaincode version>"
  echo "Example: ./view-chaincode-logs.sh 1 0 blue-coin 1.0"
  exit 1
fi

ORG_INDEX=$1
PEER_INDEX=$2
CHAINCODE_NAME=$3
CHAINCODE_VERSION=$4

#don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker logs $(docker ps | grep  dev-peer${PEER_INDEX}.org${ORG_INDEX}.example.com-${CHAINCODE_NAME}-${CHAINCODE_VERSION} | awk '{print $1}')

