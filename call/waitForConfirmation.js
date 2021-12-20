const algosdk = require('algosdk');
const config = require('../scaffold-algo-config.json'); 

const client = new algosdk.Algodv2(
    token = {
        'x-api-key': config.tatum.algod.key
      },
      host = config.tatum.algod.host,
      port = config.tatum.algod.port,
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
