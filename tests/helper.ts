import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts";
import { createMockedFunction, newMockCall, newMockEvent } from "matchstick-as";
import { CardType } from "../generated/schema";
import { Transfer } from "../generated/templates/ERC20/ERC20";
import { TransferCall } from "../generated/templates/ERC20/ERC20";
import { getOrCreateCardHolder, getOrCreateCardBalance } from "../src/functions";
import { ERC20 as ERC20Entity } from "../generated/templates";
import { ERC1155_ADDRESS } from "../src/constants";
import { TransferSingle } from "../generated/ERC1155/ERC1155";
import { TransferSingle as TransferSingleUnofficial } from "../generated/ERC1155Unofficial/ERC1155Unofficial";

export const curioCardAddress1 = Address.fromString(
  "0x6aa2044c7a0f9e2758edae97247b03a0d7e73d6c"
);
export const randomSender1 = Address.fromString(
  "0x734bb23e9eafe199d808b4d3cc4fadd66799da2c"
);
export const randomSender2 = Address.fromString(
  "0x267e959769dfe608a578f1de63eabd18e187d8b7"
);

export const seventeenbWrapper = Address.fromString("0x04afa589e2b933f9463c5639f412b183ec062505")
export const seventeenbCurio = Address.fromString("0xe0b5e6f32d657e0e18d4b3e801ebc76a5959e123")

export const cardBalanceId =
  curioCardAddress1.toHex() + "-" + randomSender1.toHex();
  export const cardBalanceId2 =
  curioCardAddress1.toHex() + "-" + randomSender2.toHex();


export const cardBalanceId17b =
seventeenbCurio.toHex() + "-" + randomSender1.toHex();
export const cardBalanceId17b2 =
seventeenbCurio.toHex() + "-" + randomSender2.toHex();
export function createNewERC20TransferEvent(
  from: Address,
  to: Address,
  value: string
): Transfer {
  let mockEvent = newMockEvent();
  let originContractParam = new ethereum.EventParam(
    "orginContractParam",
    ethereum.Value.fromAddress(from)
  );
  let toParam = new ethereum.EventParam("to", ethereum.Value.fromAddress(to));

  let valueParam = new ethereum.EventParam("value", ethereum.Value.fromI32(2));

  // Initialise event (this can be generalised into a separate function)
  let transferEvent = new OfferPlaced(
    curioCardAddress1, 
    mockEvent.logIndex, 
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    [fromParam, toParam, valueParam],
    mockEvent.receipt
  );

  return transferEvent;
}

export function creatNewERC20TransferCall(from: Address, to: Address, value: string, transactionTo: Address): TransferCall {
  let mockCall = newMockCall();
  let toParam = new ethereum.EventParam("to", ethereum.Value.fromAddress(to));
  let valueParam = new ethereum.EventParam("value", ethereum.Value.fromI32(2));

  let callEvent = new TransferCall(
    transactionTo,
    from,
    mockCall.block,
    mockCall.transaction,
    [toParam, valueParam],
    []
  )

  return callEvent;
}

