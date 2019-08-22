# Utilize NodeJS Client SDK

In the previous tutorial, the chaincode functions are called through the CLI of the peers.

Using the CLI is a quick way of testing the functions in a chaincode.  

However, if the chaincode functions need to be called inside another program, the CLI approach becomes impractical.

This tutorial demonstrates the use of a Hyperledger Fabric NodeJS Client SDK that allows a NodeJS program to call the chaincode functions.

Take note that the chaincode itself is written in NodeJS.  It is just a coincidence that we will be using a NodeJS program, which will serve as a chaincode client, to call the chaincode functions.

In a different situation, the chaincode could have been written in another programming language (e.g., Golang) while the chaincode client is written in NodeJS.

## Quick Setup

1. Run the quick setup.

    ````
    chaincode> ./quick-setup.sh blue-coin blue-coin 1.0
    ````

    Notice that the chaincode we are using is found in the `blue-coin` subfolder and not the one found in `blue-coin-no-acl`.

    These two versions of the blue coin chaincode are basically the same except that the one in the `blue-coin` subfolder uses access control list (ACL).  This means that call to most of the functions in the chaincode is limited. 

    For example, the `transferCoin` function can be called only by the organization that owns the blue coins that will be transferred.

## Examine the Client Folder

1. List the files of the `client/blue-coin` subfolder.

    ````
    bc-client> ls
    ````

    The folder contains several NodeJS programs.  They are listed below and grouped according to their function:

    * Enroll Administrator
        * `enrollAdmin.js`
        * `enrollAdminWithUserManager.js`
    * Enroll User
        * `enrollUser.js`
        * `enrollUserWithUserManager.js`
    * Generate Initial Coin
        * `generateInitialCoin.js`
        * `generateInitialCoinWithTransactionManager.js`
        * `generateInitialCoinWithBlueCoinManager.js`
    * Get Balance
        * `getBalanceWithBlueCoinManager.js`
    * Transfer Coin
        * `transferCoinWithBlueCoinManager.js`
    * Get Transaction History
        * `getTransactionHistoryWithBlueCoinManager.js`

    NodeJS programs that are grouped under the same function have different implementations but yield the same results.

    For example, `generateInitialCoin.js`, `generateInitialCoinWithTransactionManager.js`, and `generateInitialCoinWithBlueCoinManager.js` are programs that allow the generation of initial coins.  However, their differences are only in the implementations as described below:
    * `generateInitialCoin.js` - utilizes only the NodeJS SDK Client for Hypereledger Fabric
    * `generateInitialCoinWithTransactionManager.js` - utilizes `TransactionManager.js` in order to abstract the complexity in the use of the NodeJS SDK Client
    * `generateInitialCoinWithBlueCoinManager.js` - utilizes `BlueCoinManager.js` in order to make it more readable

## Enroll the Bootstrap Administrator

1. Confirm that the `wallet` subfolder is empty.

    ````
    wallet> ls
    ````

    You may also use a file explorer program (e.g., Windows Explorer) to view the contents of the `wallet` subfolder.  Later, we will inspect further the contents of the `wallet` subfolder using a file explorer.

1. Open the following source in an IDE.

    ````
    IDE> blockchain-tutorial/client/blue-coin/enrollAdmin.js
    ````

    This program enrolls the bootstrap adminstrator of a particular organization.  A bootsrap administrator is needed to register new users through a certificate authority.

    It utilizes two Hyperledger Fabric NodeJS Client SDK:
    * `fabric-ca-client` - to communicate with a certificate authority (CA) server
    * `fabric-network` - to manage the wallet

    ````
    const FabricCAServices = require('fabric-ca-client')
    const { FileSystemWallet, X509WalletMixin } = require('fabric-network')
    ````

    The program uses the following syntax.

    **Syntax:**
    ````
    bc-client> node enrollAdmin.js <org index>
    ````

    **Example:**
    ````
    bc-client> node enrollAdmin.js 1
    ````

    In th example above, the bootstrap administrator of org1 is enrolled.

1. Enroll the bootstrap administrator of org1.

    ````
    bc-client> node enrollAdmin.js 1
    ````

1. Using a file explorer, check if there are subfolders and/or files created in the `wallet` subfolder.

    The `wallet` subfolder now contains the following:
    
    * `org1`
        * `admin`
            * `<long hex no.>-priv` - private key
            * `<long hex no.>-pub` - public key
            * `admin` - certificate
            
1. Enroll the bootstrap administrator of org2.

    ````
    bc-client> node enrollAdminWithUserManager.js 2
    ````

    Notice that we use `enrollAdminWithUserManager.js` instead of `enrollAdmin.js`.  As discussed both have the same result but the former abstracts the complexity of the NodeJS SDK.

1. Check again the contents of the `wallet` subfolder.

    The `wallet` subfolder now contains subfolders and files for both org1 and org2:

    * `org1`
        * `admin`
            * `<long hex no.>-priv` - private key
            * `<long hex no.>-pub` - public key
            * `admin` - certificate
    * `org2`
        * `admin`
            * `<long hex no.>-priv` - private key
            * `<long hex no.>-pub` - public key
            * `admin` - certificate
        
## Register and Enroll other Users

1. Open the following source in an IDE.

    ````
    IDE> blockchain-tutorial/client/blue-coin/enrollUser.js
    ````

    This program registers and enrolls a user of a particular organization.  A bootsrap administrator for each organization is needed (which was enrolled in the previous steps) before new users can be registered and enrolled.

    It utilizes two Hyperledger Fabric NodeJS Client SDK:
    * `fabric-ca-client` - to communicate with the certificate authority (CA) server
    * `fabric-network` - to manage the wallet and connect to the blockchain network

    ````
    const FabricCAServices = require('fabric-ca-client')
    const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network')
    ````

    The program uses the following syntax.

    **Syntax:**
    ````
    bc-client> node enrollUser.js <org index> <user index>
    ````

    **Example:**
    ````
    bc-client> node enrollUser.js 1 2
    ````

    In th example above, `user2` of org1 is registered and enrolled.

