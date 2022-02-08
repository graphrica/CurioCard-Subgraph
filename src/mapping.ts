import { BigInt } from "@graphprotocol/graph-ts"
import {
  CreateCardCall,
} from "../generated/CardFactory/CardFactory"
import { CardBalance, CardHolder, CardType } from "../generated/schema"
import {
  TransferSingle,
  TransferBatch,
  CreateCall
} from "../generated/ERC1155/ERC1155"
import { ERC20 } from '../generated/templates'
export function handleCreateCard(call: CreateCardCall): void {  
  let cardType = new CardType(call.outputs.value0.toHex())


  cardType.supply = call.inputs._initialAmount;
  cardType.address = call.outputs.value0;
  cardType.symbol = call.inputs._symbol;
  cardType.description = call.inputs._desc;
  cardType.name = call.inputs._name;
  cardType.ipfsHash = call.inputs._ipfshash;
  cardType.version = "ERC20";
  cardType.wrapped = BigInt.fromI32(0);
  cardType.unwrapped = call.inputs._initialAmount;
  cardType.save();

  ERC20.create(call.outputs.value0)
}
export function handleCreateCardERC1155(call: CreateCall): void {  
  let cardType = new CardType(call.inputs._id.toHex())




  cardType.address = call.inputs._contract;
  cardType.ipfsHash = call.inputs.memory_uri;
  cardType.version = "ERC1155";
  cardType.wrapped = BigInt.fromI32(0);
  cardType.unwrapped = BigInt.fromI32(0);
  cardType.save();
}
// ERC1155 Events

