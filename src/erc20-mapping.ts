import { BigInt, log } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/templates/ERC20/ERC20";
import { CardBalance, CardHolder, CardType } from "../generated/schema";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const ERC1155_ADDRESS = "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313";

export function handleTransfer(event: Transfer): void {
  var cardType = CardType.load(event.address.toHex())
  if (cardType != null) {
    
    if(event.params.from.toHex() == ADDRESS_ZERO) {
       //ERC20 MINT
       //IGNORE THIS EVENT
    }
    else if(event.params.to.toHex() == ERC1155_ADDRESS) {
      //WRAP OF ERC20 and MINT of ERC1155
      // DECREASE THE UNWRAPPED AND INCREASE WRAPPED BALANCE of USER
    }
    else if(event.address == event.params.from)
    {
      //ERC20 MINT 
      //CREATE A CARD BALANCE USER
      //CREATE A CARD BALANCE for CARDTYPE
      let cardBalanceID = event.address.toString() + event.params.to;
      let user_recevier_cardBalance = CardBalance.load(cardBalanceID)
      if(user_recevier_cardBalance == null) {
        user_recevier_cardBalance = new CardBalance(cardBalanceID);
        user_recevier_cardBalance.type = cardType.id;
        user_recevier_cardBalance.unwrappedBalance = event.params.value;
        user_recevier_cardBalance.wrappedBalance = BigInt.fromI32(0);
        user_recevier_cardBalance.save()
      }

      let user_recevier = CardHolder.load(event.params.to.toHex())
      if( user_recevier == null){
        user_recevier = new CardHolder(event.params.to.toHex());
        user_recevier.holdings.push(user_recevier_cardBalance.id)
        user_recevier.save();
      }
    }
    else { 
      // TRANSFER

      // GET USER SENDER, GET USER SENDER CARD Balance
      // GET USER RECEIVER and USER RECEIVER CARD Balance

      // DECREASE SENDER BALANCE UNWRAPPED AND save 
      // INCREASE RECEIVER BALANCE UNWRAPPED AND save

    }



  } else { 
    log.warning("CARDTYPE DOES NOT EXIST", [])
  }
}


