import { BigInt, log } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/templates/ERC20/ERC20";
import { CardBalance, CardHolder, CardType } from "../generated/schema";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const ERC1155_ADDRESS = "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313";

export function handleTransfer(event: Transfer): void {
  // IF SENT TO ERC1155 ADDRESS  -  WRAPPING

  if (event.params.to.toHex() == ERC1155_ADDRESS) {
    log.info("WRAPPING EVENT", []);
    let cardType = CardType.load(event.address.toHex());
      if (cardType == null) {
        log.warning("CARD DOES NOT EXIST", [event.address.toHex()]);

        cardType = new CardType(event.address.toHex());
        cardType.version = "ERC20";
        cardType.wrapped = BigInt.fromI32(0);
        cardType.unwrapped = cardType.unwrapped.minus(event.params.value);
        cardType.save();
      }
      else {
        cardType.wrapped = cardType.wrapped.plus(event.params.value);
        cardType.save();
      }
     
     
  }

  // IF SENT FROM ERC1155 ADDRESS - UNWRAPPING

  if (event.params.from.toHex() == ADDRESS_ZERO) {
    //MINT
    log.info("MINT EVENT", []);
  } else {
    if (event.params.to.toHex() == ADDRESS_ZERO) {
      //BURN
      log.info("BURN EVENT", []);
    } else {
      /*
       *  Increment balance of recipient
       */ log.info("TRANSFER EVENT", []);
      // try to load recipient CardBalance. if null, create a new recipient
      let cardType = CardType.load(event.address.toHex());
      if (cardType == null) {
        log.warning("CARD DOES NOT EXIST", [event.address.toHex()]);

        cardType = new CardType(event.address.toHex());
        cardType.version = "ERC20";
        cardType.save();
      }
      let newBalanceId_recipient =
        event.params.to.toHex() + "-" + event.address.toString();
      let newBalance_recipient = CardBalance.load(newBalanceId_recipient);
      if (newBalance_recipient == null) {
        newBalance_recipient = new CardBalance(newBalanceId_recipient);
        newBalance_recipient.type = cardType.id;
        newBalance_recipient.balance = event.params.value;
        newBalance_recipient.save();
      } else {
        newBalance_recipient.balance = newBalance_recipient.balance.plus(
          event.params.value
        );
        newBalance_recipient.type = cardType.id;
        newBalance_recipient.save();
      }

      // try to load recipient CardHolder. if null, create a new recipient
      let cardHolder_recipient = CardHolder.load(event.params.to.toHex());
      if (cardHolder_recipient == null) {
        cardHolder_recipient = new CardHolder(event.params.to.toHex());
        cardHolder_recipient.holdings = [newBalance_recipient.id];
      } else {
        // if balance not in cardHolder_recipient, add it
        if (
          cardHolder_recipient.holdings.indexOf(newBalance_recipient.id) == -1
        ) {
          let newHoldings = cardHolder_recipient.holdings;
          newHoldings.push(newBalance_recipient.id);
          cardHolder_recipient.holdings = newHoldings;
        }
      }

      // calculate unique cards held
      let uniqueCards = 0;
      for (let i = 0; i < cardHolder_recipient.holdings.length; i++) {
        // load holdings; determine if balance is > 0
        let holdings = cardHolder_recipient.holdings;
        let entry = CardBalance.load(holdings[i]);
        if (entry != null) {
          if (entry.balance != BigInt.fromI32(0)) {
            uniqueCards++;
          }
        }
      }

      cardHolder_recipient.uniqueCards = uniqueCards;
      cardHolder_recipient.save();

      /*
       *  Decrement balance of sender
       */

      let unwrap = false; // special handling for unwrap
      if (event.params.from.toHex() == ERC1155_ADDRESS) {
        unwrap = true;
      }

      // load CardBalance
      let newBalanceId_sender: String;
      if (unwrap) {
       
        newBalanceId_sender = ERC1155_ADDRESS + "-" + event.address.toString();
      } else {
        
        newBalanceId_sender =
          event.params.from.toHex() + "-" + event.address.toHex();
      }
      let newBalance_sender = CardBalance.load(newBalanceId_sender.toString());
      if (newBalance_sender == null) {
        log.warning("SHOULD NOT HAPPEN", [])
      } else {
        newBalance_sender.balance = newBalance_sender.balance.minus(
          event.params.value
        );
        newBalance_recipient.type = cardType.id;
        newBalance_sender.save();
       
        
          }

      // load sender CardHolder
      let cardHolder_sender: CardHolder | null;
      if (unwrap) {
        // use operator
        cardHolder_sender = CardHolder.load(ERC1155_ADDRESS);
      } else {
        cardHolder_sender = CardHolder.load(event.params.from.toHex());
      }
      if (cardHolder_sender == null) {
        log.warning("SHOULD NOT HAPPEN", [])
      } else {
        // if balance not in cardHolder_sender, add it
        if(newBalance_sender != null){
            if (cardHolder_sender.holdings.indexOf(newBalance_sender.id) == -1) {
                let newHoldings = cardHolder_sender.holdings;
                newHoldings.push(newBalance_sender.id);
                cardHolder_sender.holdings = newHoldings;
              }
        }
      }
      if(cardHolder_sender != null){
        uniqueCards = 0;
        for (let i = 0; i < cardHolder_sender.holdings.length; i++) {
          // load holdings; determine if balance is > 0
          let holdings = cardHolder_sender.holdings;
          let entry = CardBalance.load(holdings[i]);
          if (entry != null) {
            if (entry.balance != BigInt.fromI32(0)) {
              uniqueCards++;
            }
          }
        }
  
        cardHolder_sender.uniqueCards = uniqueCards;
        cardHolder_sender.save();
      }
      // calculate unique cards held
     
    }
  }
}
