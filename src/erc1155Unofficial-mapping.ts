import { WrapCall, UnwrapCall, TransferBatch } from "../generated/ERC1155Unofficial/ERC1155Unofficial";
import { log, BigInt } from "@graphprotocol/graph-ts";
import { ADDRESS_ZERO, OPENSEA_V1 } from "./constants";
import { getCardTypeFromID, getOrCreateCardHolder, getOrCreateCardBalance, clearEmptyCardBalance, checkIfSentToSelf } from "./functions";
import {
    TransferSingle
  } from "../generated/ERC1155Unofficial/ERC1155Unofficial";


export function handleUnofficialWrap(call: WrapCall): void {
    var cardType = getCardTypeFromID(call.inputs.id);
    if (cardType != null) {
        let user_recevier = getOrCreateCardHolder(call.from);
        let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier, call.block.number);
  
        user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.minus(call.inputs.amount);
        user_recevier_cardBalance.wrappedUnofficial = user_recevier_cardBalance.wrappedUnofficial.plus(call.inputs.amount);
        user_recevier_cardBalance.save();
        user_recevier.save()
        log.info(
            "UNOFFICAL WRAP HANDLER- txfrom: {}, from: {}, to: {}, inputTo: {}, value: {}, txHash: {}",
            [
              call.transaction.from.toHexString(),
              call.from.toHexString(),
              call.to.toHexString(),
              call.inputs.id.toHexString(),
              call.inputs.amount.toHexString(),
              call.transaction.hash.toHexString(),
            ]
          );   
    }
}
export function handleUnofficialUnwrap(call: UnwrapCall): void {
    var cardType = getCardTypeFromID(call.inputs.id);
    if (cardType != null) {
        let user_recevier = getOrCreateCardHolder(call.from);
        let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier, call.block.number);
  
        user_recevier_cardBalance.wrappedUnofficial = user_recevier_cardBalance.wrappedUnofficial.minus(call.inputs.amount);
        user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.plus(call.inputs.amount);
        user_recevier_cardBalance.save();
        user_recevier.save()
        log.info(
            "UNOFFICAL UNWRAP HANDLER- txfrom: {}, from: {}, to: {}, inputTo: {}, value: {}, txHash: {}",
            [
              call.transaction.from.toHexString(),
              call.from.toHexString(),
              call.to.toHexString(),
              call.inputs.id.toHexString(),
              call.inputs.amount.toHexString(),
              call.transaction.hash.toHexString(),
            ]
          );
    }
}

export function handleTransferSingleUnofficial(
    event: TransferSingle
  ): void {
   
      if(!checkIfSentToSelf(event.params._to, event.params._from, event.params._operator) && event.params._value > BigInt.fromI32(0)) {
      var cardType = getCardTypeFromID(event.params._id);
      if (cardType != null) {
        if (event.params._operator == ADDRESS_ZERO) {
          // UNWRAPPED
          log.info(
            "ERC1155 UNOFFICAL UNWRAP EVENT (IGNORED) - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
            [
              event.params._operator.toHexString(),
              event.params._from.toHexString(),
              event.params._to.toHexString(),
              event.transaction.hash.toHexString(),
              event.params._value.toHexString(),
              event.params._id.toHexString(),
            ]
          );
        }
        else if (event.params._from == ADDRESS_ZERO) {
          // WRAP EVENT
  
          log.info(
            "WRAPPING & MINT OF ERC1155 UNOFFICIAL (IGNORE)- operator: {} from: {} to: {} txhash: {} value: {} id: {}",
            [
              event.params._operator.toHexString(),
              event.params._from.toHexString(),
              event.params._to.toHexString(),
              event.transaction.hash.toHexString(),
              event.params._value.toHexString(),
              event.params._id.toHexString(),
            ]
          );
          
        } else {
          // TRANSFER
  
          if (event.params._operator == OPENSEA_V1) {
            log.info(
              "OPENSEA V1 TRADE - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
              [
                event.params._operator.toHexString(),
                event.params._from.toHexString(),
                event.params._to.toHexString(),
                event.transaction.hash.toHexString(),
                event.params._value.toHexString(),
                event.params._id.toHexString(),
              ]
            );
          }
          // GET USER SENDER, GET USER SENDER CARD Balance
          // GET USER RECEIVER and USER RECEIVER CARD Balance
          let user_sender = getOrCreateCardHolder(event.params._from);
          let user_sender_cardBalance = getOrCreateCardBalance(
            event.params._from,
            cardType,
            user_sender,
            event.block.number
          );
  
          // GET USER RECEIVER and USER RECEIVER CARD Balance
          let user_recevier = getOrCreateCardHolder(event.params._to);
          let user_recevier_cardBalance = getOrCreateCardBalance(
            event.params._to,
            cardType,
            user_recevier,
            event.block.number
          );
  
          // DECREASE SENDER BALANCE WRAPPED AND save
          user_sender_cardBalance.wrappedUnofficial = user_sender_cardBalance.wrappedUnofficial.minus(
            event.params._value
          );
          user_sender_cardBalance.save();
          user_sender.save();
          // INCREASE RECEIVER BALANCE WRAPPED AND save
          user_recevier_cardBalance.wrappedUnofficial = user_recevier_cardBalance.wrappedUnofficial.plus(
            event.params._value
          );
          user_recevier_cardBalance.save();
          user_recevier.save();
  
          log.info(
            "ERC1155 UNOFFICAL TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
            [
              event.params._operator.toHexString(),
              event.params._from.toHexString(),
              event.params._to.toHexString(),
              event.transaction.hash.toHexString(),
              event.params._value.toHexString(),
              event.params._id.toHexString(),
            ]
          );
        clearEmptyCardBalance(user_sender_cardBalance);
      }
    }}
      else{
        log.info(
          "ERC1155 UNOFFICAL SELF SEND - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
          [
            event.params._operator.toHexString(),
            event.params._from.toHexString(),
            event.params._to.toHexString(),
            event.transaction.hash.toHexString(),
            event.params._value.toHexString(),
            event.params._id.toHexString(),
          ]
        );
      }
    
  }
  

