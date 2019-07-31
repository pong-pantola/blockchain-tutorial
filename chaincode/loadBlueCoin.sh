#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

#FABRIC_SAMPLES_HOME=/home/osboxes/testing/fabric-samples

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)

CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
CC_SRC_PATH=/opt/gopath/src/github.com/blue-coin

#stop docker containers
docker stop $(docker ps -aq) || ls
docker rm -f $(docker ps -aq) || ls

#delete all images with the name dev-peer
docker rmi -f $(docker images | grep dev-peer | awk '{print $3}') || ls

# clean the keystore
#rm -rf ./hfc-key-store
rm -rf ../wallet
mkdir ../wallet


# launch network; create channel and join peer to channel
#cd ../../fabric-samples/basic-network
cd ../network
./generate-and-replace.sh
./start.sh

# Now launch the CLI container in order to install, instantiate chaincode
docker-compose -f ./docker-compose.yml up -d cli0.org1
docker-compose -f ./docker-compose.yml up -d cli1.org1
docker-compose -f ./docker-compose.yml up -d cli0.org2
docker-compose -f ./docker-compose.yml up -d cli1.org2

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli0.org1 peer chaincode install -n blue-coin -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli1.org1 peer chaincode install -n blue-coin -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli0.org2 peer chaincode install -n blue-coin -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli1.org2 peer chaincode install -n blue-coin -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"


docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli0.org1 peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n blue-coin -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')" --collections-config /opt/gopath/src/github.com/blue-coin/private-data-config/private-data.yml
#sleep 10
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"initLedger","Args":[]}'

echo Loading of chaincode blue-coin is complete.


