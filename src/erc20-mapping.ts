import { log } from "@graphprotocol/graph-ts";
import { Transfer, TransferCall } from "../generated/templates/ERC20/ERC20";
import { CardType } from "../generated/schema";
import { clearEmptyCardBalance, getOrCreateCardBalance, getOrCreateCardHolder } from "./functions";
import { CREATOR_ADDRESS, ERC1155_ADDRESS, ERC1155Unofficial_ADDRESS, ADDRESS_ZERO } from "./constants";

export function handleTransfer(event: Transfer): void {
  var cardType = CardType.load(event.address.toHex())
  if (cardType != null) {
    
    if(event.params.from == CREATOR_ADDRESS) {
       //ERC20 MINT
       let user_recevier = getOrCreateCardHolder(event.params.to);
       let user_recevier_cardBalance = getOrCreateCardBalance(event.params.to, cardType, user_recevier);
 
       user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(event.params.value);
       user_recevier_cardBalance.save()
       user_recevier.save();
       log.info("ERC20 MINT - event.address: {} from: {} to: {} txhash: {}", [ event.address.toHexString() ,event.params.from.toHexString(), event.params.to.toHexString(),event.transaction.hash.toHexString()])
    }
    else if(event.params.to == ERC1155_ADDRESS || event.params.to == ERC1155Unofficial_ADDRESS) {
      //WRAP OF ERC20 and MINT of ERC1155
      let user_recevier = getOrCreateCardHolder(event.params.to);
      let user_recevier_cardBalance = getOrCreateCardBalance(event.params.to, cardType, user_recevier);

     
      user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.minus(event.params.value);
      user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(event.params.value);
      user_recevier_cardBalance.save();
      user_recevier.save()
      log.info("ERC20 WRAPPING & MINT OF ERC1155 - event.address: {} from: {} to: {} txhash: {}", [ event.address.toHexString() ,event.params.from.toHexString(), event.params.to.toHexString(),event.transaction.hash.toHexString()])
    }
    else if(event.address == event.params.from)
    {
      //ERC20 MINT 
      //CREATE A CARD BALANCE USER
      //CREATE A CARD BALANCE for CARDTYPE
 
      log.info("ERC20 MINT & SEND - event.address: {} from: {} to: {} txhash: {}", [ event.address.toHexString() ,event.params.from.toHexString(), event.params.to.toHexString(),event.transaction.hash.toHexString()])
    }
    else { 
      // TRANSFER

      // GET USER SENDER, GET USER SENDER CARD Balance
      let user_sender = getOrCreateCardHolder(event.params.from);
      let user_sender_cardBalance = getOrCreateCardBalance(event.params.from, cardType,user_sender );
      
      
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params.to);
      let user_recevier_cardBalance = getOrCreateCardBalance(event.params.to, cardType,user_recevier);
      
      // DECREASE SENDER BALANCE UNWRAPPED AND save
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.minus(event.params.value);
      user_sender_cardBalance.save()
      
      user_sender.save()
      // INCREASE RECEIVER BALANCE UNWRAPPED AND save
      user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(event.params.value);
      user_recevier_cardBalance.save();
      user_recevier.save()
      clearEmptyCardBalance(user_sender_cardBalance);
      log.info("ERC20 TRANSFER - event.address: {} from: {} to: {} txhash: {}", [ event.address.toHexString() ,event.params.from.toHexString(), event.params.to.toHexString(),event.transaction.hash.toHexString()])
    }



  } else { 
    log.warning("CARDTYPE DOES NOT EXIST", [])
  }
}
export function handleDirectTransfer(call: TransferCall): void {
  log.info("START DIRECT TRANSFER - txfrom: {}, from: {}, to: {}, inputTo: {}", [call.transaction.from.toHexString(), call.from.toHexString(),call.to.toHexString(),call.inputs._to.toHexString()])
  if (call.from == ERC1155_ADDRESS ||  call.transaction.from == ERC1155_ADDRESS){
    log.info("IGNORE OFFICIAL UNWRAP - txfrom: {}, from: {}, to: {}", [call.transaction.from.toHexString(), call.from.toHexString(), call.to.toHexString()])
  }
  else if (call.from == ERC1155Unofficial_ADDRESS || call.transaction.from == ERC1155Unofficial_ADDRESS){
    log.info("IGNORE UNOFFICIAL UNWRAP - txfrom: {}, from: {}, to: {}", [call.transaction.from.toHexString(), call.from.toHexString(), call.to.toHexString()])
  }
  else if(call.inputs._to == ADDRESS_ZERO) {
    log.info("IGNORE MINT - txfrom: {}, from: {}, to: {}", [call.transaction.from.toHexString(), call.from.toHexString(), call.to.toHexString()])
  }
  else {
    var cardType = CardType.load(call.to.toHex())
    if(cardType != null) {
      let user_sender = getOrCreateCardHolder(call.from);
      let user_sender_cardBalance = getOrCreateCardBalance(call.from, cardType,user_sender );
      
      
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(call.inputs._to);
      let user_recevier_cardBalance = getOrCreateCardBalance(call.inputs._to, cardType,user_recevier);
      
      // DECREASE SENDER BALANCE UNWRAPPED AND save
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.minus(call.inputs._value);
      user_sender_cardBalance.save()
      
      user_sender.save()
      // INCREASE RECEIVER BALANCE UNWRAPPED AND save
      user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(call.inputs._value);
      user_recevier_cardBalance.save();
      user_recevier.save()
      clearEmptyCardBalance(user_sender_cardBalance);
      log.info("TRANSFER-DIRECT- txfrom: {}, from: {}, to: {}, inputTo: {}, value: {}, txHash: {}", [call.transaction.from.toHexString(), call.from.toHexString(),call.to.toHexString(),call.inputs._to.toHexString(),call.inputs._value.toHexString(), call.transaction.hash.toHexString()])
    }
    else{
      log.warning("CARD NOT FOUND - address: {}, tx: {}", [call.to.toHex(), call.transaction.hash.toString()])
    }
  }
}


