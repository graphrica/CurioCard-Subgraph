import { WrapCall, UnwrapCall, WrapBatchCall, UnwrapBatchCall, TransferSingle, TransferBatch } from "../generated/ERC1155/ERC1155";
import { ADDRESS_ZERO, OPENSEA_V1 } from "./constants";
import { getCardTypeFromID, getOrCreateCardHolder, getOrCreateCardBalance, clearEmptyCardBalance, checkIfSentToSelf } from "./functions";
import { BigInt, log } from "@graphprotocol/graph-ts";


export function handleTransferSingle(event: TransferSingle): void {
    var cardType = getCardTypeFromID(event.params._id);
    if(!checkIfSentToSelf(event.params._to, event.params._from, event.params._operator) && event.params._value > BigInt.fromI32(0)) {
  
    if (cardType != null) {
      if (
        event.params._to == ADDRESS_ZERO
      ) {
        // UNWRAPPED
        let user = getOrCreateCardHolder(event.params._from);
        let userCardBalance = getOrCreateCardBalance(event.params._from, cardType, user, event.block.number);

        userCardBalance.wrappedOfficial =  userCardBalance.wrappedOfficial.minus(event.params._value);
        userCardBalance.unwrapped =  userCardBalance.unwrapped.plus(event.params._value);

        userCardBalance.save()


        log.info(
          "17b UNWRAP EVENT- operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
         // WRAP EVENT

         let user = getOrCreateCardHolder(event.params._to);
         let userCardBalance = getOrCreateCardBalance(event.params._to, cardType, user, event.block.number);

         userCardBalance.unwrapped =  userCardBalance.unwrapped.minus(event.params._value);
         userCardBalance.wrappedOfficial =  userCardBalance.wrappedOfficial.plus(event.params._value);
  
         userCardBalance.save();
        log.info(
          "17b WRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
          "17bWrapper TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
      "ERC1155 Offical SELF SEND - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
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
  
