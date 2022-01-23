let algosdk = require("algosdk");
let ENV = require("../ENV.json");
let {waitForConfirmation} = require("../utils/utils");

async function main() {

    // connect client
    let algodclient = new algosdk.Algodv2(ENV.token, ENV.algod, "");
    let params = await algodclient.getTransactionParams().do();

    // load deployer data
    let deployerMneumonic = ENV.bridge.deployerMneumonic;
    let deployer = algosdk.mnemonicToSecretKey(deployerMneumonic);

    // managed by account generated in /generate_msig_address
    let manager = ENV.msigAccountAddress; 

    // Define asset  
    let defaultFrozen = false;
    let totalIssuance = 1e9; 
    let decimals = 0; 
    let reserve = deployer.addr;
    let freeze = deployer.addr; 
    let clawback = deployer.addr; 
    let unitName = "ZBToken";
    let assetName = "zeeeb";
    let note = new Uint8Array(0);
    let assetURL = "";
    let assetMetadataHash = "";

    // create asset blob
    let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
        deployer.addr, 
        note,
        totalIssuance, 
        decimals, 
        defaultFrozen, 
        manager, 
        reserve, 
        freeze,
        clawback, 
        unitName, 
        assetName, 
        assetURL, 
        assetMetadataHash, 
        params
    );

    // sign and send transaction
    let rawSignedTxn = txn.signTxn(deployer.sk)
    let tx = await algodclient.sendRawTransaction(rawSignedTxn).do();
    
    // wait for transaction to be confirmed
    await waitForConfirmation(algodclient, tx.txId);
    
    // Get the new asset's information from the creator account
    let ptx = await algodclient.pendingTransactionInformation(tx.txId).do();
    let assetID = ptx["asset-index"];
    console.log("Asset ID : " + assetID);
}

main();