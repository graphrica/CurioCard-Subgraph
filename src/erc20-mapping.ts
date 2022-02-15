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
      let user_sender_cardBalance = getOrCreateCardBalance(event.params.from, event.address.toHex(), cardType);

      let user_sender = getOrCreateCardHolder(event.params.from, user_sender_cardBalance);
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.minus(event.params.value);
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.plus(event.params.value);
      user_sender_cardBalance.save();
    }
    else if(event.address == event.params.from)
    {
      //ERC20 MINT 
      //CREATE A CARD BALANCE USER
      //CREATE A CARD BALANCE for CARDTYPE
      let user_recevier_cardBalance = getOrCreateCardBalance(event.params.to, event.address.toHex(), cardType);

      let user_recevier = getOrCreateCardHolder(event.params.to, user_recevier_cardBalance);

      user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(event.params.value);
      user_recevier_cardBalance.save()
    }
    else { 
      // TRANSFER

      // GET USER SENDER, GET USER SENDER CARD Balance
      let user_sender_cardBalance = getOrCreateCardBalance(event.params.from, event.address.toHex(), cardType);
      let user_sender = getOrCreateCardHolder(event.params.from, user_sender_cardBalance);
      
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier_cardBalance = getOrCreateCardBalance(event.params.to, event.address.toHex(), cardType);
      let user_recevier = getOrCreateCardHolder(event.params.to, user_recevier_cardBalance);
      // DECREASE SENDER BALANCE UNWRAPPED AND save
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.minus(event.params.value);
      user_sender_cardBalance.save()
      // INCREASE RECEIVER BALANCE UNWRAPPED AND save
      user_recevier_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.plus(event.params.value);
      user_recevier_cardBalance.save();

    }



  } else { 
    log.warning("CARDTYPE DOES NOT EXIST", [])
  }
}


export function getOrCreateCardHolder(address: Address, user_recevier_cardBalance: CardBalance): CardHolder  {
  let user_recevier = CardHolder.load(address.toHex());
  if (user_recevier == null) {
    user_recevier = new CardHolder(address.toHex());
    user_recevier.holdings.push(user_recevier_cardBalance.id);
    user_recevier.save();
  }
  return user_recevier;
}

export function getOrCreateCardBalance(address: Address, contract: string, cardType: CardType): CardBalance  {
  let cardBalanceID = contract + address.toHex();
  let user_recevier_cardBalance = CardBalance.load(cardBalanceID);
  if (user_recevier_cardBalance == null) {
    user_recevier_cardBalance = new CardBalance(cardBalanceID);
    user_recevier_cardBalance.type = cardType.id;
    user_recevier_cardBalance.unwrappedBalance = BigInt.fromI32(0);
    user_recevier_cardBalance.wrappedBalance = BigInt.fromI32(0);
    user_recevier_cardBalance.save();
  }
  return user_recevier_cardBalance;
}

