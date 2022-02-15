import { Address, BigInt } from "@graphprotocol/graph-ts";
import { CreateCardCall } from "../generated/CardFactory/CardFactory";
import { CardBalance, CardHolder, CardType } from "../generated/schema";
import {
  TransferSingle,
  TransferBatch,
  ERC1155,
} from "../generated/ERC1155/ERC1155";
import { ERC20 } from "../generated/templates";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const ERC1155_ADDRESS = "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313";

export function handleCreateCard(call: CreateCardCall): void {
  let cardType = new CardType(call.outputs.value0.toHex());

  cardType.supply = call.inputs._initialAmount;
  cardType.address = call.outputs.value0;
  cardType.symbol = call.inputs._symbol;
  cardType.description = call.inputs._desc;
  cardType.name = call.inputs._name;
  cardType.ipfsHash = call.inputs._ipfshash;
  cardType.save();

  ERC20.create(call.outputs.value0);
}
// ERC1155 Events

export function handleTransferSingle(event: TransferSingle): void {
  var cardType = CardType.load(event.params._operator.toHex());
  if (cardType != null) {
    if (event.params._to.toHex() == ADDRESS_ZERO) {
      // UNWRAPPED
      // GET USER SENDER, USER SENDER Balance
      // DECREASE SENDER WRAPPED BALANCE
      // INCREASE SENDER UNWRAPPED BALANCE
    } else if (event.params._from.toHex() == ADDRESS_ZERO) {
      //IGNORE AS IT IS HANDLED IN THE OTHER MAPPING
    } else {
      // TRANSFER
      // GET USER SENDER, GET USER SENDER CARD Balance
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      // DECREASE SENDER BALANCE WRAPPED AND save
      // INCREASE RECEIVER BALANCE WRAPPED AND save
    }
  } else {
    throw "CardType does not exist";
  }
}

export function getCardTypeFromID(id: BigInt): CardType {
  let contract = ERC1155.bind(Address.fromHexString(ERC1155_ADDRESS));
  var address = contract.contracts(id);
  var cardType = CardType.load(address.toHex());
  if (cardType != null) return cardType;
  else throw "CardType does not exist";
}
