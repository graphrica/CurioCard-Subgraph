import { WrapCall, UnwrapCall, WrapBatchCall, UnwrapBatchCall, TransferSingle, TransferBatch } from "../generated/ERC1155/ERC1155";
import { ADDRESS_ZERO, OPENSEA_V1 } from "./constants";
import { getCardTypeFromID, getOrCreateCardHolder, getOrCreateCardBalance, clearEmptyCardBalance, checkIfSentToSelf } from "./functions";
import { BigInt, log } from "@graphprotocol/graph-ts";

export function handleOfficialWrap(call: WrapCall): void {
    var cardType = getCardTypeFromID(call.inputs._id);
    if (cardType != null) {
        let user_recevier = getOrCreateCardHolder(call.from);
        let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier, call.block.number);
  
        user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.minus(call.inputs._quantity);
        user_recevier_cardBalance.wrappedOfficial = user_recevier_cardBalance.wrappedOfficial.plus(call.inputs._quantity);
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
    var cardType = getCardTypeFromID(call.inputs._id);
    if (cardType != null) {
        let user_recevier = getOrCreateCardHolder(call.from);
        let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier, call.block.number);
  
        user_recevier_cardBalance.wrappedOfficial = user_recevier_cardBalance.wrappedOfficial.minus(call.inputs._quantity);
        user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.plus(call.inputs._quantity);
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

        var cardType = getCardTypeFromID(cardId);
        if (cardType != null) {
            let user_recevier = getOrCreateCardHolder(call.from);
            let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier, call.block.number);
      
            user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.minus(amount);
            user_recevier_cardBalance.wrappedOfficial = user_recevier_cardBalance.wrappedOfficial.plus(amount);
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

        var cardType = getCardTypeFromID(cardId);
        if (cardType != null) {
            let user_recevier = getOrCreateCardHolder(call.from);
            let user_recevier_cardBalance = getOrCreateCardBalance(call.from, cardType, user_recevier, call.block.number);
      
            user_recevier_cardBalance.wrappedOfficial = user_recevier_cardBalance.wrappedOfficial.minus(amount);
            user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.plus(amount);
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
    var cardType = getCardTypeFromID(event.params._id);
    if(!checkIfSentToSelf(event.params._to, event.params._from, event.params._operator) && event.params._value > BigInt.fromI32(0)) {
  
    if (cardType != null) {
      if (
        event.params._to == ADDRESS_ZERO
      ) {
        // UNWRAPPED
        log.info(
          "ERC1155 UNWRAP EVENT (IGNORED)- operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
  
        log.info(
          "WRAPPING & MINT OF ERC1155 OFFICIAL (IGNORED) - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
        user_sender_cardBalance.wrappedOfficial = user_sender_cardBalance.wrappedOfficial.minus(
          event.params._value
        );
        user_sender_cardBalance.save();
        user_sender.save();
        // INCREASE RECEIVER BALANCE WRAPPED AND save
        user_recevier_cardBalance.wrappedOfficial = user_recevier_cardBalance.wrappedOfficial.plus(
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

      clearEmptyCardBalance(user_sender_cardBalance);
      
    } }
    else {
      throw "CardType does not exist";
    }
  }   else{
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
  


export function handleTransferBatch(event: TransferBatch): void {
  if (!checkIfSentToSelf(event.params._to, event.params._from, event.params._operator)) {
  var arrayLength = event.params._ids.length;
  for (var i = 0; i < arrayLength; i++) {
    var cardId = event.params._ids[i];
    var amount = event.params._values[i];
    if(amount > BigInt.fromI32(0)) {
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

    var cardType = getCardTypeFromID(cardId);
    if (cardType != null) {
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
      user_sender_cardBalance.wrappedOfficial = user_sender_cardBalance.wrappedOfficial.minus(
        amount
      );
      user_sender_cardBalance.save();
      user_sender.save();

      // INCREASE RECEIVER BALANCE WRAPPED AND save
      user_recevier_cardBalance.wrappedOfficial = user_recevier_cardBalance.wrappedOfficial.plus(
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
} else
{
  log.info(
    "ERC1155 BATCH SELF SEND - operator: {} from: {} to: {} txhash: {}",
    [
      event.params._operator.toHexString(),
      event.params._from.toHexString(),
      event.params._to.toHexString(),
      event.transaction.hash.toHexString()
    ]
  );
}
}
