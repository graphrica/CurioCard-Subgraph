import { clearStore, test, assert, createMockedFunction } from "matchstick-as/assembly/index";
import { ADDRESS_ZERO, ERC1155Unofficial_ADDRESS, ERC1155_ADDRESS } from "../src/constants";

import { handleTransferSingle } from "../src/mapping";
import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { mintCardsToUser, randomSender1, createNewERC20TransferEvent, cardBalanceId, createNewERC1155OfficialTransferEvent, curioCardAddress1, randomSender2, cardBalanceId2 } from "./helper";
import { ERC1155 } from "../generated/ERC1155/ERC1155";




test("ERC1155 Official Transfer - Wrap Event ", () => {
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
    var transfer = createNewERC1155OfficialTransferEvent(ADDRESS_ZERO, randomSender1, randomSender1, BigInt.fromString("1"), BigInt.fromString("2") )

    // Call mappings
    handleTransferSingle(transfer);
    
    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "2");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "0");
    
    // Clear the store before the next test (optional)
    clearStore();
});

test("ERC1155 Official Transfer - Unwrap Event ", () => {
    createMockedFunction(ERC1155_ADDRESS, 'try_contracts', 'try_contracts(uint256):(address)')
        .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
        .returns([ethereum.Value.fromAddress(curioCardAddress1)])

        createMockedFunction(ERC1155_ADDRESS, 'contracts', 'contracts(uint256):(address)')
        .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
        .returns([ethereum.Value.fromAddress(curioCardAddress1)])

    mintCardsToUser(randomSender1, BigInt.fromString("2"));


      // Assert the state of the store
    var wrap = createNewERC1155OfficialTransferEvent(ADDRESS_ZERO, randomSender1, randomSender1, BigInt.fromString("1"), BigInt.fromString("2") )
    var transfer = createNewERC1155OfficialTransferEvent(ERC1155_ADDRESS, ADDRESS_ZERO, randomSender1, BigInt.fromString("1"), BigInt.fromString("2") )

    // Call mappings
    handleTransferSingle(wrap); // I call the contracts function inside this handler with the same ID put into the event.
    handleTransferSingle(transfer); // I call the contracts function inside this handler with the same ID put into the event.
    
    // Assert the state of the store
    assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
    assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");
    
    // Clear the store before the next test (optional)
    clearStore();
});


test("ERC1155 Official Transfer - Unwrap Event ", () => {
    createMockedFunction(ERC1155_ADDRESS, 'try_contracts', 'try_contracts(uint256):(address)')
        .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
        .returns([ethereum.Value.fromAddress(curioCardAddress1)])

        createMockedFunction(ERC1155_ADDRESS, 'contracts', 'contracts(uint256):(address)')
        .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
        .returns([ethereum.Value.fromAddress(curioCardAddress1)])

    mintCardsToUser(randomSender1, BigInt.fromString("2"));


      // Assert the state of the store
    var wrap = createNewERC1155OfficialTransferEvent(ADDRESS_ZERO, randomSender1, randomSender1, BigInt.fromString("1"), BigInt.fromString("2") )
    var transfer = createNewERC1155OfficialTransferEvent(randomSender1, randomSender2, randomSender1, BigInt.fromString("1"), BigInt.fromString("2") )

    // Call mappings
    handleTransferSingle(wrap); // I call the contracts function inside this handler with the same ID put into the event.
    handleTransferSingle(transfer); // I call the contracts function inside this handler with the same ID put into the event.
    
    // Assert the state of the store
    assert.notInStore("CardBalance", cardBalanceId);
    assert.fieldEquals("CardBalance", cardBalanceId2, "wrappedBalance", "2");
    assert.fieldEquals("CardBalance", cardBalanceId2, "unwrappedBalance", "0");
    
    // Clear the store before the next test (optional)
    clearStore();
});

