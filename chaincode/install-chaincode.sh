#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error

set -e

if [ -z "$5" ];
then
  echo "Syntax : ./install-chaincode.sh <org index> <peer index> <folder name> <chaincode name> <chaincode version>"
  echo "Example: ./install-chaincode.sh 1 0 blue-coin-no-acl blue-coin 1.0 "
  exit 1
fi

ORG_INDEX=$1
PEER_INDEX=$2
FOLDER_NAME=$3
CHAINCODE_NAME=$4
CHAINCODE_VERSION=$5

#don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

CC_RUNTIME_LANGUAGE=node 
CC_SRC_PATH=/opt/gopath/src/github.com/$FOLDER_NAME

docker exec -e "CORE_PEER_LOCALMSPID=Org${ORG_INDEX}MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org${ORG_INDEX}.example.com/users/Admin@org${ORG_INDEX}.example.com/msp" cli${PEER_INDEX}.org${ORG_INDEX} peer chaincode install -n $CHAINCODE_NAME -v $CHAINCODE_VERSION -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli1.org1 peer chaincode install -n $CHAINCODE_NAME -v $CHAINCODE_VERSION -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

#docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli0.org2 peer chaincode install -n $CHAINCODE_NAME -v $CHAINCODE_VERSION -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
#docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli1.org2 peer chaincode install -n $CHAINCODE_NAME -v $CHAINCODE_VERSION -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

echo Installation of chaincode $CHAINCODE_NAME $CHAINCODE_VERSION TO peer${PEER_INDEX} of org${ORG_INDEX} is complete.


