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
  echo "Syntax : ./instantiate-chaincode.sh <org index> <peer index> <chaincode name> <chaincode version>"
  echo "Example: ./instantiate-chaincode.sh 1 0 blue-coin 1.0"
  exit 1
fi

ORG_INDEX=$1
PEER_INDEX=$2
CHAINCODE_NAME=$3
CHAINCODE_VERSION=$4

#don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

CC_RUNTIME_LANGUAGE=node 
CHANNEL_NAME=mychannel

docker exec -e "CORE_PEER_LOCALMSPID=Org${ORG_INDEX}MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org${ORG_INDEX}.example.com/users/Admin@org${ORG_INDEX}.example.com/msp" cli${PEER_INDEX}.org${ORG_INDEX} peer chaincode instantiate -o orderer.example.com:7050 -C $CHANNEL_NAME -n $CHAINCODE_NAME -l "$CC_RUNTIME_LANGUAGE" -v $CHAINCODE_VERSION -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')" --collections-config /opt/gopath/src/github.com/$CHAINCODE_NAME/private-data-config/private-data.yml


echo Instantiation of chaincode $CHAINCODE_NAME $CHAINCODE_VERSION TO $CHAINCODE_NAME is complete.


