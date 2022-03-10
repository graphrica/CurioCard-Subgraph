import { WrapCall, UnwrapCall } from "../generated/ERC1155Unofficial/ERC1155Unofficial";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { ERC1155_ADDRESS, ADDRESS_ZERO, OPENSEA_V1 } from "./constants";
import { getCardTypeFromID, getOrCreateCardHolder, getOrCreateCardBalance, clearEmptyCardBalance } from "./functions";
import {
    TransferSingle
  } from "../generated/ERC1155Unofficial/ERC1155Unofficial";

export function handleUnofficialWrap(call: WrapCall): void {
    var cardType = getCardTypeFromID(call.inputs.id, ERC1155_ADDRESS);
    if (cardType != null) {
        let user_recevier = getOrCreateCardHolder(call.from);
        let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier);
  
        user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.minus(call.inputs.amount);
        user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(call.inputs.amount);
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
    var cardType = getCardTypeFromID(call.inputs.id, ERC1155_ADDRESS);
    if (cardType != null) {
        let user_recevier = getOrCreateCardHolder(call.from);
        let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier);
  
        user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.minus(call.inputs.amount);
        user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(call.inputs.amount);
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
    if (event.params._id == BigInt.fromI32(171)) {
      log.info(
        "MISPRINT TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
      var cardType = getCardTypeFromID(event.params._id, ERC1155_ADDRESS);
      if (cardType != null) {
        if (event.params._operator == ADDRESS_ZERO) {
          // UNWRAPPED
  
          // // GET USER SENDER, USER SENDER Balance
        //   let user_sender = getOrCreateCardHolder(event.params._to);
        //   let user_sender_cardBalance = getOrCreateCardBalance(
        //     event.params._to,
        //     cardType,
        //     user_sender
        //   );
          
   
        //   // DECREASE SENDER WRAPPED BALANCE
        //   user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        //     event.params._value
        //   );
        //   // INCREASE SENDER UNWRAPPED BALANCE
        //   user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.plus(
        //     event.params._value
        //   );
        //   user_sender_cardBalance.save();
        //   user_sender.save();
          log.info(
            "ERC1155 UNOFFICAL UNWRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
          // GET USER SENDER, USER SENDER Balance
          // let user_sender = getOrCreateCardHolder(event.params._to);
          // let user_sender_cardBalance = getOrCreateCardBalance(
          //   event.params._to,
          //   cardType,
          //   user_sender
          // );
  
          
          // user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.minus(
          //   event.params._value
          // );
     
          // user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.plus(
          //   event.params._value
          // );
          // user_sender_cardBalance.save();
          // user_sender.save();
  
          log.info(
            "SHOULDNT HAPPEN - WRAPPING & MINT OF ERC1155 UNOFFICIAL- operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
            user_sender
          );
          if(user_sender_cardBalance.wrappedBalance.minus(
            event.params._value
          ) >= BigInt.fromI32(0)){
  
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
        }
        clearEmptyCardBalance(user_sender_cardBalance);
      }}
    }
    
  }
  