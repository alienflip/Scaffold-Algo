from pyteal import *

# boilerplate
def clear():
   program = Return(Int(1))
   return compileTeal(program, Mode.Application, version=5)