export function handleTransferBatchUnofficial(
  event: TransferBatch
): void {
  if (!checkIfSentToSelf(event.params._to, event.params._from, event.params._operator)) {
  var arrayLength = event.params._ids.length;
  for (var i = 0; i < arrayLength; i++) {
    var cardId = event.params._ids[i];
    var amount = event.params._values[i];
    if(amount > BigInt.fromI32(0)) {
      var cardType = getCardTypeFromID(cardId);
      if (cardType != null) {
      
        if (event.params._operator == OPENSEA_V1) {
          log.info(
            "OPENSEA V1 BATCH - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
            [
              event.params._operator.toHexString(),
              event.params._from.toHexString(),
              event.params._to.toHexString(),
              event.transaction.hash.toHexString(),
              amount.toHexString(),
              cardId.toHexString(),
            ]
          );
        }

        // TRANSFER
        // GET USER SENDER, GET USER SENDER CARD Balance
        // GET USER RECEIVER and USER RECEIVER CARD Balance
        let user_sender = getOrCreateCardHolder(event.params._from);
        let user_sender_cardBalance = getOrCreateCardBalance(
          event.params._from,
          cardType,
          user_sender,
          event.block.number
        );

        // GET USER RECEIVER and USER RECEIVER CARD Balance
        let user_recevier = getOrCreateCardHolder(event.params._to);
        let user_recevier_cardBalance = getOrCreateCardBalance(
          event.params._to,
          cardType,
          user_recevier,
          event.block.number
        );

        // DECREASE SENDER BALANCE WRAPPED AND save
        user_sender_cardBalance.wrappedUnofficial = user_sender_cardBalance.wrappedUnofficial.minus(
          amount
        );
        user_sender_cardBalance.save();
        user_sender.save();

        // INCREASE RECEIVER BALANCE WRAPPED AND save
        user_recevier_cardBalance.wrappedUnofficial = user_recevier_cardBalance.wrappedUnofficial.plus(
          amount
        );
        user_recevier_cardBalance.save();
        user_recevier.save();
        clearEmptyCardBalance(user_sender_cardBalance);
        log.info(
          "ERC1155 UNOFFICAL BATCH TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
          [
            event.params._operator.toHexString(),
            event.params._from.toHexString(),
            event.params._to.toHexString(),
            event.transaction.hash.toHexString(),
            amount.toHexString(),
            cardId.toHexString(),
          ]
        );
      }
    }
  }
  }
  else {
    log.info(
      "ERC1155 UNOFFICAL BATCH SELF SEND - operator: {} from: {} to: {} txhash: {}",
      [
        event.params._operator.toHexString(),
        event.params._from.toHexString(),
        event.params._to.toHexString(),
        event.transaction.hash.toHexString()
      ]
    );
  }
}


