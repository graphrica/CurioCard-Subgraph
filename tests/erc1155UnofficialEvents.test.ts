import {
  clearStore,
  test,
  assert,
  createMockedFunction,
  describe,
} from "matchstick-as/assembly/index";
import {
  ADDRESS_ZERO,
  ERC1155Unofficial_ADDRESS,
  ERC1155_ADDRESS,
} from "../src/constants";

import { handleTransferSingleUnofficial } from "../src/erc1155Unofficial-mapping";
import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  mintCardsToUser,
  randomSender1,
  cardBalanceId,
  curioCardAddress1,
  randomSender2,
  cardBalanceId2,
  createNewERC1155UnofficialTransferEvent,
  createNewERC20TransferEvent,
  mintWrappedCardsToUser,
} from "./helper";
import { handleTransfer } from "../src/erc20-mapping";

describe("ERC1155 UNOFFICIAL TESTS", () => {
  test("ERC1155 Unofficial - Wrap Event (IGNORED) ", () => {

    mintCardsToUser(randomSender1, BigInt.fromString("2"));
    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");
    var wrap = createNewERC1155UnofficialTransferEvent(
      ADDRESS_ZERO,
      randomSender1,
      randomSender1,
      BigInt.fromString("1"),
      BigInt.fromString("2")
    );

    // Call mappings
    handleTransferSingleUnofficial(wrap);

    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");

    // Clear the store before the next test (optional)
    clearStore();
  });

  test("ERC1155 Unofficial - Unwrap Event (IGNORED)", () => {
    // createMockedFunction(
    //   ERC1155_ADDRESS,
    //   "try_contracts",
    //   "try_contracts(uint256):(address)"
    // )
    //   .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
    //   .returns([ethereum.Value.fromAddress(curioCardAddress1)]);

    // createMockedFunction(
    //   ERC1155_ADDRESS,
    //   "contracts",
    //   "contracts(uint256):(address)"
    // )
    //   .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
    //   .returns([ethereum.Value.fromAddress(curioCardAddress1)]);

    mintWrappedCardsToUser(randomSender1, BigInt.fromString("2"));

    var transfer = createNewERC20TransferEvent(
      randomSender1,
      ERC1155Unofficial_ADDRESS,
      "2"
    );

    // Call mappings
    handleTransfer(transfer);

    // Assert the state of the store
    var unwrap = createNewERC1155UnofficialTransferEvent(
      randomSender1,
      randomSender1,
      ADDRESS_ZERO,
      BigInt.fromString("1"),
      BigInt.fromString("2")
    );

    // Call mappings
    handleTransferSingleUnofficial(unwrap);

    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "2");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "0");

    // Clear the store before the next test (optional)
    clearStore();
  });

  test("ERC1155 Unofficial - Transfer", () => {

    mintWrappedCardsToUser(randomSender1, BigInt.fromString("2"));

    // Assert the state of the store
    var transfer = createNewERC1155UnofficialTransferEvent(
      randomSender1,
      randomSender2,
      randomSender1,
      BigInt.fromString("1"),
      BigInt.fromString("2")
    );

    // Call mappings
    handleTransferSingleUnofficial(transfer);

    // Assert the state of the store
    assert.notInStore("CardBalance", cardBalanceId);
    assert.fieldEquals("CardBalance", cardBalanceId2, "wrappedBalance", "2");
    assert.fieldEquals("CardBalance", cardBalanceId2, "unwrappedBalance", "0");

    // Clear the store before the next test (optional)
    clearStore();
  });
});