1. Enroll `user1` of org1.

    ````
    bc-client> node enrollUser.js 1 1
    ````

1. Using a file explorer, check if there is a subfolder `user1` created under `wallet/org1`.

    The `wallet` subfolder now contains the following:
    
    * `org1`
        * `user1`
            * `<long hex no.>-priv` - private key
            * `<long hex no.>-pub` - public key
            * `user1` - certificate

1. Enroll `user1` of org2.

    ````
    bc-client> node enrollUserWithUserManager.js 1 2
    ````

    Notice that `enrollUserWithUserManager.js` is used instead of `enrollUser.js`.  As discussed, they produce the same result but are implemented differently.

1. Using a file explorer, check if there is a subfolder `user1` created under `wallet/org2`.

    The `wallet` subfolder now contains the following:
    
    * `org2`
        * `user1`
            * `<long hex no.>-priv` - private key
            * `<long hex no.>-pub` - public key
            * `user1` - certificate

## Generate Initial Coins

1. Open the following source in an IDE.

    ````
    IDE> blockchain-tutorial/client/blue-coin/generateInitialCoin.js
    ````

    This program calls the `generateInitialCoin` function of the chaincode.

    It utilizes the Hyperledger Fabric NodeJS Client SDK`fabric-network` to manage the wallet and connect to the blockchain network.

    ````
    const { FileSystemWallet, Gateway } = require('fabric-network');
    ````

    The program uses the following syntax.

    **Syntax:**
    ````
    bc-client> node generateInitialCoin.js <org index> <user index> <mspId>
    ````

    **Example:**
    ````
    bc-client> node generateInitialCoin.js 1 2 Org1MSP
    ````

    In th example above, `user2` of org1 is used to call the chaincode function `generateInitialCoin`.  The parameter `Org1MSP` is passed as a parameter to the `generateInitialCoin` chaincode function.

    Take note that a user (e.g., `user2`) should be registered and enrolled first before it is used to call any function.

1. Generate initial coins for org1.

    ````
    bc-client> node generateInitialCoin.js 1 1 Org1MSP
    ````

1. Generate initial coins for org2.

    ````
    bc-client> node generateInitialCoinWithTransactionManager.js 2 1 Org2MSP
    ````

    Notice that `generateInitialCoinWithTransactionManager.js` is used instead of `generateInitialCoin.js`.  As discussed, they produce the same result but are implemented differently.

    A third implemention of the program `generateInitialCoinWithBlueCoinManager.js` can also be used.

## Test `BlueCoinManager.js`-based Programs

Several programs are created under the `client/blue-coin` subfolder that utilizes the `BlueCoinManager.js` program.  You may test all of these to see their effects.

1. Examine the program details in the table below.


    | Purpose             | Syntax                        | Example     |
    |---------------------------|--------------------------------|------------|
    | Generate Initial Coin | `node generateInitialCoinWithBlueCoinManager.js <org index> <user index> <mspId>`                   | `node generateInitialCoinWithBlueCoinManager.js 1 2 Org1MSP`   |
    | Get Balance                    | `node getBalanceWithBlueCoinManager.js <org index> <user index> <mspId>`                    | `node getBalanceWithBlueCoinManager.js 1 2 Org1MSP`    |
    | Transfer Coin                 | `node transferCoinWithBlueCoinManager.js <org index> <user index> <srcMspId> <dstMspId> <amt>`                 | `node transferCoinWithBlueCoinManager.js 1 2 Org1MSP Org2MSP 210` |
    | Get Transaction History          | `node getTransactionHistoryWithBlueCoinManager.js <org index> <user index> <mspId>`         | `node getTransactionHistoryWithBlueCoinManager.js 1 2 Org1MSP` |

1. Get the balance of both org1 and org2.

    ````
    bc-client> node getBalanceWithBlueCoinManager.js 1 1 Org1MSP

    bc-client> node getBalanceWithBlueCoinManager.js 2 1 Org2MSP
    ````

    Confirm that both org1 and org2 have 500 blue coins.

1. Try to transfer blue coins from org2 to org1 using user from org1.

    ````
    bc-client> node transferCoinWithBlueCoinManager.js 1 1 Org2MSP Org1MSP 200
    ````

    This results to an error since the chaincode implements an ACL.  It does not allow an organization to transfer blue coins if it does not own the said blue coins.

    In this case, `user1`  of org1 attempts to transfer 200 blue coins from org2 to org1.  This is prohibited by the chaincode.

1. Transfer blue coins from org2 to org1 using user from org2.

    ````
    bc-client> node transferCoinWithBlueCoinManager.js 2 1 Org2MSP Org1MSP 200
    ````

    The transfer is now successful since `user1` of org2 is used to transfer blue coins from org2 to org1.


## Update `BlueCoinManager.js`

1. Open the following source in an IDE.

    ````
    IDE> blockchain-tutorial/manager/blue-coin/BlueCoinManager.js
    ````

1. Edit the `BlueCoinManager` class to include the method `getAllAbove`.

1. In the `client/blue-coin` subfolder, create a program called `getAllAboveWithBlueCoinManager.js`

    The program should use the following syntax.

    **Syntax:**
    ````
    bc-client> node getAllAboveWithBlueCoinManager.js <org index> <user index> <val>
    ````

    **Example:**
    ````
    bc-client> node getAllAboveWithBlueCoinManager.js 2 1 250
    ````

    In the example above, `user1` of org2 is used to call the function `getAllAbove` to get all organizations that have blue coins above 250.