import { WrapCall, UnwrapCall, WrapBatchCall, UnwrapBatchCall, TransferSingle, TransferBatch } from "../generated/ERC1155/ERC1155";
import { ERC1155_ADDRESS, ADDRESS_ZERO, OPENSEA_V1 } from "./constants";
import { getCardTypeFromID, getOrCreateCardHolder, getOrCreateCardBalance, clearEmptyCardBalance } from "./functions";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { CardType } from "../generated/schema";

export function handleOfficialWrap(call: WrapCall): void {
    var cardType = getCardTypeFromID(call.inputs._id, ERC1155_ADDRESS);
    if (cardType != null) {
        let user_recevier = getOrCreateCardHolder(call.from);
        let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier);
  
        user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.minus(call.inputs._quantity);
        user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(call.inputs._quantity);
        user_recevier_cardBalance.save();
        user_recevier.save()
        log.info(
            "OFFICAL WRAP HANDLER- txfrom: {}, from: {}, to: {}, inputTo: {}, value: {}, txHash: {}",
            [
              call.transaction.from.toHexString(),
              call.from.toHexString(),
              call.to.toHexString(),
              call.inputs._id.toHexString(),
              call.inputs._quantity.toHexString(),
              call.transaction.hash.toHexString(),
            ]
          );
       
    }

}
export function handleOfficialUnwrap(call: UnwrapCall): void {
    var cardType = getCardTypeFromID(call.inputs._id, ERC1155_ADDRESS);
    if (cardType != null) {
        let user_recevier = getOrCreateCardHolder(call.from);
        let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier);
  
        user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.minus(call.inputs._quantity);
        user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(call.inputs._quantity);
        user_recevier_cardBalance.save();
        user_recevier.save()
        log.info(
            "OFFICAL UNWRAP HANDLER- txfrom: {}, from: {}, to: {}, inputTo: {}, value: {}, txHash: {}",
            [
              call.transaction.from.toHexString(),
              call.from.toHexString(),
              call.to.toHexString(),
              call.inputs._id.toHexString(),
              call.inputs._quantity.toHexString(),
              call.transaction.hash.toHexString(),
            ]
          );
    }
}
export function handleOfficialWrapBatch(call: WrapBatchCall): void {
    var arrayLength = call.inputs._ids.length;
    for (var i = 0; i < arrayLength; i++) {
        var cardId = call.inputs._ids[i];
        var amount = call.inputs._quantities[i];

        var cardType = getCardTypeFromID(cardId, ERC1155_ADDRESS);
        if (cardType != null) {
            let user_recevier = getOrCreateCardHolder(call.from);
            let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier);
      
            user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.minus(amount);
            user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(amount);
            user_recevier_cardBalance.save();
            user_recevier.save()
            log.info(
                "OFFICAL WRAPBATCH HANDLER- txfrom: {}, from: {}, to: {}, inputTo: {}, value: {}, txHash: {}",
                [
                  call.transaction.from.toHexString(),
                  call.from.toHexString(),
                  call.to.toHexString(),
                  cardId.toHexString(),
                  amount.toHexString(),
                  call.transaction.hash.toHexString(),
                ]
              );
        }
    }
}
export function handleOfficialUnwrapBatch(call: UnwrapBatchCall): void {
    var arrayLength = call.inputs._ids.length;
    for (var i = 0; i < arrayLength; i++) {
        var cardId = call.inputs._ids[i];
        var amount = call.inputs._quantities[i];

        var cardType = getCardTypeFromID(cardId, ERC1155_ADDRESS);
        if (cardType != null) {
            let user_recevier = getOrCreateCardHolder(call.from);
            let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier);
      
            user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.minus(amount);
            user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(amount);
            user_recevier_cardBalance.save();
            user_recevier.save()
            log.info(
                "OFFICAL UNWRAPBATCH HANDLER- txfrom: {}, from: {}, to: {}, inputTo: {}, value: {}, txHash: {}",
                [
                  call.transaction.from.toHexString(),
                  call.from.toHexString(),
                  call.to.toHexString(),
                  cardId.toHexString(),
                  amount.toHexString(),
                  call.transaction.hash.toHexString(),
                ]
              );
        }
    }
}


export function handleTransferSingle(event: TransferSingle): void {
    var cardType = getCardTypeFromID(event.params._id, ERC1155_ADDRESS);
    if (cardType != null) {
      if (
        event.params._to == ADDRESS_ZERO
      ) {
        // UNWRAPPED
  
        // // GET USER SENDER, USER SENDER Balance
        // let user_sender = getOrCreateCardHolder(event.params._operator);
        // let user_sender_cardBalance = getOrCreateCardBalance(
        //   event.params._operator,
        //   cardType,
        //   user_sender
        // );
  
        
        // // DECREASE SENDER WRAPPED BALANCE
        // user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        //   event.params._value
        // );
        // // INCREASE SENDER UNWRAPPED BALANCE
        // user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.plus(
        //   event.params._value
        // );
        // user_sender_cardBalance.save();
        // user_sender.save();
   
        log.info(
          "ERC1155 UNWRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
          [
            event.params._operator.toHexString(),
            event.params._from.toHexString(),
            event.params._to.toHexString(),
            event.transaction.hash.toHexString(),
            event.params._value.toHexString(),
            event.params._id.toHexString(),
          ]
        );
        
      } else if (event.params._from == ADDRESS_ZERO) {
        // // WRAP EVENT
        // let user_recevier = getOrCreateCardHolder(event.params._to);
        // let user_recevier_cardBalance = getOrCreateCardBalance(event.params._to, cardType, user_recevier);
  
        // user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.minus(event.params._value);
        // user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(event.params._value);
        // user_recevier_cardBalance.save();
        // user_recevier.save()
       
  
        log.info(
          "WRAPPING & MINT OF ERC1155 OFFICIAL - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
      
        // TRANSFER
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
        //Check sender balance
        log.info(
          "ERC1155 TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
      
    } }
    else {
      throw "CardType does not exist";
    }
  }
  


export function handleTransferBatch(event: TransferBatch): void {
  var arrayLength = event.params._ids.length;
  for (var i = 0; i < arrayLength; i++) {
    var cardId = event.params._ids[i];
    var amount = event.params._values[i];

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
      log.info(
        "ERC1155 BATCH TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
