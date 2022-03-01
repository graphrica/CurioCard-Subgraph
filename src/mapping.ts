import { Address, BigInt, log} from "@graphprotocol/graph-ts";
import { CreateCardCall } from "../generated/CardFactory/CardFactory";
import { CardType } from "../generated/schema";
import {
  TransferSingle,
  TransferBatch,
} from "../generated/ERC1155/ERC1155";
import {
  TransferSingle as TransferSingleUnofficial,
  TransferBatch as TransferBatchUnofficial
} from "../generated/ERC1155Unofficial/ERC1155Unofficial";
import { ERC20 } from "../generated/templates";
import { getOrCreateCardBalance, getOrCreateCardHolder, clearEmptyCardBalance, getCardTypeFromID} from "./functions";
import { ERC1155_ADDRESS, ADDRESS_ZERO, ERC1155_WRAPPER, ERC1155Unofficial_ADDRESS } from "./constants";

export function handleCreateCard(call: CreateCardCall): void {
  
  if(Address.fromString("0x39786ae114cb7bca7ac103cb10aab4054c0b144e") == call.outputs.value0){
    log.info("FAKE CURIO CARD MINTED - CURIO SNOW", [])
   
  }
  else if(Address.fromString("0xE0B5E6F32d657e0e18d4B3E801EBC76a5959e123") == call.outputs.value0){
    log.info("17b IGNORE", [])
    // let cardType = new CardType(call.outputs.value0.toHex());

    // cardType.supply = call.inputs._initialAmount;
    // cardType.address = call.outputs.value0;
    // cardType.symbol = call.inputs._symbol;
    // cardType.description = call.inputs._desc;
    // cardType.name = call.inputs._name.replace("Card", "");
    // cardType.ipfsHash = call.inputs._ipfshash;
    // cardType.save();
   
  }
  else { 
    let cardType = new CardType(call.outputs.value0.toHex());

    cardType.supply = call.inputs._initialAmount;
    cardType.address = call.outputs.value0;
    cardType.symbol = call.inputs._symbol;
    cardType.description = call.inputs._desc;
    cardType.name = call.inputs._name.replace("Card", "");
    cardType.ipfsHash = call.inputs._ipfshash;
    cardType.save();

    ERC20.create(call.outputs.value0);
  }
}
// ERC1155 Official Events

export function handleTransferSingle(event: TransferSingle): void {
  
  var cardType = getCardTypeFromID(event.params._id, ERC1155_ADDRESS);
  if (cardType != null) {
    if (event.params._to == ADDRESS_ZERO && event.params._from == ERC1155_ADDRESS) {
      // UNWRAPPED
     
      // GET USER SENDER, USER SENDER Balance
      let user_sender = getOrCreateCardHolder(event.params._operator);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params._operator,
        cardType,
        user_sender
      );

      // DECREASE SENDER WRAPPED BALANCE
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        event.params._value
      );
      // INCREASE SENDER UNWRAPPED BALANCE
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.plus(
        event.params._value
      );
      user_sender_cardBalance.save();
      user_sender.save();
      log.info("ERC1155 UNWRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    } else if (event.params._from == ADDRESS_ZERO && event.params._operator != ERC1155_WRAPPER) {
      // WRAP EVENT
      // let user_recevier = getOrCreateCardHolder(event.params._to);
      // let user_recevier_cardBalance = getOrCreateCardBalance(event.params._to, cardType, user_recevier);

     
      // user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.minus(event.params._value);
      // user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(event.params._value);
      // user_recevier_cardBalance.save();
      // user_recevier.save()
      log.info("IGNORE ERC1155 WRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    } else {
      // TRANSFER
      // GET USER SENDER, GET USER SENDER CARD Balance
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_sender = getOrCreateCardHolder(event.params._from);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params._from,
        cardType,
        user_sender
      );

      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params._to);
      let user_recevier_cardBalance = getOrCreateCardBalance(
        event.params._to,
        cardType,
        user_recevier
      );

      // DECREASE SENDER BALANCE WRAPPED AND save
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        event.params._value
      );
      user_sender_cardBalance.save();
      user_sender.save();
      // INCREASE RECEIVER BALANCE WRAPPED AND save
      user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(
        event.params._value
      );
      user_recevier_cardBalance.save();
      user_recevier.save();
      //Check sender balance
      clearEmptyCardBalance(user_sender_cardBalance);
      log.info("ERC1155 TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    }
  } else {
    throw "CardType does not exist";
  }
}

