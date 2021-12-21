import sys, json, base64
sys.path.insert(0, '..')

# load contracts
from contract.set_variable import set_variable
from contract.clear import clear

# basic algo network deployment requirements
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

# compile contracts
def compile_program(client, source_code):
    compile_response = client.compile(source_code)
    return base64.b64decode(compile_response['result'])

def return_compiled_program():

    with open("./set_variable.teal", "w") as f:
        set_variable_contract = set_variable()
        f.write(set_variable_contract)

    with open("./clear.teal", "w") as f:
        clear_contract = clear()
        f.write(clear_contract)

    set_variable_program_compiled = compile_program(algod_client, set_variable_contract)
    clear_program_compiled = compile_program(algod_client, clear_contract)

    return set_variable_program_compiled, clear_program_compiled
