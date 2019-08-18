#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error

set -e

if [ -z "$1" ];
then
  echo "Syntax : ./instantiate-chaincode.sh <chaincode name>"
  echo "Example: ./instantiate-chaincode.sh blue-coin"
  exit 1
fi

CHAINCODE_NAME=$1

#don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

CC_RUNTIME_LANGUAGE=node 

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli0.org1 peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n $CHAINCODE_NAME -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')" --collections-config /opt/gopath/src/github.com/$CHAINCODE_NAME/private-data-config/private-data.yml


echo Instantiation of chaincode $CHAINCODE_NAME is complete.


