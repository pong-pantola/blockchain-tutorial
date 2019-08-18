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
  echo "Syntax : ./loadChaincode.sh <folder name> <chaincode name>"
  echo "Example: ./loadChaincode.sh blue-coin-no-acl blue-coin"
  exit 1
fi

FOLDER_NAME=$1
CHAINCODE_NAME=$2
cd ../network
./stop-network.sh
./generate-and-replace.sh

#don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

# chaincode runtime language is node.js
CC_RUNTIME_LANGUAGE=node 
CC_SRC_PATH=/opt/gopath/src/github.com/$FOLDER_NAME



#stop and removing docker containers
#echo Stopping all docker containers...
#docker stop $(docker ps -aq) || ls

#echo Removing all docker containers...
#docker rm -f $(docker ps -aq) || ls

#delete all images with the name dev-peer

#echo Deleting all docker images that contain actual chaincode...
#docker rmi -f $(docker images | grep dev-peer | awk '{print $3}') || ls

#remove all wallets
cd ../wallet
./clear-wallet.sh
#echo Removing wallets...
#rm -rf ../wallet
#mkdir ../wallet


cd ../network
./start-network.sh

# Now launch the CLI container in order to install, instantiate chaincode
docker-compose -f ./docker-compose.yml up -d cli0.org1
docker-compose -f ./docker-compose.yml up -d cli1.org1
docker-compose -f ./docker-compose.yml up -d cli0.org2
docker-compose -f ./docker-compose.yml up -d cli1.org2

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli0.org1 peer chaincode install -n $CHAINCODE_NAME -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli1.org1 peer chaincode install -n $CHAINCODE_NAME -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli0.org2 peer chaincode install -n $CHAINCODE_NAME -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli1.org2 peer chaincode install -n $CHAINCODE_NAME -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

#This is needed if private data is used
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli0.org1 peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n $CHAINCODE_NAME -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')" --collections-config /opt/gopath/src/github.com/$CHAINCODE_NAME/private-data-config/private-data.yml


echo Loading of chaincode $CHAINCODE_NAME is complete.


