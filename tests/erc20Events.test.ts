import {
  clearStore,
  test,
  assert,
  describe,
  beforeEach,
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { handleTransfer } from "../src/erc20-mapping";
import { handleDirectTransfer as handle17bDirectTransfer, handleTransfer as handle17bTransfer } from "../src/seventeenb-mapping";
import { ERC1155Unofficial_ADDRESS, ERC1155_ADDRESS } from "../src/constants";
import {
  cardBalanceId,
  cardBalanceId17b,
  cardBalanceId17b2,
  cardBalanceId2,
  createCard,
  createCard17b,
  createNewERC20TransferEvent,
  creatNewERC20TransferCall,
  curioCardAddress1,
  mintCardsToUser,
  mintWrappedCardsToUser,
  randomSender1,
  randomSender2,
  seventeenbCurio,
  seventeenbWrapper,
} from "./helper";
import { afterEach } from "matchstick-as";

describe("ERC20 Transfer Event Tests", () => {

  beforeEach(() => {
    createCard(); 
    mintCardsToUser(randomSender1, BigInt.fromString("2"), curioCardAddress1);
  })
  describe("Non-state changing", ()=> {
  
    test("ERC20 - Wrap Event Official ERC1155 (IGNORED)", () => {
    

      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");
      var transfer = createNewERC20TransferEvent(
        randomSender1,
        ERC1155_ADDRESS,
        "2"
      );
        
      // Call mappings
      handleTransfer(transfer);
  
      // Assert the state of the store
            
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");
  
      // Clear the store before the next test (optional)
    });
  
    test("ERC20 - Unwrap Event Official ERC1155 (Ignored)", () => {
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");
      var transfer = createNewERC20TransferEvent(
        ERC1155_ADDRESS,
        randomSender1,
        "2"
      );
  
      // Call mappings
      handleTransfer(transfer);
  
      // Assert the state of the store
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");
  
      // Clear the store before the next test (optional)
    });
  
    test("ERC20 - Unwrap Event Unofficial ERC1155 (Ignored)", () => {
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");

      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");
      var transfer = createNewERC20TransferEvent(
        ERC1155Unofficial_ADDRESS,
        randomSender1,
        "2"
      );
      
      // Call mappings
      handleTransfer(transfer);
  
      // Assert the state of the store
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");
  
      // Clear the store before the next test (optional)
    });
  
    test("ERC20 Transfer - Wrap Event Unofficial ERC1155 (Ignored)", () => {
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");
      var transfer = createNewERC20TransferEvent(
        randomSender1,
        ERC1155Unofficial_ADDRESS,
        "2"
      );
  
      // Call mappings
      handleTransfer(transfer);
  
      // Assert the state of the store
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");
  
      // Clear the store before the next test (optional)
    });

    test("ERC20 Transfer 17b - Wrap Event Ignored", () => {
      createCard17b(); 
      mintCardsToUser(randomSender1, BigInt.fromString("2"), seventeenbCurio);
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "unwrapped", "2");
      var transfer = createNewERC20TransferEvent(
        randomSender1,
        seventeenbWrapper,
        "2"
      );
  
      // Call mappings
      handle17bTransfer(transfer);
  
      // Assert the state of the store
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "unwrapped", "2");
  
      // Clear the store before the next test (optional)
    });

    test("ERC20 Transfer 17b - Unwrap Event Ignored", () => {
      createCard17b(); 
      mintWrappedCardsToUser(randomSender1, BigInt.fromString("2"), seventeenbCurio);
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedOfficial", "2");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "unwrapped", "0");
      var transfer = creatNewERC20TransferCall(
        seventeenbWrapper,
        randomSender1,
        "2",
        seventeenbWrapper
      );
  
      // Call mappings
      handle17bDirectTransfer(transfer);
  
      // Assert the state of the store
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedOfficial", "2");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedUnofficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "unwrapped", "0");
  
      // Clear the store before the next test (optional)
    });
    afterEach(() => {
      clearStore(); 
    })
  })
  
describe("State changing", () => {
  beforeEach(() => {
    createCard(); 
    mintCardsToUser(randomSender1, BigInt.fromString("2"), curioCardAddress1);
  })
  test("ERC20 Transfer - Transfer of ERC20", () => {
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedUnofficial", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "4");

    var transfer = createNewERC20TransferEvent(
      randomSender1,
      randomSender2,
      "2"
    );

    // Call mappings
    handleTransfer(transfer);

    // Assert the state of the store

    //assert.notInStore("CardBalance", cardBalanceId);
    assert.fieldEquals("CardBalance", cardBalanceId2, "wrappedOfficial", "0");
    assert.fieldEquals("CardBalance", cardBalanceId2, "wrappedUnofficial", "0");
    assert.fieldEquals("CardBalance", cardBalanceId2, "unwrapped", "2");
    // Clear the store before the next test (optional)
  });

  test("ERC20 Transfer 17b Direct Transfer - Transfer Call", () => {
    createCard17b(); 
    mintCardsToUser(randomSender1, BigInt.fromString("2"), seventeenbCurio);
    assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedOfficial", "0");
    assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedUnofficial", "0");
    assert.fieldEquals("CardBalance", cardBalanceId17b, "unwrapped", "2");
    var transfer = creatNewERC20TransferCall(
      randomSender1,
      randomSender2,
      "2",
      seventeenbCurio
    );

    // Call mappings
    handle17bDirectTransfer(transfer);

    // Assert the state of the store
    assert.entityCount("CardBalance", 2);
    assert.fieldEquals("CardBalance", cardBalanceId17b2, "unwrapped", "2");

    // Clear the store before the next test (optional)
  });
  afterEach(() => {
    clearStore(); 
  })
})
  
});

