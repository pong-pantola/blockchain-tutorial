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

    When you do the laboratory exercises later and you encounter the following error:

    `Mount C. This shared resource does not exist.`

    refer to the following link to fix the problem:

    https://tomssl.com/2018/01/11/sharing-your-c-drive-with-docker-for-windows-when-using-azure-active-directory-azuread-aad/

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
