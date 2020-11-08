#!/bin/bash

## This script is need to be set in the target server

set -ex;

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

pushd /home/appuser/webapp
  pm2 stop webapp || true;
  pm2 delete webapp || true;
  npm install;
  pm2 start server.js --name "webapp";
popd