import sys, json, base64
sys.path.insert(0, '..')

# load contracts
from contracts.set_variable import set_variable
from contracts.clear import clear

# helper function for deployment and smart contntract compilation
from waitForConfirmation import wait_for_confirmation

# basic algo network deployment requirements
from algosdk.future import transaction
from algosdk import account, mnemonic, logic
from algosdk.v2client import algod

# load network config
with open("../scaffold-algo-config.json", "r") as read_file:
    config = json.load(read_file)

# connect to purestake
algod_client = algod.AlgodClient(
    algod_token = config["purestake"]["algod"]["port"], 
    algod_address = config["purestake"]["algod"]["host"],
    headers = {'X-API-Key': config["purestake"]["algod"]["key"]}
)

# give your account permission to deploy
creator_mnemonic = config["mneumonic"]
private_key = mnemonic.to_private_key(creator_mnemonic)

# compile contracts
def compile_program(client, source_code):
    compile_response = client.compile(source_code)
    return base64.b64decode(compile_response['result'])

with open("./set_variable.teal", "w") as f:
    set_variable_contract = set_variable()
    f.write(set_variable_contract)

with open("./clear.teal", "w") as f:
    clear_contract = clear()
    f.write(clear_contract)

set_variable_program_compiled = compile_program(algod_client, set_variable_contract)
clear_program_compiled = compile_program(algod_client, clear_contract)

# create new application
def create_app(client, private_key, approval_program, clear_program, global_schema, local_schema):
    # define sender as creator
    sender = account.address_from_private_key(private_key)

    # declare on_complete as NoOp
    on_complete = transaction.OnComplete.NoOpOC.real

    # get node suggested parameters
    params = client.suggested_params()

    # create unsigned transaction
    txn = transaction.ApplicationCreateTxn(sender, params, on_complete, \
                                            approval_program, clear_program, \
                                            global_schema, local_schema)

    # sign transaction
    signed_txn = txn.sign(private_key)
    tx_id = signed_txn.transaction.get_txid()

    # send transaction
    client.send_transactions([signed_txn])

    # await confirmation
    wait_for_confirmation(client, tx_id, 5)

    # display results
    transaction_response = client.pending_transaction_info(tx_id)
    app_id = transaction_response['application-index']
    print("Created new app-id:", app_id)

    return app_id

# declare application state storage (immutable)
local_ints, local_bytes, global_bytes, global_ints = 1, 1, 1, 1
global_schema = transaction.StateSchema(global_ints, global_bytes)
local_schema = transaction.StateSchema(local_ints, local_bytes)

print("--------------------------------------------")
print("Deploying application......")

# deploy new application
app_id = create_app(algod_client, private_key, set_variable_program_compiled, clear_program_compiled, global_schema, local_schema)

print("--------------------------------------------")
