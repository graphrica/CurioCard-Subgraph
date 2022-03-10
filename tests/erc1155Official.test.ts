import { clearStore, test, assert, createMockedFunction } from "matchstick-as/assembly/index";
import { ADDRESS_ZERO, ERC1155_ADDRESS } from "../src/constants";

import { handleTransferSingle } from "../src/erc1155Official-mapping";
import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { mintCardsToUser, randomSender1, cardBalanceId, createNewERC1155OfficialTransferEvent, curioCardAddress1, randomSender2, cardBalanceId2, mintWrappedCardsToUser } from "./helper";


test("ERC1155 Official - Wrap Event (IGNORED)", () => {
    createMockedFunction(ERC1155_ADDRESS, 'try_contracts', 'try_contracts(uint256):(address)')
        .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
        .returns([ethereum.Value.fromAddress(curioCardAddress1)])

        createMockedFunction(ERC1155_ADDRESS, 'contracts', 'contracts(uint256):(address)')
        .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
        .returns([ethereum.Value.fromAddress(curioCardAddress1)])

    mintCardsToUser(randomSender1, BigInt.fromString("2"));
      // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");
    var wrap = createNewERC1155OfficialTransferEvent(ADDRESS_ZERO, randomSender1, randomSender1, BigInt.fromString("1"), BigInt.fromString("2") )

    // Call mappings
    handleTransferSingle(wrap);
    
    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");
    
    // Clear the store before the next test (optional)
    clearStore();
});

test("ERC1155 Official - Unwrap Event (IGNORED)", () => {
    createMockedFunction(ERC1155_ADDRESS, 'try_contracts', 'try_contracts(uint256):(address)')
        .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
        .returns([ethereum.Value.fromAddress(curioCardAddress1)])

        createMockedFunction(ERC1155_ADDRESS, 'contracts', 'contracts(uint256):(address)')
        .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
        .returns([ethereum.Value.fromAddress(curioCardAddress1)])

    mintWrappedCardsToUser(randomSender1, BigInt.fromString("2"));


      // Assert the state of the store
    var unwrap = createNewERC1155OfficialTransferEvent(ERC1155_ADDRESS, ADDRESS_ZERO, randomSender1, BigInt.fromString("1"), BigInt.fromString("2") )

    // Call mappings/ I call the contracts function inside this handler with the same ID put into the event.
    handleTransferSingle(unwrap); // I call the contracts function inside this handler with the same ID put into the event.
    
    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "2");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "0");
    
    // Clear the store before the next test (optional)
    clearStore();
});


test("ERC1155 Official - Transfer", () => {
    createMockedFunction(ERC1155_ADDRESS, 'try_contracts', 'try_contracts(uint256):(address)')
        .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
        .returns([ethereum.Value.fromAddress(curioCardAddress1)])

        createMockedFunction(ERC1155_ADDRESS, 'contracts', 'contracts(uint256):(address)')
        .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
        .returns([ethereum.Value.fromAddress(curioCardAddress1)])

    mintWrappedCardsToUser(randomSender1, BigInt.fromString("2"));


      // Assert the state of the store
    var transfer = createNewERC1155OfficialTransferEvent(randomSender1, randomSender2, randomSender1, BigInt.fromString("1"), BigInt.fromString("2") )

    // Call mappings
    handleTransferSingle(transfer); // I call the contracts function inside this handler with the same ID put into the event.
    
    // Assert the state of the store
    assert.notInStore("CardBalance", cardBalanceId);
    assert.fieldEquals("CardBalance", cardBalanceId2, "wrappedBalance", "2");
    assert.fieldEquals("CardBalance", cardBalanceId2, "unwrappedBalance", "0");
    
    // Clear the store before the next test (optional)
    clearStore();
});

