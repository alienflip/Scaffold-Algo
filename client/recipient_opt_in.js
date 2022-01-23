let algosdk = require("algosdk");
let ENV = require("../ENV.json");
let {waitForConfirmation, printAssetHolding} = require("../utils/utils")

async function main() {

    // connect client
    let algodclient = new algosdk.Algodv2(ENV.token, ENV.algod, "");
    let params = await algodclient.getTransactionParams().do();

    // load deployer data
    let senderMneumonic = ENV.client.recipientMneumonic;
    let receiver = algosdk.mnemonicToSecretKey(senderMneumonic);

    // Transaction details
    let sender = receiver.addr;
    let recipient = sender;
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    let amount = 0;
    let note = new Uint8Array(0);
    let assetID = 0;

    // signing and sending "txn" allows sender to begin accepting asset specified by creator and index
    let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender, 
        recipient, 
        closeRemainderTo, 
        revocationTarget,
        amount, 
        note, 
        assetID, 
        params
    );

    // Must be signed by the account wishing to opt in to the asset    
    rawSignedTxn = opttxn.signTxn(receiver.sk);
    let opttx = (await algodclient.sendRawTransaction(rawSignedTxn).do());

    // wait for transaction to be confirmed
    await waitForConfirmation(algodclient, opttx.txId);

    //You should now see the new asset listed in the account information
    console.log("Account : " + receiver.addr);
    await printAssetHolding(algodclient, receiver.addr, assetID);
}

main();