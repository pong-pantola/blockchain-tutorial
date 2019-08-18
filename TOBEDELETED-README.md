# blockchain-tutorial

if you encounter this error:
MSBUILD : error MSB4132: The tools version "2.0" is unrecognized. Available tools versions are "4.0".

run this command in Administrator mode:
npm install --global --production windows-build-tools


https://github.com/pong-pantola/blockchain-tutorial.git

curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.0 1.4.0 0.4.15

curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.1 1.4.1 0.4.15

update:
blockchain-tutorial/manager/user/config/config.json
  -set connectionConfigFilePath to path of connection configuration json flie
  
fabric-samples/basic-network/docker-compose.yml
  -look for   ./../chaincode/:/opt/gopath/src/github.com/
  -change to  /home/osboxes/blockchain-tutorial/chaincode/:/opt/gopath/src/github.com/
  
blockchain-tutorial/blue-coin/loadBlueCoin.js
  -update FABRIC_SAMPLES_HOME=/home/osboxes/testing/fabric-samples



mkdir training
cd training
curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.0 1.4.0 0.4.15
git clone https://github.com/pong-pantola/blockchain-tutorial.git

open fabric-samples/basic-network/docker-compose.yml
  -look for the following:

    volumes:
        - ./../chaincode/:/opt/gopath/src/github.com/

  -change to
        #- ./../chaincode/:/opt/gopath/src/github.com/
        - ./../../blockchain-tutorial/chaincode/:/opt/gopath/src/github.com/


docker logs $(docker ps | grep  dev-peer0.org1 | awk '{print $1}')



docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n blue-coin -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":["instantiate"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"init","Args":[]}'

peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n blue-coin -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":["instantiate"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"instantiate","Args":[]}'
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
saveOrg1PrivateData
docker exec cli0.org1 peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"saveOrg1PrivateData","Args":["secretofORG1-part2"]}'

docker exec cli0.org1 peer chaincode query -C mychannel -n blue-coin -c '{"function":"getOrg1PrivateData","Args":[]}'

docker exec cli0.org2 peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"saveOrg1PrivateData","Args":["secretofORG2-part2"]}'

docker exec cli0.org2 peer chaincode query -C mychannel -n blue-coin -c '{"function":"getOrg1PrivateData","Args":[]}'

xxxxxxxxxxxxxxxxxxxxxxxxxxx
docker exec cli0.org1 peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"generateInitialCoin","Args":["Org1MSP"]}'


docker exec cli0.org1 peer chaincode query -C mychannel -n blue-coin -c '{"function":"getBalance","Args":["Org1MSP"]}'


docker exec cli0.org2 peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"generateInitialCoin","Args":["Org2MSP"]}'


docker exec cli0.org2 peer chaincode query -C mychannel -n blue-coin -c '{"function":"getBalance","Args":["Org2MSP"]}'


docker exec cli0.org1 peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"transferCoin","Args":["Org1MSP", "Org2MSP", "200"]}'



docker exec cli0.org1 peer chaincode query -C mychannel -n blue-coin -c '{"function":"getTransactionHistory","Args":["Org1MSP"]}'




docker exec cli0.org1 peer chaincode query -C mychannel -n blue-coin -c '{"function":"getTransactionHistory","Args":["Org1MSP"]}'








docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli0.org1 peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"generateInitialCoin","Args":["user1"]}'



docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli1.org2 peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"generateInitialCoin","Args":["user2"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli0.org1 peer chaincode query -C mychannel -n blue-coin -c '{"function":"getBalance","Args":["user1"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli0.org2 peer chaincode query -C mychannel -n blue-coin -c '{"function":"getBalance","Args":["user1"]}'


docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode query -C mychannel -n blue-coin -c '{"function":"getBalance","Args":["user2"]}'


docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"transferCoin","Args":["user1", "user2", "150"]}'


docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode query -C mychannel -n blue-coin -c '{"function":"getAllAbove","Args":["300"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode query -C mychannel -n blue-coin -c '{"function":"getTransactionHistory","Args":["user1"]}'


http://localhost:5984/_utils

https://fabric-shim.github.io/release-1.4/tutorial-using-contractinterface.html

