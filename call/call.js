const algosdk = require('algosdk');
const config = require('../scaffold-algo-config.json'); 

const client = new algosdk.Algodv2(
    token = {
        'X-API-Key': config.purestake.algod.key
      },
      host = config.purestake.algod.host,
      port = config.purestake.algod.port,
);

let mnemonic = "" // your mneumonic here
let sender = algosdk.mnemonicToSecretKey(mnemonic);

// read global state of contract
async function readGlobalState(client, account, index){
    let accountInfoResponse = await client.accountInformation(account).do();
    for (let i = 0; i < accountInfoResponse['created-apps'].length; i++) { 
        if (accountInfoResponse['created-apps'][i].id == index) {
            console.log("Application's global state:");
            for (let n = 0; n < accountInfoResponse['created-apps'][i]['params']['global-state'].length; n++) {
                let resp = accountInfoResponse['created-apps'][i]['params']['global-state'][n];
                const buff = Buffer.from(resp.key, 'base64');
                console.log(buff.toString(), " : ", String.fromCharCode(resp.value.uint))
            }
        }
    }
}

// wati for block confirmation
const waitForConfirmation = async function (algodclient, txId) {
    let status = (await algodclient.status().do());
    let lastRound = status["last-round"];
    while (true) {
        const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
            //Got the completed Transaction
            console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
            break;
        }
        lastRound++;
        await algodclient.statusAfterBlock(lastRound).do();
    }
}; 

  // interact with contract
async function change_contract_variable_to (new_variable, contractAddr, appId_){
    await readGlobalState(client, contractAddr, appId_)

    let params = await client.getTransactionParams().do();

    const enc = new TextEncoder();
    let note_ = enc.encode(new_variable);
    let note = new Uint8Array(Buffer.from(note_, "base64"));

    var appArgs = [note]
    let appId = appId_;
    const callTxn = algosdk.makeApplicationNoOpTxn(
        sender.addr,
        params,
        appId,
        appArgs,
      );

    const signedCallTxn = callTxn.signTxn(sender.sk);
    const tx = await client.sendRawTransaction(signedCallTxn) .do();

    await waitForConfirmation(client, tx.txId);

    await readGlobalState(client, contractAddr, appId_)
};

change_contract_variable_to(666, "", ); // your contract address and contract id here
