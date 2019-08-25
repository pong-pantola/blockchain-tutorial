# Utilize REST API Server

In the previous tutorial, the chaincode functions are called through a NodeJS Client SDK that are utilized by NodeJS programs.

In order to easily connect the chaincode to other systems, a REST API can be utilized to call the different chaincode functions. 

## Quick Setup

1. Run the quick setup.

    ````
    chaincode> ./quick-setup.sh blue-coin blue-coin 1.0
    ````

    **Expected Output:**

    ````
    Quick setup for chaincode blue-coin is complete.
    ````


## Register and Enroll the Users of Org1 and Org2

1. Enroll the bootstrap adminstrators of org1 and org2.

    ````
    bc-client> node enrollAdminWithUserManager.js 1

    bc-client> node enrollAdminWithUserManager.js 2
    ````

    **Expected Output:**

    ````
    Enrolling Administrator admin of org1...
    Administrator admin of org1 enrolled successfully.
    ````

    ````
    Enrolling Administrator admin of org2...
    Administrator admin of org2 enrolled successfully.
    ````

1. Regiser and enroll `user1` and `user2` of org1 and org2.

    ````
    bc-client> node enrollUserWithUserManager.js 1 1

    bc-client> node enrollUserWithUserManager.js 1 2

    bc-client> node enrollUserWithUserManager.js 2 1

    bc-client> node enrollUserWithUserManager.js 2 2    
    ````

    **Expected Output:**

    ````
    Registering User user1... of org1
    User user1 of org1 registered successfully.
    Enrolling User user1... of org1
    User user1 of org1 enrolled successfully.
    ````

    ````
    Registering User user2... of org1
    User user2 of org1 registered successfully.
    Enrolling User user2... of org1
    User user2 of org1 enrolled successfully.
    ````

    ````
    Registering User user1... of org2
    User user1 of org2 registered successfully.
    Enrolling User user1... of org2
    User user1 of org2 enrolled successfully.
    ````

    ````
    Registering User user2... of org2
    User user2 of org2 registered successfully.
    Enrolling User user2... of org2
    User user2 of org2 enrolled successfully.
    ````


## Examine the REST API Server Folder

1. List the files of the `rest-api-server/blue-coin` subfolder.

    ````
    bc-rest> ls
    ````

    The folder contains several files and subfolders.  Some of these files and subfolders are listed below:

    * `app.js`
    * `route`
        * `BlueCoinRoute.js`
    * `controller`
        * `BlueCoinController.js`
    
    The file `app.js` is the main program that will start a REST API srever.

    The program uses the following syntax.

    **Syntax:**
    ````
    bc-rest> node app.js <org index>
    ````

    **Example:**
    ````
    bc-rest> node app.js 1
    ````

    The sample command above starts the REST API server for org1.

    The program `BlueCoinRoute.js` defines the different endpoints for the blue coin REST API.

    The details of the endpoints are shown below.

    | Endpoint                                | Method | Body                                                                                             | Example                                                                                                                 |
    |-----------------------------------------|--------|--------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
    | `/generateInitialCoin/:userId/:mspId`   | POST   | none                                                                                             | `/generateInitialCoin/user1/Org1MSP`                                                                                    |
    | `/getBalance/:userId/:mspId`            | GET    | none                                                                                             | `/getBalance/user1/Org1MSP`                                                                                             |
    | `/transferCoin/:userId`                 | POST   | `{`<br> `  "srcMspId": <srcMspId>,`<br> `  "dstMspId": <dstMspId>,`<br> `  "amt": <amt>`<br> `}` | `/transferCoin/user1`<br> `{`<br> `  "srcMspId": "Org1MSP",`<br> `  "dstMspId": "Org2MSP",`<br> `  "amt": "150"`<br> `}`  |
    | `/getTransactionHistory/:userId/:mspId` | GET    | none                                                                                             | `/getTransactionHistory/user1/Org1MSP`                                                                                  |

    The endpoints enumerated above are incorporated in `app.js` using the path `/blue-coin`.  This means that all the endpoints starts with the said path (e.g., `/blue-coin/generateInitialCoin/:userId/:mspId`).

1. Install the necessary packages.

    ````
    bc-rest> npm install
    ````

1. Start the REST API server of org1.

    ````
    bc-rest> node app.js 1
    ````

    **Expected Output:**

    ````
    Server running on port 8081
    ````

    A message states that the server is running on port `8081`.

    This means that endpoints can be accessed locally through `http://localhost:8081`.

    For example, to generate initial coins for org1 you can use the following REST API call: `http://localhost:8081/blue-coin/generateInitialCoin/user1/Org1MSP`

    In this sample REST API call, `user1` of org1 is used to call the `generateInitialCoin` through the REST API call.

    **IMPORTANT:** DO NOT press `Ctrl+C`, otherwise the REST API server for org1 will stop.

1. Open a second blue coin REST API terminal.

1. Start the REST API server of org2.

    ````
    bc-rest #2> node app.js 2
    ````

    **Expected Output:**

    ````
    Server running on port 8082
    ````

    A message states that the server is running on port `8082`.

    This means that endpoints can be accessed locally through `http://localhost:8082`.

    **IMPORTANT:** DO NOT press `Ctrl+C`, otherwise the REST API server for org2 will stop.

## Make REST API Calls using Postman

1. Open Postman.

1. Choose the method POST.

1. Type the URL `http://localhost:8081/blue-coin/generateInitialCoin/user1/Org1MSP`.

1. Click `Send`.

    **Expected Output:**

    ````
    {
        "status": 200,
        "message": "Successfully generated blue coins",
        "payload": {
            "mspId": "Org1MSP",
            "amt": 500
        }
    }
    ````

    Verify that 500 blue coins are generated for org1.

1. Repeat the steps above but use the URL `http://localhost:8082/blue-coin/generateInitialCoin/user1/Org2MSP`.

    **Expected Output:**

    ````
    {
        "status": 200,
        "message": "Successfully generated blue coins",
        "payload": {
            "mspId": "Org2MSP",
            "amt": 500
        }
    }
    ````

    Verify that 500 blue coins are generated for org2.

1. Using postman, transfer 50 coins from org1 to org2.

1. Using postman, get the balance of org1.

1. Using postman, get the balance of org2.

1. Using postman, get the transaction history of the blue coins of org1.

1. Using postman, get the transaction history of the blue coins of org2.

<br/><br/>
## Update the REST API Server.

1. Update the REST API server to include an endpoint for the chaincode function `getAllAbove`.
