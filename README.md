<h1 align="center">
  <br>
  Scaffold Algorand
  <br>
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/pyteal-v0.9.1-blue"></img>
  <img src="https://img.shields.io/badge/npm-v8.1.2-red"></img>
  <img src="https://img.shields.io/badge/node-v16.13.1-green"></img>
  <img src="https://img.shields.io/badge/algosdk-v1.12.0-orange"></img>
</p>

<p align="center"> :sun_with_face: Deploy ASA to testnet, with multi-account ownership! :sun_with_face:</p>
<p align="center">🍄 In this framework, we interact with an ASA using layer 2 functionality 🍄</p>

-----
-----
-----

## Pre-Requisites

> running linux, or using [wsl](https://ubuntu.com/wsl) <

> install [node](https://nodejs.org/en/download/package-manager/) <

> create an [algorand account on testnet](https://wallet.myalgo.com) for your mneumonic <

> fund it with [algos](https://thealgofaucet.com/) <

> register on [purestake](https://developer.purestake.io/) or [tatum](https://dashboard.tatum.io/) for your API key <

>> Note that you will have to change some script headers depending on which network you use. It defaults to purestake<

-----

## Clone this repo

```
git clone git@github.com:alienflip/Scaffold-Algo.git
cd Scaffold-Algo
npm install algosdk
```

## Set network + account config

in `scaffold-algo-config.json` 

> insert the API key from purestake or tatum in the `key` field <

> insert your account mneumonic in the `mneumonic` field <


## Deploy ASA

```
cd ~/Scaffold-Algorand/main
node generate_token.js
```

## Client Opt-In ASA

>> copy id from `generate_token.js` into `recipient_opt_in.js`

```
cd ~/Scaffold-Algorand/client
node recipient_opt_in.js
```

## Transfer ASA
```
cd ~/Scaffold-Algorand/main
node transfer_token.js
```

## Change msig addresses (in dev)
```
cd ~/Scaffold-Algorand/main
node rekey.js
```

-----
-----

<p align="center"> :heavy_dollar_sign: 🍄 :heavy_dollar_sign: </p>
