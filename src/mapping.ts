import { BigInt } from "@graphprotocol/graph-ts"
import {
  CardFactory,
  CreateCardCall,
  Approval,
  Transfer
} from "../generated/CardFactory/CardFactory"
import { Card, CardType } from "../generated/schema"
import {
  ERC1155,
  OwnershipTransferred,
  TransferSingle,
  TransferBatch,
  ApprovalForAll,
  URI
} from "../generated/ERC1155/ERC1155"

export function handleCreateCard(call: CreateCardCall): void {
  
  
    
  let cardType = new CardType(call.outputs.value0.toHex())


  cardType.supply = call.inputs._initialAmount;
  cardType.symbol = call.inputs._symbol;
  cardType.description = call.inputs._desc;
  cardType.name = call.inputs._name;
  cardType.ipfsHash = call.inputs._ipfshash;
  cardType.save();
}

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
 // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.name(...)
  // - contract.approve(...)
  // - contract.totalSupply(...)
  // - contract.transferFrom(...)
  // - contract.decimals(...)
  // - contract.balanceOf(...)
  // - contract.symbol(...)
  // - contract.transfer(...)
  // - contract.allowance(...)
}

export function handleTransfer(event: Transfer): void {}

// ERC1155 Events

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  // Entities can be loaded from the store using a string ID; this ID
 
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOf(...)
  // - contract.supportsInterface(...)
  // - contract.uri(...)
  // - contract.contracts(...)
  // - contract.balanceOfBatch(...)
  // - contract.exists(...)
  // - contract.owner(...)
  // - contract.isOwner(...)
  // - contract.proxyRegistryAddress(...)
  // - contract.metadatas(...)
  // - contract.isApprovedForAll(...)
}

export function handleTransferSingle(event: TransferSingle): void {}

export function handleTransferBatch(event: TransferBatch): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleURI(event: URI): void {}
