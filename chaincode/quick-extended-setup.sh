#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error

set -e

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ];
then
  echo "Syntax : ./quick-extended-setup.sh <folder name> <chaincode name> <chaincode version>"
  echo "Example: ./quick-extended-setup.sh blue-coin-no-acl blue-coin 1.0"
  exit 1
fi

FOLDER_NAME=$1
CHAINCODE_NAME=$2
CHAINCODE_VERSION=$3

CC_RUNTIME_LANGUAGE=node 
CC_SRC_PATH=/opt/gopath/src/github.com/$FOLDER_NAME

cd ../network
./generate-and-replace-for-extended-network.sh
./extend-network.sh
./extend-cli.sh

cd ../chaincode
./install-chaincode.sh 1 0 $FOLDER_NAME $CHAINCODE_NAME $CHAINCODE_VERSION
./install-chaincode.sh 1 1 $FOLDER_NAME $CHAINCODE_NAME $CHAINCODE_VERSION
./install-chaincode.sh 2 0 $FOLDER_NAME $CHAINCODE_NAME $CHAINCODE_VERSION
./install-chaincode.sh 2 1 $FOLDER_NAME $CHAINCODE_NAME $CHAINCODE_VERSION
./install-chaincode.sh 3 0 $FOLDER_NAME $CHAINCODE_NAME $CHAINCODE_VERSION
./install-chaincode.sh 3 1 $FOLDER_NAME $CHAINCODE_NAME $CHAINCODE_VERSION

./upgrade-chaincode.sh 1 0 $CHAINCODE_NAME $CHAINCODE_VERSION

echo Quick extended setup for chaincode $CHAINCODE_NAME is complete.

