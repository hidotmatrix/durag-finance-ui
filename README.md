# DURAG FINANCE on Godwoken L2 Testet chain

## RUNING THE APP ON LOCAL SYSTEM

### Clone this repo

Open terminal and run git clone https://github.com/hidotmatrix/durag-finance-ui

### Change into the directory of th repo and install dependencies

cd durag-finance-ui && yarn install

### Create .env file

Open the project in VS code/sublime and create .env file with following values

```REACT_APP_PROVIDER_URL=``` https://godwoken-testnet-v1.ckbapp.dev

```FAUNADB_SERVER_SECRET=```

```REACT_APP_SITE_RECAPTCHA_KEY=```

```SKIP_PREFLIGHT_CHECK=true```

```REACT_APP_GOOGLE_MAPS_API=```

We need to feed FaunaDB API Key, React App Site Key amd also Google Maps API key

## Building lambda functions

cd functions && yarn install

## Run The APP locally

yarn start

Here is a video to help you setup faunaDB : https://www.loom.com/share/edd028f122eb41c496f0ef357e7444fb


