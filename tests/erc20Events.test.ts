import {
  clearStore,
  test,
  assert,
  describe,
  beforeAll,
  beforeEach,
  log
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { handleTransfer } from "../src/erc20-mapping";
import { ADDRESS_ZERO, ERC1155Unofficial_ADDRESS, ERC1155_ADDRESS } from "../src/constants";
import {
  cardBalanceId,
  cardBalanceId2,
  createCard,
  createNewERC1155OfficialTransferEvent,
  createNewERC20TransferEvent,
  mintCardsToUser,
  mintWrappedCardsToUser,
  randomSender1,
  randomSender2,
} from "./helper";
import { handleTransferSingle } from "../src/erc1155Official-mapping";

describe("ERC20 Transfer Event Tests", () => {
  
  beforeEach(() => {
    createCard(); 
    mintCardsToUser(randomSender1, BigInt.fromString("2"));
  })

  test("ERC20 - Wrap Event Official ERC1155 (IGNORED)", () => {
  
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");
    var transfer = createNewERC20TransferEvent(
      randomSender1,
      ERC1155_ADDRESS,
      "2"
    );

    // Call mappings
    handleTransfer(transfer);

    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");

    // Clear the store before the next test (optional)
    clearStore();
  });

  test("ERC20 - Unwrap Event Official ERC1155 (Ignored)", () => {
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");
    var transfer = createNewERC20TransferEvent(
      ERC1155_ADDRESS,
      randomSender1,
      "2"
    );

    // Call mappings
    handleTransfer(transfer);

    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");

    // Clear the store before the next test (optional)
    clearStore();
  });

  test("ERC20 - Unwrap Event Unofficial ERC1155 (Ignored)", () => {
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");
    var transfer = createNewERC20TransferEvent(
      ERC1155Unofficial_ADDRESS,
      randomSender1,
      "2"
    );

    // Call mappings
    handleTransfer(transfer);

    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");

    // Clear the store before the next test (optional)
    clearStore();
  });

  test("ERC20 Transfer - Wrap Event Unofficial ERC1155 (Ignored)", () => {
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");
    var transfer = createNewERC20TransferEvent(
      randomSender1,
      ERC1155Unofficial_ADDRESS,
      "2"
    );

    // Call mappings
    handleTransfer(transfer);

    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");

    // Clear the store before the next test (optional)
    clearStore();
  });

  test("ERC20 Transfer - Transfer of ERC20", () => {
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");

    var transfer = createNewERC20TransferEvent(
      randomSender1,
      randomSender2,
      "2"
    );

    // Call mappings
    handleTransfer(transfer);

    // Assert the state of the store

    assert.notInStore("CardBalance", cardBalanceId);
    assert.fieldEquals("CardBalance", cardBalanceId2, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId2, "unwrappedBalance", "2");
    // Clear the store before the next test (optional)
    clearStore();
  });
});

