import { clearStore, test, assert } from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { handleTransfer } from "../src/erc20-mapping";
import { ERC1155Unofficial_ADDRESS, ERC1155_ADDRESS } from "../src/constants";
import {
  cardBalanceId,
  createNewERC20TransferEvent,
  mintCardsToUser,
  randomSender1,
} from "./helper";

test("ERC20 Transfer - Wrap Event Official ERC1155", () => {
  mintCardsToUser(randomSender1, BigInt.fromString("2"));

  var transfer = createNewERC20TransferEvent(
    randomSender1,
    ERC1155_ADDRESS,
    "2"
  );

  // Call mappings
  handleTransfer(transfer);

  // Assert the state of the store
  assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "2");
  assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "0");

  // Clear the store before the next test (optional)
  clearStore();
});

test("ERC20 Transfer - Unwrap Event Official ERC1155 (Ignored)", () => {
  mintCardsToUser(randomSender1, BigInt.fromString("2"));

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

test("ERC20 Transfer - Unwrap Event Unofficial ERC1155 (Ignored)", () => {
  mintCardsToUser(randomSender1, BigInt.fromString("2"));

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

test("ERC20 Transfer - Wrap Event Unofficial ERC1155", () => {
  mintCardsToUser(randomSender1, BigInt.fromString("2"));

  var transfer = createNewERC20TransferEvent(
    randomSender1,
    ERC1155Unofficial_ADDRESS,
    "2"
  );

  // Call mappings
  handleTransfer(transfer);

  // Assert the state of the store
  assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "2");
  assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "0");

  // Clear the store before the next test (optional)
  clearStore();
});