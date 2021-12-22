from pyteal import *

def set_variable():

   # global variable to be set    
   handle_creation = Seq([
       App.globalPut(Bytes("Variable"), Int(0)),
       Return(Int(1))
   ])

   # temporary space allocated, and destroyed on transaction close
   scratchCount = ScratchVar(TealType.uint64)

   # set the variable on contract call using the application args field
   setVar = Seq([
       scratchCount.store(App.globalGet(Bytes("Variable"))),
       App.globalPut(Bytes("Variable"), Btoi(Txn.application_args[0])),
       Return(Int(1))
   ])

   # boilderplate
   program = Cond(
       [Txn.application_id() == Int(0), handle_creation],
       [Txn.on_completion() == OnComplete.OptIn, Return(Int(0))],
       [Txn.on_completion() == OnComplete.CloseOut, Return(Int(0))],
       [Txn.on_completion() == OnComplete.UpdateApplication, Return(Int(0))],
       [Txn.on_completion() == OnComplete.DeleteApplication, Return(Int(0))],
       [Txn.on_completion() == OnComplete.NoOp, setVar]
   )
   
   return compileTeal(program, Mode.Application, version=5)
