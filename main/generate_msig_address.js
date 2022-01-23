const algosdk = require('algosdk');
let ENV = require("../ENV.json");

async function main() {

    // load msig accounts
    let account1 = ENV.bridge.multisigAddresses[0];
    let account2 = ENV.bridge.multisigAddresses[1];
    let account3 = ENV.bridge.multisigAddresses[2];

    //Setup the parameters for the multisig account
    const mparams = {
        version: 1,
        threshold: 2,
        addrs: [
            account1,
            account2,
            account3,
        ],
    };

    let multsigaddr = algosdk.multisigAddress(mparams);
    console.log("Multisig Address: " + multsigaddr);
}
main();