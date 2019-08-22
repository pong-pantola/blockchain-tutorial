#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

#stopping and removing docker containers

#docker stop $(docker ps -aq) || ls
#docker rm -f $(docker ps -aq) || ls
if [ ! -z "$(docker ps -aq)" ];
then
  echo Stopping all docker containers...
  docker stop $(docker ps -aq)
  echo Removing all docker containers...
  docker rm -f $(docker ps -aq)
fi

#delete all images with the name dev-peer
#docker rmi -f $(docker images | grep dev-peer | awk '{print $3}') || ls
if [ ! -z "$(docker images | grep dev-peer | awk '{print $3}')" ];
then
  echo Deleting all docker images that contain actual chaincode...
  docker rmi -f $(docker images | grep dev-peer | awk '{print $3}')
fi

echo Removing blockchain artifacts...
rm -r -f config
mkdir config

echo Removing certificats and private keys...
rm -r -f crypto-config
mkdir crypto-config

rm -r -f org3-artifacts/crypto-config
mkdir org3-artifacts/crypto-config

echo
echo Blockchain network is stopped.