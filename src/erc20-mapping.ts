import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/templates/ERC20/ERC20";
import { CardBalance, CardHolder, CardType } from "../generated/schema";

export const ADDRESS_ZERO = Address.fromString("0x0000000000000000000000000000000000000000");
export const CREATOR_ADDRESS = Address.fromString("0x3cc44273a97e8fbfbcbd3d60200cc9fd33d84d66");
export const ERC1155_ADDRESS = Address.fromString("0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313");

export function handleTransfer(event: Transfer): void {
  var cardType = CardType.load(event.address.toHex())
  if (cardType != null) {
    
    if(event.params.from == CREATOR_ADDRESS) {
       //ERC20 MINT
       let user_recevier = getOrCreateCardHolder(event.params.to);
       let user_recevier_cardBalance = getOrCreateCardBalance(event.params.to, event.address.toHexString(), cardType,user_recevier);
 
       user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(event.params.value);
       user_recevier_cardBalance.save()
       user_recevier.save();
       log.info("ERC20 MINT - event.address: {} from: {} to: {} txhash: {}", [ event.address.toHexString() ,event.params.from.toHexString(), event.params.to.toHexString(),event.transaction.hash.toHexString()])
    }
    else if(event.params.to == ERC1155_ADDRESS) {
      //WRAP OF ERC20 and MINT of ERC1155
      // DECREASE THE UNWRAPPED AND INCREASE WRAPPED BALANCE of USER
      let user_sender = getOrCreateCardHolder(event.params.from);
      let user_sender_cardBalance = getOrCreateCardBalance(event.params.from, event.address.toHexString(), cardType, user_sender);

     
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.minus(event.params.value);
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.plus(event.params.value);
      user_sender_cardBalance.save();
      user_sender.save()
      log.info("WRAPPING & MINT OF ERC1155 - event.address: {} from: {} to: {} txhash: {}", [ event.address.toHexString() ,event.params.from.toHexString(), event.params.to.toHexString(),event.transaction.hash.toHexString()])
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
      let user_sender_cardBalance = getOrCreateCardBalance(event.params.from, event.address.toHexString(), cardType,user_sender );
      
      
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params.to);
      let user_recevier_cardBalance = getOrCreateCardBalance(event.params.to, event.address.toHexString(), cardType,user_recevier);
      
      // DECREASE SENDER BALANCE UNWRAPPED AND save
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.minus(event.params.value);
      user_sender_cardBalance.save()
      
      user_sender.save()
      // INCREASE RECEIVER BALANCE UNWRAPPED AND save
      user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(event.params.value);
      user_recevier_cardBalance.save();
      user_recevier.save()
      log.info("ERC20 TRANSFER - event.address: {} from: {} to: {} txhash: {}", [ event.address.toHexString() ,event.params.from.toHexString(), event.params.to.toHexString(),event.transaction.hash.toHexString()])
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
  let cardBalanceID = contract + '-' + address.toHexString();
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

