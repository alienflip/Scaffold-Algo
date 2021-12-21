const algosdk = require('algosdk');
const config = require('../scaffold-algo-config.json'); 

const client = new algosdk.Algodv2(
    token = {
        'X-Api-Key': config.purestake.algod.key
      },
      host = config.purestake.algod.host,
      port = config.purestake.algod.port,
);
// read the variable in the contract on-chain to local console
module.exports.readGlobalState = async function (client, account, index){
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
