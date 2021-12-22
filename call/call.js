const algosdk = require('algosdk');
const config = require('../scaffold-algo-config.json'); 
const wait_confirm = require("./waitForConfirmation.js");
const read_state = require("./readState.js");

const client = new algosdk.Algodv2(
    token = {
        'X-API-Key': config.purestake.algod.key
      },
      host = config.purestake.algod.host,
      port = config.purestake.algod.port,
);

let mnemonic = config.mneumonic;
let sender = algosdk.mnemonicToSecretKey(mnemonic);

// interact with contract
async function change_contract_variable_to (new_variable, contractAddr, appId_){
    //await readGlobalState(client, contractAddr, appId_)
    await read_state.readGlobalState(client, contractAddr, appId_);

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

    //await waitForConfirmation(client, tx.txId);
    await wait_confirm.waitForConfirmation(client, tx.txId);

    //await readGlobalState(client, contractAddr, appId_);
    await read_state.readGlobalState(client, contractAddr, appId_);
};

// remeber : the max integer you can put in the following
// depends on how large you set "global_int" to in the deployment
change_contract_variable_to(0, "", 0); // your contract address and contract id here
