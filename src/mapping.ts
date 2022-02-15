import { Address, BigInt } from "@graphprotocol/graph-ts";
import { CreateCardCall } from "../generated/CardFactory/CardFactory";
import { CardBalance, CardHolder, CardType } from "../generated/schema";
import {
  TransferSingle,
  TransferBatch,
  ERC1155,
} from "../generated/ERC1155/ERC1155";
import { ERC20 } from "../generated/templates";
import { getOrCreateCardBalance, getOrCreateCardHolder } from "./erc20-mapping";
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
  //var cardType = CardType.load(event.params._operator.toHex()); 
  var cardType = getCardTypeFromID(event.params._id, event.address)
  if (cardType != null) {
    if (event.params._to.toHex() == ADDRESS_ZERO) {
      // UNWRAPPED
      // GET USER SENDER, USER SENDER Balance
      let user_sender = getOrCreateCardHolder(event.params._from);
      let user_sender_cardBalance = getOrCreateCardBalance(event.params._from, cardType.address.toHex() , cardType, user_sender);
      
      // DECREASE SENDER WRAPPED BALANCE
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(event.params._value);
      // INCREASE SENDER UNWRAPPED BALANCE
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.plus(event.params._value);
      user_sender_cardBalance.save();
      user_sender.holdings.push(user_sender_cardBalance.id);
      user_sender.save()
    } else if (event.params._from.toHex() == ADDRESS_ZERO) {
      // WRAP EVENT
      // IGNORE AS IT IS HANDLED IN THE OTHER MAPPING 
    } else {
      // TRANSFER
      // GET USER SENDER, GET USER SENDER CARD Balance
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_sender = getOrCreateCardHolder(event.params._from);
      let user_sender_cardBalance = getOrCreateCardBalance(event.params._from, cardType.address.toHex(), cardType, user_sender);
      
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params._to);
      let user_recevier_cardBalance = getOrCreateCardBalance(event.params._to, cardType.address.toHex(), cardType, user_recevier);
      
       // DECREASE SENDER BALANCE WRAPPED AND save
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(event.params._value);
      user_sender_cardBalance.save()
      user_sender.holdings.push(user_sender_cardBalance.id);
      user_sender.save();
      // INCREASE RECEIVER BALANCE WRAPPED AND save
      user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(event.params._value);
      user_recevier_cardBalance.save();
      user_recevier.holdings.push(user_recevier_cardBalance.id);
      user_recevier.save()
    }
  } else {
    throw "CardType does not exist";
  }
}

export function getCardTypeFromID(id: BigInt, address : Address): CardType {
  let contract = ERC1155.bind(address);
  var nftAddress = contract.contracts(id);
  var cardType = CardType.load(nftAddress.toHex());
  if (cardType != null) return cardType;
  else throw "CardType does not exist";
}