export function handleTransferSingle(event: TransferSingle): void {
  /*
   *  Increment balance of recipient
   */
  let cardType = CardType.load(event.params._id.toHex());

  if(cardType == null){
    let cardType = new CardType(event.params._id.toHex())




  // cardType.address = call.inputs._contract;
  // cardType.ipfsHash = call.inputs.memory_uri;
  cardType.version = "ERC1155";
  cardType.wrapped = BigInt.fromI32(0);
  cardType.unwrapped = BigInt.fromI32(0);
  cardType.save();
  }
  // try to load recipient CardBalance. if null, create a new recipient
  if (cardType != null && event.params._to.toHex() != "0x0000000000000000000000000000000000000000"
     && event.params._from.toHex() != "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313") {
    let newBalanceId_recipient = event.params._to.toHex() + "-" + event.params._id.toString();
    let newBalance_recipient = CardBalance.load(newBalanceId_recipient);
    if (newBalance_recipient == null) {
      newBalance_recipient = new CardBalance(newBalanceId_recipient);
      newBalance_recipient.type = cardType.id;
      newBalance_recipient.balance = event.params._value;
      newBalance_recipient.save();
    } else {
      newBalance_recipient.balance = newBalance_recipient.balance.plus(event.params._value);
      newBalance_recipient.save();
    }

    // try to load recipient CardHolder. if null, create a new recipient
    let cardHolder_recipient = CardHolder.load(event.params._to.toHex())
    if (cardHolder_recipient == null) {
      cardHolder_recipient = new CardHolder(event.params._to.toHex());
      cardHolder_recipient.holdings = [newBalance_recipient.id];
    } else {
      // if balance not in cardHolder_recipient, add it
      if (cardHolder_recipient.holdings.indexOf(newBalance_recipient.id) == -1) {
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
      if(entry != null) {
        if (entry.balance != BigInt.fromI32(0)) {
          uniqueCards++;
        }
      }
  
    }

    cardHolder_recipient.uniqueCards = uniqueCards;
    cardHolder_recipient.save();
  }

  /*
   *  Decrement balance of sender
   */
  if (event.params._from.toHex() != "0x0000000000000000000000000000000000000000") {

    let unwrap = false; // special handling for unwrap
    if (event.params._from.toHex() == "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313") {
      unwrap = true;
    }

    // load CardBalance
    let newBalanceId_sender: String;
    if (unwrap) { // use operator
      
      newBalanceId_sender = event.params._operator.toHex() + "-" + event.params._id.toString();
      if(cardType != null) {
        cardType.wrapped = cardType.wrapped.minus(event.params._value);
        cardType.unwrapped = cardType.unwrapped.plus(event.params._value)
        cardType.save();
      }
    } else {
      newBalanceId_sender = event.params._from.toHex() + "-" + event.params._id.toString();
      if(cardType != null) {
        cardType.wrapped = cardType.wrapped.plus(event.params._value);
        cardType.unwrapped = cardType.unwrapped.minus(event.params._value)
        cardType.save();
      }
    }
    let newBalance_sender = CardBalance.load(newBalanceId_sender.toString());
    if (newBalance_sender == null) {
      throw "should never happen"
    } else {
      newBalance_sender.balance = newBalance_sender.balance.minus(event.params._value);
      newBalance_sender.save();
    }

    // load sender CardHolder
    let cardHolder_sender: CardHolder | null
    if (unwrap) { // use operator
      cardHolder_sender = CardHolder.load(event.params._operator.toHex())
    } else {
      cardHolder_sender = CardHolder.load(event.params._from.toHex())
    }
    if (cardHolder_sender == null) {
      throw "should never happen"
    } else {
      // if balance not in cardHolder_sender, add it
      if (cardHolder_sender.holdings.indexOf(newBalance_sender.id) == -1) {
        let newHoldings = cardHolder_sender.holdings;
        newHoldings.push(newBalance_sender.id);
        cardHolder_sender.holdings = newHoldings;
      }
    }

    // calculate unique cards held
    let uniqueCards = 0;
    for (let i = 0; i < cardHolder_sender.holdings.length; i++) {
      // load holdings; determine if balance is > 0
      let holdings = cardHolder_sender.holdings;
      let entry = CardBalance.load(holdings[i]);
          
      if(entry != null) {
        if (entry.balance != BigInt.fromI32(0)) {
          uniqueCards++;
        }
      }    
 
    }

    cardHolder_sender.uniqueCards = uniqueCards;
    cardHolder_sender.save();
  }

}

export function handleTransferBatch(event: TransferBatch): void {
  /*
   *  Increment balance of recipient
   */

  if (event.params._to.toHex() != "0x0000000000000000000000000000000000000000"
     && event.params._from.toHex() != "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313") {
    // try to load CardBalances. if null, create new recipients
    let newBalanceList: Array<string> = [];
    for (let i = 0; i < event.params._ids.length; i++) {
      let cardType = CardType.load((event.params._ids as Array<BigInt>)[i].toString())
      if(cardType != null) {
        let newBalanceId_recipient = event.params._to.toHex() + "-" + (event.params._ids as Array<BigInt>)[i].toString();
        let newBalance_recipient = CardBalance.load(newBalanceId_recipient);
        if (newBalance_recipient == null) {
          newBalance_recipient = new CardBalance(newBalanceId_recipient);
          newBalance_recipient.type = cardType.id;
          newBalance_recipient.balance = (event.params._values as Array<BigInt>)[i];
          newBalance_recipient.save();
        } else {
          newBalance_recipient.balance =  newBalance_recipient.balance.plus((event.params._values as Array<BigInt>)[i]);
          newBalance_recipient.save();
        }
        newBalanceList.push(newBalance_recipient.id);
      }

    }

    // try to load recipient CardHolder. if null, create a new recipient
    let cardHolder_recipient = CardHolder.load(event.params._to.toHex())
    if (cardHolder_recipient == null) {
      cardHolder_recipient = new CardHolder(event.params._to.toHex());
      
      cardHolder_recipient.holdings = newBalanceList;
    } else {
      // if balance not in cardHolder_recipient, add it
      for (let i = 0; i < event.params._ids.length; i++) {
        if (cardHolder_recipient.holdings.indexOf(newBalanceList[i].toString()) == -1) {
          let newHoldings = cardHolder_recipient.holdings;
          newHoldings.push(newBalanceList[i].toString());
          cardHolder_recipient.holdings = newHoldings;
        }
      }
    }

    // calculate unique cards held
    let uniqueCards = 0;
    for (let i = 0; i < cardHolder_recipient.holdings.length; i++) {
      // load holdings; determine if balance is > 0
      let holdings = cardHolder_recipient.holdings;
      let entry = CardBalance.load(holdings[i]);
      if(entry != null) {
        if (entry.balance != BigInt.fromI32(0)) {
          uniqueCards++;
        }
      }

 
    }

    cardHolder_recipient.uniqueCards = uniqueCards;
    cardHolder_recipient.save();
  }

  /*
   *  Decrement balance of sender
   */

  if (event.params._from.toHex() != "0x0000000000000000000000000000000000000000"
     && event.params._from.toHex() != "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313") {
    // load CardBalances
    let newBalanceList: Array<String> = [];
    for (let i = 0; i < event.params._ids.length; i++) {
      let newBalanceId_sender = event.params._from.toHex() + "-" + (event.params._ids as Array<BigInt>)[i].toString();
      let newBalance_sender = CardBalance.load(newBalanceId_sender);
      if (newBalance_sender == null) {
        throw "should never happen"
      } else {
        newBalance_sender.balance = newBalance_sender.balance.minus((event.params._values as Array<BigInt>)[i]);
        newBalance_sender.save();
      }
      newBalanceList.push(newBalance_sender.id);
    }

    // load sender CardHolder
    let cardHolder_sender = CardHolder.load(event.params._from.toHex())
    if (cardHolder_sender == null) {
      throw "should never happen"
    } else {
      // if balance not in cardHolder_sender, add it
      for (let i = 0; i < event.params._ids.length; i++) {
        if (cardHolder_sender.holdings.indexOf(newBalanceList[i].toString()) == -1) {
          let newHoldings = cardHolder_sender.holdings;
          newHoldings.push(newBalanceList[i].toString());
          cardHolder_sender.holdings = newHoldings;
        }
      }
    }

    // calculate unique cards held
    let uniqueCards = 0;
    for (let i = 0; i < cardHolder_sender.holdings.length; i++) {
      // load holdings; determine if balance is > 0
      let holdings = cardHolder_sender.holdings;
      let entry = CardBalance.load(holdings[i]);
      if(entry != null) {
              
      if (entry.balance != BigInt.fromI32(0)) {
        uniqueCards++;
      }
      }


    }

    cardHolder_sender.uniqueCards = uniqueCards;
    cardHolder_sender.save();
  }

}