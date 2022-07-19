# DURAG FINANCE on Godwoken L2 Testet chain

#RUNING THE APP ON LOCAL SYSTEM

## Clone this repo

open terminal and run git clone https://github.com/hidotmatrix/nervos-unisocks-clone-V2.git

## cd into the directory of th repo and install dependencies

cd nervos-unisocks-clone-V2 && yarn install

## Create .env file

open the project in VS code/sublime and create .env file with following values

REACT_APP_PROVIDER_URL=https://godwoken-testnet-v1.ckbapp.dev

FAUNADB_SERVER_SECRET=

REACT_APP_SITE_RECAPTCHA_KEY=

SKIP_PREFLIGHT_CHECK=true

REACT_APP_GOOGLE_MAPS_API=

We need to feed FaunaDB API Key, React App Site Key amd also Google Maps API key

## Building lambda functions

cd functions && yarn install

## Run The APP locally

yarn start


