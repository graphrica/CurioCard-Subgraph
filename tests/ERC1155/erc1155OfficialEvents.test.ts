import {
  clearStore,
  test,
  assert,
  createMockedFunction,
  describe,
  beforeEach,
} from "matchstick-as/assembly/index";
import { ADDRESS_ZERO, ERC1155_ADDRESS } from "../../src/constants";

import { handleTransferSingle } from "../../src/erc1155Official-mapping";
import { handleTransferSingle as handleTransfer17bSingle} from "../../src/17bWrapper-mapping";
import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  mintCardsToUser,
  randomSender1,
  cardBalanceId,
  createNewERC1155OfficialTransferEvent,
  curioCardAddress1,
  randomSender2,
  cardBalanceId2,
  mintWrappedCardsToUser,
  createCard,
  seventeenbWrapper,
  createCard17b,
  cardBalanceId17b,
  cardBalanceId17b2,
  seventeenbCurio,
} from "../helper";
import { afterEach, beforeAll } from "matchstick-as";

describe("ERC1155 OFFICIAL TESTS", () => {
 

  describe("Non-State Changing", ()=>{
    beforeEach(() => {
      createCard();
     
    })
    test("ERC1155 Official - Wrap Event (IGNORED)", () => {
      mintCardsToUser(randomSender1, BigInt.fromString("2"), curioCardAddress1);
      // Assert the state of the store
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");
      var wrap = createNewERC1155OfficialTransferEvent(
        ADDRESS_ZERO,
        randomSender1,
        randomSender1,
        BigInt.fromString("1"),
        BigInt.fromString("2")
      );
  
      // Call mappings
      handleTransferSingle(wrap);

  
      // Assert the state of the store
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "2");
  
      // Clear the store before the next test (optional)
    });
  
    test("ERC1155 Official - Unwrap Event (IGNORED)", () => {   
      mintWrappedCardsToUser(randomSender1, BigInt.fromString("2"), curioCardAddress1);
  
      // Assert the state of the store
      var unwrap = createNewERC1155OfficialTransferEvent(
        ERC1155_ADDRESS,
        ADDRESS_ZERO,
        randomSender1,
        BigInt.fromString("1"),
        BigInt.fromString("2")
      );
  
      // Call mappings/ I call the contracts function inside this handler with the same ID put into the event.
      handleTransferSingle(unwrap); // I call the contracts function inside this handler with the same ID put into the event.
  
      // Assert the state of the store
      assert.fieldEquals("CardBalance", cardBalanceId, "wrappedOfficial", "2");
      assert.fieldEquals("CardBalance", cardBalanceId, "unwrapped", "0");
  
      // Clear the store before the next test (optional)
    });


  test("ERC1155 Official - Transfer", () => {

 

    mintWrappedCardsToUser(randomSender1, BigInt.fromString("2"), curioCardAddress1);

    // Assert the state of the store
    var transfer = createNewERC1155OfficialTransferEvent(
      randomSender1,
      randomSender2,
      randomSender1,
      BigInt.fromString("1"),
      BigInt.fromString("2")
    );

    // Call mappings
    handleTransferSingle(transfer); // I call the contracts function inside this handler with the same ID put into the event.

    // Assert the state of the store
    assert.notInStore("CardBalance", cardBalanceId);
    assert.fieldEquals("CardBalance", cardBalanceId2, "wrappedOfficial", "2");
    assert.fieldEquals("CardBalance", cardBalanceId2, "unwrapped", "0");

    // Clear the store before the next test (optional)

  });
  describe("17b Official Wrapper", () => {
    test("17b Official - Transfer", () => {
    
    
      createCard17b();
      mintWrappedCardsToUser(randomSender1, BigInt.fromString("2"), seventeenbCurio);
  
      // Assert the state of the store
      var transfer = createNewERC1155OfficialTransferEvent(
        randomSender1,
        randomSender2,
        seventeenbWrapper,
        BigInt.fromString("172"),
        BigInt.fromString("2")
      );
  
      // Call mappings
      handleTransfer17bSingle(transfer); // I call the contracts function inside this handler with the same ID put into the event.
  
      // Assert the state of the store
      assert.notInStore("CardBalance", cardBalanceId17b);
      assert.fieldEquals("CardBalance", cardBalanceId17b2, "wrappedOfficial", "2");
      assert.fieldEquals("CardBalance", cardBalanceId17b2, "unwrapped", "0");
  
      // Clear the store before the next test (optional)
  
    });
    test("17b Official - Wrap", () => {
    
    
      createCard17b();
      mintCardsToUser(randomSender1, BigInt.fromString("2"), seventeenbCurio);

      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "unwrapped", "2");
  
      // Assert the state of the store
      var transfer = createNewERC1155OfficialTransferEvent(
        ADDRESS_ZERO,
        randomSender1,
        seventeenbWrapper,
        BigInt.fromString("172"),
        BigInt.fromString("2")
      );
  
      // Call mappings
      handleTransfer17bSingle(transfer); // I call the contracts function inside this handler with the same ID put into the event.
  
      // Assert the state of the store
      
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedOfficial", "2");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "unwrapped", "0");
  
      // Clear the store before the next test (optional)
  
    });
    test("17b Official - Unwrap", () => {
    
    
      createCard17b();
      mintWrappedCardsToUser(randomSender1, BigInt.fromString("2"), seventeenbCurio);

           
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedOfficial", "2");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "unwrapped", "0");
  
      // Assert the state of the store
      var transfer = createNewERC1155OfficialTransferEvent(
        randomSender1,
        ADDRESS_ZERO,
        seventeenbWrapper,
        BigInt.fromString("172"),
        BigInt.fromString("2")
      );
  
      // Call mappings
      handleTransfer17bSingle(transfer); // I call the contracts function inside this handler with the same ID put into the event.
  
      // Assert the state of the store
      
      assert.fieldEquals("CardBalance", cardBalanceId17b, "wrappedOfficial", "0");
      assert.fieldEquals("CardBalance", cardBalanceId17b, "unwrapped", "2");
  
      // Clear the store before the next test (optional)
  
    });
  })
  
    afterEach(() => {
      clearStore(); 
  
  
    })
  })
  
 
});
