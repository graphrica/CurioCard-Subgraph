import {
  clearStore,
  test,
  assert,
  createMockedFunction,
  describe,
  beforeEach,
  afterAll,
} from "matchstick-as/assembly/index";
import {
  ADDRESS_ZERO,
  ERC1155Unofficial_ADDRESS,
  ERC1155_ADDRESS,
} from "../../src/constants";

import { handleTransferSingleUnofficial } from "../../src/erc1155Unofficial-mapping";
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
  createCard,
  mintUnofficialWrappedCardsToUser,
} from "../helper";
import { handleTransfer } from "../../src/erc20-mapping";
import { CardBalance } from "../../generated/schema";

describe("ERC1155 UNOFFICIAL TESTS", () => {
  beforeEach(() => {
    createCard(); 
  })

  test("ERC1155 Unofficial - Wrap Event (IGNORED) ", () => {
    // Arrange of the Test
    mintCardsToUser(randomSender1, BigInt.fromString("2"), curioCardAddress1);
    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");

    // Arrange
    var wrap = createNewERC1155UnofficialTransferEvent(
      ADDRESS_ZERO,
      randomSender1,
      randomSender1,
      BigInt.fromString("1"),
      BigInt.fromString("2")
    );

    // Call mappings

    //Act 
    handleTransferSingleUnofficial(wrap);

    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");

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

    mintUnofficialWrappedCardsToUser(randomSender1, BigInt.fromString("2"));

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
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "2");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "0");

    // Clear the store before the next test (optional)
    clearStore();
  });

  test("ERC1155 Unofficial - Transfer", () => {

    mintUnofficialWrappedCardsToUser(randomSender1, BigInt.fromString("2"));

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

    var cardBalance = CardBalance.load(cardBalanceId2);
    if(cardBalance != null) {
      assert.stringEquals(cardBalance.type, curioCardAddress1.toHexString());
      assert.stringEquals(cardBalance.user, randomSender2.toHexString());
    }

   
    // Assert the state of the store
    assert.notInStore("CardBalance", cardBalanceId);
    assert.fieldEquals("CardBalance", cardBalanceId2, "wrappedUnofficial", "2");
    assert.fieldEquals("CardBalance", cardBalanceId2, "unwrapped", "0");
    assert.fieldEquals("CardBalance", cardBalanceId2, "wrappedOfficial", "0");

    // Clear the store before the next test (optional)
   
  });

  afterAll(() => {
    clearStore();
  })
});