export function createNewERC1155OfficialTransferEvent(
    from: Address,
    to: Address,
    operator: Address,
    id: BigInt,
    value: BigInt,
  ): TransferSingle {
    let mockEvent = newMockEvent();
    let fromParam = new ethereum.EventParam(
      "_from",
      ethereum.Value.fromAddress(from)
    );
    let toParam = new ethereum.EventParam("_to", ethereum.Value.fromAddress(to));
    let operatorParam = new ethereum.EventParam("_operator", ethereum.Value.fromAddress(operator));
  
    let valueParam = new ethereum.EventParam("_value", ethereum.Value.fromSignedBigInt(value));
    let idParam = new ethereum.EventParam("_id", ethereum.Value.fromSignedBigInt(id));
  
    // Initialise event (this can be generalised into a separate function)
    let transferEvent = new TransferSingle(
      mockEvent.address,
      mockEvent.logIndex,
      mockEvent.transactionLogIndex,
      mockEvent.logType,
      mockEvent.block,
      mockEvent.transaction,
      [operatorParam, fromParam, toParam,idParam, valueParam ],
      mockEvent.receipt
    );
  
    
    return transferEvent;
  }

  export function createNewERC1155UnofficialTransferEvent(
    from: Address,
    to: Address,
    operator: Address,
    id: BigInt,
    value: BigInt,
  ): TransferSingleUnofficial {
    let mockEvent = newMockEvent();
    let fromParam = new ethereum.EventParam(
      "_from",
      ethereum.Value.fromAddress(from)
    );
    let toParam = new ethereum.EventParam("_to", ethereum.Value.fromAddress(to));
    let operatorParam = new ethereum.EventParam("_operator", ethereum.Value.fromAddress(operator));
  
    let valueParam = new ethereum.EventParam("_value", ethereum.Value.fromSignedBigInt(value));
    let idParam = new ethereum.EventParam("_id", ethereum.Value.fromSignedBigInt(id));
  
    // Initialise event (this can be generalised into a separate function)
    let transferEvent = new TransferSingleUnofficial(
      mockEvent.address,
      mockEvent.logIndex,
      mockEvent.transactionLogIndex,
      mockEvent.logType,
      mockEvent.block,
      mockEvent.transaction,
      [operatorParam, fromParam, toParam,idParam, valueParam ],
      mockEvent.receipt
    );
  
    
    return transferEvent;
  }
export function createCard() :CardType {
  let cardType = new CardType(curioCardAddress1.toHex());

  cardType.supply = BigInt.fromString("1200");
  cardType.address = curioCardAddress1;
  cardType.symbol = "CURIO1";
  cardType.description = "CurioCard1";
  cardType.name = "Curio1";
  cardType.ipfsHash = "SomeHash";
  cardType.save();
  return cardType;
}

export function createCard17b() :CardType {
  let cardType = new CardType(seventeenbCurio.toHex());

  cardType.supply = BigInt.fromString("1200");
  cardType.address = seventeenbCurio;
  cardType.symbol = "CURIO17b";
  cardType.description = "CurioCard17b";
  cardType.name = "Curio17b";
  cardType.ipfsHash = "SomeHash";
  cardType.save();
  return cardType;
}

export function mintCardsToUser(to: Address, amount: BigInt, cardAddress: Address): void {
  let cardType = CardType.load(cardAddress.toHex())
  if(cardType != null) {
    let user_recevier = getOrCreateCardHolder(to);
    let user_recevier_cardBalance = getOrCreateCardBalance(
      to,
      cardType,
      user_recevier,
      BigInt.fromI32(1)
    );
  
    user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.plus(
      amount
    );
    user_recevier_cardBalance.save();
    user_recevier.save();
  }
 
}


export function mintWrappedCardsToUser(to: Address, amount: BigInt, cardAddress: Address): void {
  let cardType = CardType.load(cardAddress.toHex())
  if(cardType != null) {

  let user_recevier = getOrCreateCardHolder(to);
  let user_recevier_cardBalance = getOrCreateCardBalance(
    to,
    cardType,
    user_recevier,
    BigInt.fromI32(1)
  );

  user_recevier_cardBalance.wrappedOfficial = user_recevier_cardBalance.wrappedOfficial.plus(
    amount
  );
  user_recevier_cardBalance.save();
  user_recevier.save();
  }
}



export function mintUnofficialWrappedCardsToUser(to: Address, amount: BigInt): void {
  let cardType = CardType.load(curioCardAddress1.toHex())
  if(cardType != null) {

  let user_recevier = getOrCreateCardHolder(to);
  let user_recevier_cardBalance = getOrCreateCardBalance(
    to,
    cardType,
    user_recevier,
    BigInt.fromI32(1)
  );

  user_recevier_cardBalance.wrappedUnofficial = user_recevier_cardBalance.wrappedUnofficial.plus(
    amount
  );
  user_recevier_cardBalance.save();
  user_recevier.save();
  }
}

