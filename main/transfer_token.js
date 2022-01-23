let algosdk = require("algosdk");
let ENV = require("../ENV.json");
let {waitForConfirmation, printAssetHolding} = require("../utils/utils")

async function main() {

    // connect client
    let algodclient = new algosdk.Algodv2(ENV.token, ENV.algod, "");
    let params = await algodclient.getTransactionParams().do();

    // load deployer data
    let deployerMneumonic = ENV.bridge.deployerMneumonic;
    let recipientMneumonic = ENV.client.recipientMneumonic;
    let deployer = algosdk.mnemonicToSecretKey(deployerMneumonic);
    let recipient = algosdk.mnemonicToSecretKey(recipientMneumonic);
    
    // Transaction details
    let sender = deployer.addr;
    let receiver = recipient.addr;
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    let amount = 10;
    let note = new Uint8Array(0);
    let assetID = ENV.assetId;

    // signing and sending "txn" will send "amount" assets from "sender" to "recipient"
    let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender, 
        receiver, 
        closeRemainderTo, 
        revocationTarget,
        amount,  
        note, 
        assetID, 
        params
    );

    // Must be signed by the account sending the asset  
    let rawSignedTxn = xtxn.signTxn(deployer.sk)
    let xtx = await algodclient.sendRawTransaction(rawSignedTxn).do();

    // wait for transaction to be confirmed
    await waitForConfirmation(algodclient, xtx.txId);

    // You should now see the 10 assets listed in the account information
    console.log("Account : " + receiver);
    await printAssetHolding(algodclient, recipient.addr, assetID);
}

main();