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


docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabcar -c '{"function":"generateInitialCoin","Args":["user2"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode query -C mychannel -n fabcar -c '{"function":"getBalance","Args":["user2"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode query -C mychannel -n fabcar -c '{"function":"getBalance","Args":["user2"]}'