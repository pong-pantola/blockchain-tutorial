# blockchain-tutorial

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


docker logs $(docker ps | grep dev-peer | awk '{print $1}')



docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n blue-coin -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":["instantiate"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"init","Args":[]}'

peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n blue-coin -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":["instantiate"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"instantiate","Args":[]}'
xxxxxxxxxxxxxxxxxxxxxxxxxxx

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"generateInitialCoin","Args":["user1"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"generateInitialCoin","Args":["user2"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode query -C mychannel -n blue-coin -c '{"function":"getBalance","Args":["user1"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode query -C mychannel -n blue-coin -c '{"function":"getBalance","Args":["user2"]}'


docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n blue-coin -c '{"function":"transferCoin","Args":["user1", "user2", "150"]}'


docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode query -C mychannel -n blue-coin -c '{"function":"getAllAbove","Args":["300"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode query -C mychannel -n blue-coin -c '{"function":"getTransactionHistory","Args":["user1"]}'


http://localhost:5984/_utils

https://fabric-shim.github.io/release-1.4/tutorial-using-contractinterface.html

