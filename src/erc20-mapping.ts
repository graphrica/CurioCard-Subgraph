import { Address, BigInt, log } from "@graphprotocol/graph-ts";
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
      let user_sender = getOrCreateCardHolder(event.params.from);
      let user_sender_cardBalance = getOrCreateCardBalance(event.params.from, event.address.toHex(), cardType, user_sender);

     
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.minus(event.params.value);
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.plus(event.params.value);
      user_sender_cardBalance.save();
      user_sender.holdings.push(user_sender_cardBalance.id)
      user_sender.save()
    }
    else if(event.address == event.params.from)
    {
      //ERC20 MINT 
      //CREATE A CARD BALANCE USER
      //CREATE A CARD BALANCE for CARDTYPE
      let user_recevier = getOrCreateCardHolder(event.params.to);
      let user_recevier_cardBalance = getOrCreateCardBalance(event.params.to, event.address.toHex(), cardType,user_recevier );

      

      user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(event.params.value);
      user_recevier_cardBalance.save()
      user_recevier.holdings.push(user_recevier_cardBalance.id)
      user_recevier.save();
    }
    else { 
      // TRANSFER

      // GET USER SENDER, GET USER SENDER CARD Balance
      let user_sender = getOrCreateCardHolder(event.params.from);
      let user_sender_cardBalance = getOrCreateCardBalance(event.params.from, event.address.toHex(), cardType,user_sender );
      
      
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params.to);
      let user_recevier_cardBalance = getOrCreateCardBalance(event.params.to, event.address.toHex(), cardType, user_recevier);
      
      // DECREASE SENDER BALANCE UNWRAPPED AND save
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.minus(event.params.value);
      user_sender_cardBalance.save()
      user_sender.holdings.push(user_sender_cardBalance.id)
      user_sender.save()
      // INCREASE RECEIVER BALANCE UNWRAPPED AND save
      user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(event.params.value);
      user_recevier_cardBalance.save();
      user_recevier.holdings.push(user_recevier_cardBalance.id)
      user_recevier.save()

    }



  } else { 
    log.warning("CARDTYPE DOES NOT EXIST", [])
  }
}


export function getOrCreateCardHolder(address: Address): CardHolder  {
  let user = CardHolder.load(address.toHex());
  if (user == null) {
    user = new CardHolder(address.toHex());
  }
  return user;
}

export function getOrCreateCardBalance(address: Address, contract: string, cardType: CardType, cardHolder : CardHolder): CardBalance  {
  let cardBalanceID = contract + '-' + address.toHex();
  let cardBalance = CardBalance.load(cardBalanceID);
  if (cardBalance == null) {
    cardBalance = new CardBalance(cardBalanceID);
    cardBalance.type = cardType.id;
    cardBalance.unwrappedBalance = BigInt.fromI32(0);
    cardBalance.wrappedBalance = BigInt.fromI32(0);
    cardBalance.user = cardHolder.id;
    cardBalance.save();
  }
  return cardBalance;
}

