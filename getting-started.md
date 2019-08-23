# Getting Started

To do the Blockchain training laboratory exercises, you need to install the necessary software and files.

## Install Software

1. Download and install Git Bash.

    https://git-scm.com/downloads

1. Download and install NodeJS.

    https://nodejs.org/en/download/

    **Note:** Use the LTS version

    Installing Node.js will also install the NodeJS Package Manager (NPM).

1. Open a Git Bash terminal.

    In the succeeding steps, when you see the prompt below, it means that a command needs to be executed in the Git Bash terminal.

    ````
    >
    ````

1. Change the version of NPM.

    ````
    > npm install npm@5.6.0 -g
    ````

1. Download and install VSCode.

    https://code.visualstudio.com/download

1. Download and install Python.

    https://www.python.org/downloads/windows/

    **Note:** Use version 2.x.x

1. Download and install Docker Desktop.

    https://www.docker.com/products/docker-desktop

    **Note:** You may need to create a Docker ID to download the software.

1. Test the Docker Desktop installation

    ````
    > docker version
    > docker run hello-world 
    ````

    **IMPORTANT:**
    When you continue with the succeeding steps and encounter at least one of the following errors:

    ````
    Mount C. This shared resource does not exist.
    ````

    or

    ````
    Drive sharing failed for an unknown reason
    ````

    or

    ````
    Drive has not been shared
    ````

    refer to the troubleshooting section at the end of this document to fix the error.

1. Download and install Postman.

    https://www.getpostman.com/downloads/

1. Install the Hyperledger Fabric platform-specific binaries.

    ````
    > mkdir -p /c/blockchain-training
    > cd /c/blockchain-training
    > curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.1 1.4.1 0.4.15
    ````

## Setup the Git Environment

1. Run the following commands.

    ````
    > git config --global core.autocrlf false
    > git config --global core.longpaths true
    ````

1. Check the setting of these parameters with the following commands.

    ````
    > git config --get core.autocrlf
    > git config --get core.longpaths
    ````

## Install Prerequisite NodeJS Packages

1. Install Visual Studio C++ Build Tools.

    ````
    > npm install --global windows-build-tools
    ````

1. Install GRPC module.

    ````
    > npm install --global grpc
    ````

## Copy the Training Materials

1. Clone the blockchain tutorial

    ````
    > cd /c/blockchain-training
    > git clone https://github.com/pong-pantola/blockchain-tutorial.git
    ````
1. Clone the NoedJS tutorial

    ````
    > cd /c/blockchain-training    
    > git clone https://github.com/pong-pantola/nodejs-tutorial.git
    ````

## Test the Setup

1. Start the blockchain network.

    ````
    > cd /c/blockchain-training/blockchain-tutorial/chaincode
    > ./quick-setup.sh blue-coin-no-acl blue-coin 1.0
    ````

    This may take several minutes.

    You should see the message:
    ````
    Quick setup for chaincode blue-coin is complete.
    ````

1. Invoke a command in the chaincode.

    ````
    > docker exec cli0.org1 peer chaincode invoke \
      -o orderer.example.com:7050 \
      -C mychannel -n blue-coin \
      -c '{"function":"generateInitialCoin","Args":["Org1MSP"]}'
    ````

    You should see a message that contains the following:
    ````
    chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 payload:"{\"status\":200,\"message\":\"Successfully generated blue coins\",\"payload\":{\"mspId\":\"Org1MSP\",\"amt\":500}}"
    ````

1. Install the necessary packages in the sample NodeJS program.

    ````
    > cd /c/blockchain-training/blockchain-tutorial/client/blue-coin
    > npm install
    ````

    This may take several minutes.

1. Run the sample NodeJS program.

    ````
    > node enrollAdmin.js 1
    ````

    You should see the message:
    ````
    Enrolling Administrator admin of org1...
    Administrator admin of org1 enrolled successfully.
    ````

## Troubleshooting Share Error

Do this step **ONLY** if you encounter this error:

````
Mount C. This shared resource does not exist.
````

or

````
Drive sharing failed for an unknown reason
````

or

````
Drive has not been shared
````

1. Click the Start Window icon and select Settings (i.e., Gear icon).

1. In the `Find a Setting` textbox, type `accounts`.

1. Choose `Add, edit, or remove other users`.

1. Take note of the `Administrator` account name that starts with `AzureAD\`.

    For example if you see `AzureAD\JUANDELACRUZ`, please remember the account name `JUANDELACRUZ`.  

    You will create an account later with exactly the same name.

1. Choose `Add someone else to this PC`.

1. Click `I don't have this person's sign-in information`.

1. Click `Add a user without a Microsoft account`.

1. In the `User name` textbox, type the account name you took note earlier.

    **Note:**
    Do not type `AzureAD\`

1. In the password textbox, you can use a different password from the one you use when logging in to your machine.

1. Fill-up the security questions/answers textboxes.

1. Click `Next`.

1. The newly created account should appear under `Other users`.

1. Click the newly created account.

1. Click `Change account type`.

1. In the `Account type` drop-down list, select `Administrator`.

1. Click `OK`.

1. In the system tray (near the system time), look for the icon of Docker Desktop.

    Docker Desktop icon is a combination of a ship and a whale.

    If you cannot find this icon, possibly it is in the `Hidden Icons` of the system tray.  Click the up arrow `^` near the system time to show the `Hidden Icons` tray.

1. Click the icon of Docker Desktop.

    A pop-u menu will appear.

1. Click `Settings`.

1. Click `Shared Drives`.

1. Click the checkbox for `C`.

1. Click `Apply`.

1. When prompted for a username and password, type the credentials of your newly created account.
