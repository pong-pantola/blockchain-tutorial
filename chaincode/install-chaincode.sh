#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error

set -e

if [ -z "$1" ] || [ -z "$2" ];
then
  echo "Syntax : ./install-chaincode.sh <folder name> <chaincode name>"
  echo "Example: ./install-chaincode.sh blue-coin-no-acl blue-coin"
  exit 1
fi

FOLDER_NAME=$1
CHAINCODE_NAME=$2

#don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

CC_RUNTIME_LANGUAGE=node 
CC_SRC_PATH=/opt/gopath/src/github.com/$FOLDER_NAME

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli0.org1 peer chaincode install -n $CHAINCODE_NAME -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli1.org1 peer chaincode install -n $CHAINCODE_NAME -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli0.org2 peer chaincode install -n $CHAINCODE_NAME -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli1.org2 peer chaincode install -n $CHAINCODE_NAME -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

echo Installation of chaincode $CHAINCODE_NAME is complete.


