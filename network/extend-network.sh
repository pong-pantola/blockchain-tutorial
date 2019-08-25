#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# This script extends the Hyperledger Fabric By Your First Network by
# adding a third organization to the network previously setup in the
# BYFN tutorial.
#

# prepending $PWD/../bin to PATH to ensure we are picking up the correct binaries
# this may be commented out to resolve installed version of tools if desired

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose-org3.yml up -d ca3.example.com peer0.org3.example.com couchdb0.org3 peer1.org3.example.com couchdb1.org3 
  
export FABRIC_START_TIMEOUT=10
sleep ${FABRIC_START_TIMEOUT}

echo
echo "####################################################################"
echo "################# Have Org3 peers join network #####################"
echo "####################################################################"

# Copy mychannel.block
docker cp peer0.org1.example.com:/opt/gopath/src/github.com/hyperledger/fabric/mychannel.block mychannel.block
docker cp mychannel.block peer0.org3.example.com:/opt/gopath/src/github.com/hyperledger/fabric/
docker cp mychannel.block peer1.org3.example.com:/opt/gopath/src/github.com/hyperledger/fabric/

rm mychannel.block
  
# joining org3 in the network
docker exec -e "CORE_PEER_LOCALMSPID=Org3MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org3.example.com/msp" peer0.org3.example.com peer channel join -b mychannel.block
docker exec -e "CORE_PEER_LOCALMSPID=Org3MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org3.example.com/msp" peer1.org3.example.com peer channel join -b mychannel.block

echo Blockchain network is extended.