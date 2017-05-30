#!/bin/bash 

if hash npm 2>/dev/null; then
    echo "node & npm is installed" 
else
    # Add new source and install nodejs using apt (much faster then from source)
    curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash
    sudo apt-get install -y nodejs
fi
