import { log, BigInt, Address } from "@graphprotocol/graph-ts";
import {
  Transfer,
  TransferCall,
} from "../generated/templates/ERC20/ERC20";
import { CardType, Global } from "../generated/schema";
import {
  checkIfSentToSelf,
  clearEmptyCardBalance,
  getOrCreateCardBalance,
  getOrCreateCardHolder,
} from "./functions";
import {
  ERC1155_ADDRESS,
  ERC1155Unofficial_ADDRESS,
  ADDRESS_ZERO,
  ZERO_X_EXCHANGE,
  CARD_FACTORY2,
  PERMAWRAPPER,
  SEVENTEENB_WRAPPER_ADDRESS,
} from "./constants";

export function handleTransfer(event: Transfer): void {
  if (!checkIfSentToSelf(event.params.to, event.params.from, event.params.from) && 
      event.params.value > BigInt.fromI32(0)
  ) {
    let cardType = CardType.load(event.address.toHex());
    if (cardType == null) {
      cardType = new CardType(
        Address.fromString("0xe0b5e6f32d657e0e18d4b3e801ebc76a5959e123").toHex()
      );

      cardType.supply = BigInt.fromI32(500);
      cardType.address = Address.fromString(
        "0xe0b5e6f32d657e0e18d4b3e801ebc76a5959e123"
      );
      cardType.symbol = "CRO17b";
      cardType.description = "MISPRINT";
      cardType.name = "Curio17b";
      cardType.ipfsHash = "";
      cardType.save();

      log.warning("CARDTYPE DOES NOT EXIST - 17b CREATED", []);
    }

    if (
      event.params.from == ERC1155Unofficial_ADDRESS ||
      event.params.from == ERC1155_ADDRESS
    ) {
      log.info(
        "UNWRAP IGNORED - event.address: {} from: {} to: {} txhash: {}",
        [
          event.address.toHexString(),
          event.params.from.toHexString(),
          event.params.to.toHexString(),
          event.transaction.hash.toHexString(),
        ]
      );
    } else if (event.params.to == ERC1155Unofficial_ADDRESS) {
      log.info(
        "ERC20 WRAPPING & MINT OF ERC1155 UNOFFICIAL (IGNORED) - event.address: {} from: {} to: {} txhash: {}",
        [
          event.address.toHexString(),
          event.params.from.toHexString(),
          event.params.to.toHexString(),
          event.transaction.hash.toHexString(),
        ]
      );
    } else if (event.params.to == SEVENTEENB_WRAPPER_ADDRESS) {
      log.info(
        "17bWrapper WRAP EVENT (IGNORED) - event.address: {} from: {} to: {} txhash: {}",
        [
          event.address.toHexString(),
          event.params.from.toHexString(),
          event.params.to.toHexString(),
          event.transaction.hash.toHexString(),
        ]
      );
    } else if (event.params.to == ERC1155_ADDRESS) {
      log.info(
        "ERC20 WRAPPING & MINT OF ERC1155 OFFICIAL (IGNORED) - event.address: {} from: {} to: {} txhash: {}",
        [
          event.address.toHexString(),
          event.params.from.toHexString(),
          event.params.to.toHexString(),
          event.transaction.hash.toHexString(),
        ]
      );
    } else if (
      event.params.from == CARD_FACTORY2 ||
      event.params.from == ADDRESS_ZERO
    ) {
      //ERC20 MINT // NEVER HAPPENS
      //CREATE A CARD BALANCE USER
      //CREATE A CARD BALANCE for CARDTYPE
      let user_recevier = getOrCreateCardHolder(event.params.to);
      if(event.params.to == PERMAWRAPPER){
        user_recevier = getOrCreateCardHolder(ADDRESS_ZERO);
      }
      let user_recevier_cardBalance = getOrCreateCardBalance(
        event.params.to,
        cardType,
        user_recevier,
        event.block.number
      );

      user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.plus(
        event.params.value
      );
      user_recevier_cardBalance.save();
      user_recevier.save();
      log.info(
        "ERC20 MINT (SHOULD NEVER HAPPEN)- event.address: {} from: {} to: {} txhash: {}",
        [
          event.address.toHexString(),
          event.params.from.toHexString(),
          event.params.to.toHexString(),
          event.transaction.hash.toHexString(),
        ]
      );
    } else {
      // TRANSFER
      if (event.transaction.from == ZERO_X_EXCHANGE) {
        log.info("ZEROX TRANSFER -  txfrom : {} from: {} to: {} txhash: {}", [
          event.transaction.from.toHexString(),
          event.params.from.toHexString(),
          event.params.to.toHexString(),
          event.transaction.hash.toHexString(),
        ]);
      }

      // GET USER SENDER, GET USER SENDER CARD Balance
      let user_sender = getOrCreateCardHolder(event.params.from);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params.from,
        cardType,
        user_sender,
        event.block.number
      );
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params.to);
      let user_recevier_cardBalance = getOrCreateCardBalance(
        event.params.to,
        cardType,
        user_recevier,
        event.block.number
      );

      // DECREASE SENDER BALANCE UNWRAPPED AND save
      user_sender_cardBalance.unwrapped = user_sender_cardBalance.unwrapped.minus(
        event.params.value
      );
      user_sender_cardBalance.save();

      user_sender.save();
      // INCREASE RECEIVER BALANCE UNWRAPPED AND save
      user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.plus(
        event.params.value
      );
      user_recevier_cardBalance.save();
      user_recevier.save();
      clearEmptyCardBalance(user_sender_cardBalance);
      log.info(
        "ERC20 TRANSFER (eventHandler) - event.address: {} from: {} to: {} txhash: {}",
        [
          event.address.toHexString(),
          event.params.from.toHexString(),
          event.params.to.toHexString(),
          event.transaction.hash.toHexString(),
        ]
      );
    }
  } else {
    log.info(
      "ERC20 SELF SEND (eventHandler) - event.address: {} from: {} to: {} txhash: {}",
      [
        event.address.toHexString(),
        event.params.from.toHexString(),
        event.params.to.toHexString(),
        event.transaction.hash.toHexString(),
      ]
    );
  }
}

