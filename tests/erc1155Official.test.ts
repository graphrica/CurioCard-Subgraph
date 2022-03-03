import { clearStore, test, assert, createMockedFunction } from "matchstick-as/assembly/index";
import { ADDRESS_ZERO, ERC1155Unofficial_ADDRESS, ERC1155_ADDRESS } from "../src/constants";

import { handleTransferSingle } from "../src/mapping";
import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { mintCardsToUser, randomSender1, createNewERC20TransferEvent, cardBalanceId, createNewERC1155OfficialTransferEvent, curioCardAddress1 } from "./helper";
import { ERC1155 } from "../generated/ERC1155/ERC1155";

// test("ERC1155 Official Transfer - Wrap Event ", () => {
//     mintCardsToUser(randomSender1, BigInt.fromString("2"));
//       // Assert the state of the store
//     assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
//     assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");
//     var transfer = createNewERC1155OfficialTransferEvent(ADDRESS_ZERO, randomSender1, randomSender1, BigInt.fromString("1"), BigInt.fromString("2") )
    
//     createMockedFunction(ERC1155_ADDRESS, 'try_contracts', 'try_contracts(uint256):(address)')
//   .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
//   .returns([ethereum.Value.fromAddress(curioCardAddress1)])
//     // Call mappings
//     handleTransferSingle(transfer);
    
//     // Assert the state of the store
//     assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "0");
//     assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "2");
    
//     // Clear the store before the next test (optional)
//     clearStore();
// });

// test("ERC1155 Official Transfer - Unwrap Event ", () => {
//     mintCardsToUser(randomSender1, BigInt.fromString("2"));
//       // Assert the state of the store
//     var transfer = createNewERC1155OfficialTransferEvent(ERC1155_ADDRESS, ADDRESS_ZERO, randomSender1, BigInt.fromString("1"), BigInt.fromString("2") )
    
//     createMockedFunction(ERC1155_ADDRESS, 'try_contracts', 'try_contracts(uint256):(address)')
//   .withArgs([ethereum.Value.fromSignedBigInt(BigInt.fromString("1"))])
//   .returns([ethereum.Value.fromAddress(curioCardAddress1)])
//   let contract = ERC1155.bind(ERC1155_ADDRESS);
//   let nftAddress = contract.contracts(BigInt.fromString("1"))
//     // Call mappings
//     handleTransferSingle(transfer);
    
//     // Assert the state of the store
//     assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "2");
//     assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "0");
    
//     // Clear the store before the next test (optional)
//     clearStore();
// });