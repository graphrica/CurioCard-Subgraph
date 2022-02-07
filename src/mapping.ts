import { BigInt } from "@graphprotocol/graph-ts"
import {
  CreateCardCall,
} from "../generated/CardFactory/CardFactory"
import { CardType } from "../generated/schema"
import {
  TransferSingle,
  TransferBatch,
} from "../generated/ERC1155/ERC1155"
import { ERC20 } from '../generated/templates'
export function handleCreateCard(call: CreateCardCall): void {  
  let cardType = new CardType(call.outputs.value0.toHex())


  cardType.supply = call.inputs._initialAmount;
  cardType.symbol = call.inputs._symbol;
  cardType.description = call.inputs._desc;
  cardType.name = call.inputs._name;
  cardType.ipfsHash = call.inputs._ipfshash;
  cardType.save();

  ERC20.create(call.outputs.value0)
}

// ERC1155 Events

export function handleTransferSingle(event: TransferSingle): void {

}

export function handleTransferBatch(event: TransferBatch): void {}