export function handleDirectTransfer(call: TransferCall): void {
  var txTo = call.transaction.to;
  var txToCheck = ADDRESS_ZERO;
  if(txTo){
    txToCheck = txTo;
  }
  if (!checkIfSentToSelf(call.inputs._to, call.from, call.from) && call.inputs._value > BigInt.fromI32(0)) {
    let cardType = CardType.load(call.to.toHex());
    if (cardType == null) {
      cardType = new CardType(
        Address.fromString("0xe0b5e6f32d657e0e18d4b3e801ebc76a5959e123").toHex()
      );

      cardType.supply = BigInt.fromI32(500);
      cardType.address = Address.fromString(
        "0xe0b5e6f32d657e0e18d4b3e801ebc76a5959e123"
      );
      cardType.symbol = "CRO17b";
      cardType.description = "MISPRINT";
      cardType.name = "Curio17b";
      cardType.ipfsHash = "";
      cardType.save();
      
      let global = Global.load("1");
      if(global){
        global.totalCards = global.totalCards.plus(BigInt.fromI32(1));
        global.save();
      }

      log.warning("CARDTYPE DOES NOT EXIST - 17b CREATED", []);
    }

    log.info(
      "START DIRECT TRANSFER - txfrom: {}, from: {}, to: {}, inputTo: {}",
      [
        call.transaction.from.toHexString(),
        call.from.toHexString(),
        call.to.toHexString(),
        call.inputs._to.toHexString(),
      ]
    );
    if (
      call.from == ERC1155_ADDRESS ||
      call.transaction.from == ERC1155_ADDRESS
    ) {
      log.info("IGNORE OFFICIAL UNWRAP - txfrom: {}, from: {}, to: {}", [
        call.transaction.from.toHexString(),
        call.from.toHexString(),
        call.to.toHexString(),
      ]);
    } else if (call.to == ERC1155Unofficial_ADDRESS) {
      log.info("IGNORE UNOFFICIAL WRAP - txfrom: {}, from: {}, to: {}", [
        call.transaction.from.toHexString(),
        call.from.toHexString(),
        call.to.toHexString(),
      ]);
    } else if (call.from == SEVENTEENB_WRAPPER_ADDRESS ||
      call.transaction.from == SEVENTEENB_WRAPPER_ADDRESS ) {
      log.info("IGNORE OFFICIAL UNWRAP 17b - txfrom: {}, from: {}, to: {}", [
        call.transaction.from.toHexString(),
        call.from.toHexString(),
        call.to.toHexString(),
      ]);
    } else if (
      call.to == ERC1155_ADDRESS ||
      txToCheck == ERC1155_ADDRESS
    ) {
      log.info("IGNORE OFFICIAL WRAP - txfrom: {}, from: {}, to: {}", [
        call.transaction.from.toHexString(),
        call.from.toHexString(),
        call.to.toHexString(),
      ]);
    } else if (call.from == ERC1155Unofficial_ADDRESS) {
      log.info("IGNORE UNOFFICIAL UNWRAP - txfrom: {}, from: {}, to: {}", [
        call.transaction.from.toHexString(),
        call.from.toHexString(),
        call.to.toHexString(),
      ]);
    } else if (
      call.transaction.from == CARD_FACTORY2 ||
      call.from == CARD_FACTORY2
    ) {
      let user_recevier = getOrCreateCardHolder(call.inputs._to);
      if(call.to == PERMAWRAPPER ||
        txToCheck == PERMAWRAPPER){
          user_recevier = getOrCreateCardHolder(ADDRESS_ZERO);
        }
      
      let user_recevier_cardBalance = getOrCreateCardBalance(
        call.inputs._to,
        cardType,
        user_recevier,
        call.block.number
      );

      user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.plus(
        call.inputs._value
      );
      user_recevier_cardBalance.save();
      user_recevier.save();
      log.info(
        "ERC20 MINT (CALLHANDLER) - txfrom: {}, from: {}, to: {}, txHash: {}",
        [
          call.transaction.from.toHexString(),
          call.from.toHexString(),
          call.to.toHexString(),
          call.transaction.hash.toHexString(),
        ]
      );
    } else {
      if (call.inputs._to == ADDRESS_ZERO) {
        log.info("BURN - txfrom: {}, from: {}, to: {}, txHash: {}", [
          call.transaction.from.toHexString(),
          call.from.toHexString(),
          call.to.toHexString(),
          call.transaction.hash.toHexString(),
        ]);
      }

      let user_sender = getOrCreateCardHolder(call.from);
      let user_sender_cardBalance = getOrCreateCardBalance(
        call.from,
        cardType,
        user_sender,
        call.block.number
      );
      // if (
      //   user_sender_cardBalance.unwrappedBalance.minus(call.inputs._value) >=
      //   BigInt.fromI32(0)
      // ) {
        // GET USER RECEIVER and USER RECEIVER CARD Balance
        let user_recevier = getOrCreateCardHolder(call.inputs._to);
        let user_recevier_cardBalance = getOrCreateCardBalance(
          call.inputs._to,
          cardType,
          user_recevier,
          call.block.number
        );

        // DECREASE SENDER BALANCE UNWRAPPED AND save
        user_sender_cardBalance.unwrapped = user_sender_cardBalance.unwrapped.minus(
          call.inputs._value
        );
        user_sender_cardBalance.save();

        user_sender.save();
        // INCREASE RECEIVER BALANCE UNWRAPPED AND save
        user_recevier_cardBalance.unwrapped = user_recevier_cardBalance.unwrapped.plus(
          call.inputs._value
        );
        user_recevier_cardBalance.save();
        user_recevier.save();
        clearEmptyCardBalance(user_sender_cardBalance);
        log.info(
          "TRANSFER-DIRECT- txfrom: {}, from: {}, to: {}, inputTo: {}, value: {}, txHash: {}",
          [
            call.transaction.from.toHexString(),
            call.from.toHexString(),
            call.to.toHexString(),
            call.inputs._to.toHexString(),
            call.inputs._value.toHexString(),
            call.transaction.hash.toHexString(),
          ]
        );
      }
    // }
  } else {
    log.info(
      "SELF-SEND 17b - txfrom: {}, from: {}, to: {}, inputTo: {}, value: {}, txHash: {}",
      [
        call.transaction.from.toHexString(),
        call.from.toHexString(),
        call.to.toHexString(),
        call.inputs._to.toHexString(),
        call.inputs._value.toHexString(),
        call.transaction.hash.toHexString(),
      ]
    );
  }
}