export function handleTransferBatch(event: TransferBatch): void {
  var arrayLength = event.params._ids.length;
  for(var i = 0; i < arrayLength; i++){
    var cardId = event.params._ids[i];
    var amount = event.params._values[i];

    var cardType = getCardTypeFromID(cardId, ERC1155_ADDRESS);
    if (cardType != null) {
      // TRANSFER
      // GET USER SENDER, GET USER SENDER CARD Balance
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_sender = getOrCreateCardHolder(event.params._from);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params._from,
        cardType,
        user_sender
      );

      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params._to);
      let user_recevier_cardBalance = getOrCreateCardBalance(
        event.params._to,
        cardType,
        user_recevier
      );

      // DECREASE SENDER BALANCE WRAPPED AND save
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        amount
      );
      user_sender_cardBalance.save();
      user_sender.save();



      // INCREASE RECEIVER BALANCE WRAPPED AND save
      user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(
        amount
      );
      user_recevier_cardBalance.save();
      user_recevier.save();
      clearEmptyCardBalance(user_sender_cardBalance);
      log.info("ERC1155 BATCH TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),amount.toHexString(), cardId.toHexString() ])
    }
  }
}


export function handleTransferBatchUnofficial(event: TransferBatchUnofficial): void {
  
  var arrayLength = event.params._ids.length;
  for(var i = 0; i < arrayLength; i++){
    var cardId = event.params._ids[i];
    var amount = event.params._values[i];
    if(cardId == BigInt.fromI32(171)){
      log.info("MISPRINT TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),amount.toHexString(), cardId.toHexString() ])
    }
    else
    {
    var cardType = getCardTypeFromID(cardId, ERC1155_ADDRESS);
    if (cardType != null) {
      // TRANSFER
      // GET USER SENDER, GET USER SENDER CARD Balance
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_sender = getOrCreateCardHolder(event.params._from);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params._from,
        cardType,
        user_sender
      );

      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params._to);
      let user_recevier_cardBalance = getOrCreateCardBalance(
        event.params._to,
        cardType,
        user_recevier
      );

      // DECREASE SENDER BALANCE WRAPPED AND save
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        amount
      );
      user_sender_cardBalance.save();
      user_sender.save();



      // INCREASE RECEIVER BALANCE WRAPPED AND save
      user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(
        amount
      );
      user_recevier_cardBalance.save();
      user_recevier.save();
      clearEmptyCardBalance(user_sender_cardBalance);
      log.info("ERC1155 UNOFFICAL BATCH TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),amount.toHexString(), cardId.toHexString() ])
    }
  }
}
}



export function handleTransferSingleUnofficial(event: TransferSingleUnofficial): void {
  if(event.params._id == BigInt.fromI32(171)){
    log.info("MISPRINT TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
  }
  else
  {
  var cardType = getCardTypeFromID(event.params._id, ERC1155_ADDRESS);
  if (cardType != null) {
    if (event.params._operator == ADDRESS_ZERO) {
      // UNWRAPPED
     
      // GET USER SENDER, USER SENDER Balance
      let user_sender = getOrCreateCardHolder(event.params._to);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params._to,
        cardType,
        user_sender
      );

      // DECREASE SENDER WRAPPED BALANCE
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        event.params._value
      );
      // INCREASE SENDER UNWRAPPED BALANCE
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.plus(
        event.params._value
      );
      user_sender_cardBalance.save();
      user_sender.save();
      log.info("ERC1155 UNOFFICAL UNWRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    } else if (event.params._from == ADDRESS_ZERO) {
      // WRAP EVENT
      // let user_recevier = getOrCreateCardHolder(event.params._to);
      // let user_recevier_cardBalance = getOrCreateCardBalance(event.params._to, cardType, user_recevier);

     
      // user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.minus(event.params._value);
      // user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(event.params._value);
      // user_recevier_cardBalance.save();
      // user_recevier.save()
      log.info("IGNORE ERC1155 UNOFFICAL WRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    } else {
      // TRANSFER
      // GET USER SENDER, GET USER SENDER CARD Balance
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_sender = getOrCreateCardHolder(event.params._from);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params._from,
        cardType,
        user_sender
      );

      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params._to);
      let user_recevier_cardBalance = getOrCreateCardBalance(
        event.params._to,
        cardType,
        user_recevier
      );

      // DECREASE SENDER BALANCE WRAPPED AND save
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        event.params._value
      );
      user_sender_cardBalance.save();
      user_sender.save();
      // INCREASE RECEIVER BALANCE WRAPPED AND save
      user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(
        event.params._value
      );
      user_recevier_cardBalance.save();
      user_recevier.save();
      clearEmptyCardBalance(user_sender_cardBalance);
      log.info("ERC1155 UNOFFICAL TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    }
  } 
  } 
}
