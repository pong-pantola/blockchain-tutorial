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
  echo "Syntax : ./quick-setup.sh <folder name> <chaincode name>"
  echo "Example: ./quick-setup.sh blue-coin-no-acl blue-coin"
  exit 1
fi

FOLDER_NAME=$1
CHAINCODE_NAME=$2

#don't rewrite paths for Windows Git Bash users
#export MSYS_NO_PATHCONV=1

CC_RUNTIME_LANGUAGE=node 
CC_SRC_PATH=/opt/gopath/src/github.com/$FOLDER_NAME

cd ../network
./stop-network.sh

cd ../wallet
./clear-wallet.sh

cd ../network
./generate-and-replace.sh
./start-network.sh
./start-cli.sh


cd ../chaincode
./install-chaincode.sh $FOLDER_NAME $CHAINCODE_NAME
./instantiate-chaincode.sh $CHAINCODE_NAME

echo Quick setup for chaincode $CHAINCODE_NAME is complete.


