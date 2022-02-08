import { BigInt, log } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/templates/ERC20/ERC20";
import { CardBalance, CardHolder, CardType } from "../generated/schema";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const OPERATOR_ADDRESS = "0x37aab22019448859fc255e6e353a1baf2c05e6bb";

export function handleTransfer(event: Transfer): void {
  if (event.params.from.toHex() == ADDRESS_ZERO) {
  } else {
    let cardType = CardType.load(event.address.toHex());
    if (cardType == null) {
      log.warning("CARD DOES NOT EXIST", [event.address.toHex()]);
    }
    // MINT
    if (event.params.to.toHex() == ADDRESS_ZERO) {
    } else {
      /*
       *  Increment balance of recipient
       */ 

      // try to load recipient CardBalance. if null, create a new recipient
      let cardType = CardType.load(event.address.toHex())
      let newBalanceId_recipient =
        event.params.to.toHex() + "-" + event.address.toString();
      let newBalance_recipient = CardBalance.load(newBalanceId_recipient);
      if (newBalance_recipient == null) {
        newBalance_recipient = new CardBalance(newBalanceId_recipient);
        newBalance_recipient.type = cardType.id;
        newBalance_recipient.balance = event.params.value;
        newBalance_recipient.save();
      } else {
        newBalance_recipient.balance = newBalance_recipient.balance.plus(event.params.value);
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
        if (entry.balance != BigInt.fromI32(0)) {
          uniqueCards++;
        }
      }

      cardHolder_recipient.uniqueCards = uniqueCards;
      cardHolder_recipient.save();

      /*
       *  Decrement balance of sender
       */

      let unwrap = false; // special handling for unwrap
      if (
        event.params.from.toHex() ==
        event.address.toHex()
      ) {
        unwrap = true;
      }

      // load CardBalance
      let newBalanceId_sender: String;
      if (unwrap) {
        // use operator
        // newBalanceId_sender =
        //   event.params.operator.toHex() + "-" + event.params._id.toString();
        newBalanceId_sender =
        OPERATOR_ADDRESS + "-" + event.address.toHex();
      } else {
        newBalanceId_sender =
          event.params.from.toHex() + "-" + event.address.toHex();
      }
      let newBalance_sender = CardBalance.load(newBalanceId_sender.toString());
      if (newBalance_sender == null) {
        throw "should never happen";
      } else {
        newBalance_sender.balance = newBalance_sender.balance.minus(event.params.value);
        newBalance_recipient.type = cardType.id;
        newBalance_sender.save();
      }

      // load sender CardHolder
      let cardHolder_sender: CardHolder | null;
      if (unwrap) {
        // use operator
        cardHolder_sender = CardHolder.load(OPERATOR_ADDRESS);
      } else {
        cardHolder_sender = CardHolder.load(event.params.from.toHex());
      }
      if (cardHolder_sender == null) {
        throw "should never happen";
      } else {
        // if balance not in cardHolder_sender, add it
        if (cardHolder_sender.holdings.indexOf(newBalance_sender.id) == -1) {
          let newHoldings = cardHolder_sender.holdings;
          newHoldings.push(newBalance_sender.id);
          cardHolder_sender.holdings = newHoldings;
        }
      }

      // calculate unique cards held
      uniqueCards = 0;
      for (let i = 0; i < cardHolder_sender.holdings.length; i++) {
        // load holdings; determine if balance is > 0
        let holdings = cardHolder_sender.holdings;
        let entry = CardBalance.load(holdings[i]);
        if (entry.balance != BigInt.fromI32(0)) {
          uniqueCards++;
        }
      }

      cardHolder_sender.uniqueCards = uniqueCards;
      cardHolder_sender.save();
    }
  }
}
