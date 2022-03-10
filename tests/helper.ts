import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts";
import { createMockedFunction, newMockEvent } from "matchstick-as";
import { CardType } from "../generated/schema";
import { Transfer } from "../generated/templates/ERC20/ERC20";
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

export const cardBalanceId =
  curioCardAddress1.toHex() + "-" + randomSender1.toHex();
  export const cardBalanceId2 =
  curioCardAddress1.toHex() + "-" + randomSender2.toHex();

export function createNewERC20TransferEvent(
  from: Address,
  to: Address,
  value: string
): Transfer {
  let mockEvent = newMockEvent();
  let fromParam = new ethereum.EventParam(
    "from",
    ethereum.Value.fromAddress(from)
  );
  let toParam = new ethereum.EventParam("to", ethereum.Value.fromAddress(to));

  let valueParam = new ethereum.EventParam("value", ethereum.Value.fromI32(2));

  // Initialise event (this can be generalised into a separate function)
  let transferEvent = new Transfer(
    curioCardAddress1,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    [fromParam, toParam, valueParam]
  );

  return transferEvent;
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
      [operatorParam, fromParam, toParam,idParam, valueParam ]
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
      [operatorParam, fromParam, toParam,idParam, valueParam ]
    );
  
    
    return transferEvent;
  }


export function mintCardsToUser(to: Address, amount: BigInt): void {
  let cardType = new CardType(curioCardAddress1.toHex());

  cardType.supply = BigInt.fromString("1200");
  cardType.address = curioCardAddress1;
  cardType.symbol = "CURIO1";
  cardType.description = "CurioCard1";
  cardType.name = "Curio1";
  cardType.ipfsHash = "SomeHash";
  cardType.save();

  ERC20Entity.create(curioCardAddress1);

  let user_recevier = getOrCreateCardHolder(to);
  let user_recevier_cardBalance = getOrCreateCardBalance(
    to,
    cardType,
    user_recevier
  );

  user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(
    amount
  );
  user_recevier_cardBalance.save();
  user_recevier.save();
}


export function mintWrappedCardsToUser(to: Address, amount: BigInt): void {
  let cardType = new CardType(curioCardAddress1.toHex());

  cardType.supply = BigInt.fromString("1200");
  cardType.address = curioCardAddress1;
  cardType.symbol = "CURIO1";
  cardType.description = "CurioCard1";
  cardType.name = "Curio1";
  cardType.ipfsHash = "SomeHash";
  cardType.save();

  ERC20Entity.create(curioCardAddress1);

  let user_recevier = getOrCreateCardHolder(to);
  let user_recevier_cardBalance = getOrCreateCardBalance(
    to,
    cardType,
    user_recevier
  );

  user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(
    amount
  );
  user_recevier_cardBalance.save();
  user_recevier.save();
}
