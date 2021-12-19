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

<p align="center"> :sun_with_face: Deploy a contract to testnet easily! :sun_with_face:</p>
<p align="center">🍄 In this framework, we interact with a contract to set it's global variable and read the display the change locally 🍄</p>


-----
-----
-----

## Pre-Requisites

> install [python](https://docs.python-guide.org/starting/install3/linux/) <

> install [node](https://nodejs.org/en/download/package-manager/) <

> create an [algorand account on testnet](https://wallet.myalgo.com) for your mneumonic <

> fund it with [algos](https://thealgofaucet.com/) <

> register on [purestake](https://developer.purestake.io/) for your API key <

-----

## Clone this repo

```
git clone git@github.com:alienflip/Scaffold-Algo.git
cd Scaffold-Algo
npm install algosdk
pip install pyteal
```

## Set network + account config

in `scaffold-algo-config.json` 

> insert the API key from purestake in the `key` field <

> insert your account mneumonic in the `mneumonic` field <


## Compile + deploy contract

```
cd ~/Scaffold-Algorand/deploy
python3 deploy.py
```

## Call contract

here you can mess around with setting the contracts variable, and watch the change live!

```
cd ~/Scaffold-Algorand/call
node call.js
```

-----
-----

### Tatum Support In Development

<p align="center"> :heavy_dollar_sign: 🍄 :heavy_dollar_sign: </p>
