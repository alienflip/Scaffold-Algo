const algosdk = require('algosdk');
const config = require('../scaffold-algo-config.json'); 

const client = new algosdk.Algodv2(
    token = {
        'X-API-Key': config.purestake.algod.key
      },
      host = config.purestake.algod.host,
      port = config.purestake.algod.port,
);

// wati for block confirmation
module.exports.waitForConfirmation = async function (algodclient, txId) {
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
