import { Address, log } from "@graphprotocol/graph-ts";
import { CreateCardCall } from "../generated/CardFactory/CardFactory";
import { CardType } from "../generated/schema";
import { ERC20 } from "../generated/templates";


export function handleCreateCard(call: CreateCardCall): void {
  if (
    Address.fromString("0x39786ae114cb7bca7ac103cb10aab4054c0b144e") ==
    call.outputs.value0
  ) {
    log.info("FAKE CURIO CARD MINTED - CURIO SNOW", []);
  } else if (
    Address.fromString("0xE0B5E6F32d657e0e18d4B3E801EBC76a5959e123") ==
    call.outputs.value0
  ) {
    log.info("17b IGNORE", []);
    // let cardType = new CardType(call.outputs.value0.toHex());

    // cardType.supply = call.inputs._initialAmount;
    // cardType.address = call.outputs.value0;
    // cardType.symbol = call.inputs._symbol;
    // cardType.description = call.inputs._desc;
    // cardType.name = call.inputs._name.replace("Card", "");
    // cardType.ipfsHash = call.inputs._ipfshash;
    // cardType.save();
  } else {
    let cardType = new CardType(call.outputs.value0.toHex());

    cardType.supply = call.inputs._initialAmount;
    cardType.address = call.outputs.value0;
    cardType.symbol = call.inputs._symbol;
    cardType.description = call.inputs._desc;
    cardType.name = call.inputs._name.replace("Card", "");
    cardType.ipfsHash = call.inputs._ipfshash;
    cardType.save();

    ERC20.create(call.outputs.value0);
  }
}
// ERC1155 Official Events


// export function handleTransferBatch(event: TransferBatch): void {
//   var arrayLength = event.params._ids.length;
//   for (var i = 0; i < arrayLength; i++) {
//     var cardId = event.params._ids[i];
//     var amount = event.params._values[i];

//     if (event.params._operator == OPENSEA_V1) {
//       log.info(
//         "OPENSEA V1 BATCH - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
//         [
//           event.params._operator.toHexString(),
//           event.params._from.toHexString(),
//           event.params._to.toHexString(),
//           event.transaction.hash.toHexString(),
//           amount.toHexString(),
//           cardId.toHexString(),
//         ]
//       );
//     }

//     var cardType = getCardTypeFromID(cardId, ERC1155_ADDRESS);
//     if (cardType != null) {
//       // TRANSFER
//       // GET USER SENDER, GET USER SENDER CARD Balance
//       // GET USER RECEIVER and USER RECEIVER CARD Balance
//       let user_sender = getOrCreateCardHolder(event.params._from);
//       let user_sender_cardBalance = getOrCreateCardBalance(
//         event.params._from,
//         cardType,
//         user_sender
//       );

//       // GET USER RECEIVER and USER RECEIVER CARD Balance
//       let user_recevier = getOrCreateCardHolder(event.params._to);
//       let user_recevier_cardBalance = getOrCreateCardBalance(
//         event.params._to,
//         cardType,
//         user_recevier
//       );

//       // DECREASE SENDER BALANCE WRAPPED AND save
//       user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
//         amount
//       );
//       user_sender_cardBalance.save();
//       user_sender.save();

//       // INCREASE RECEIVER BALANCE WRAPPED AND save
//       user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(
//         amount
//       );
//       user_recevier_cardBalance.save();
//       user_recevier.save();
//       clearEmptyCardBalance(user_sender_cardBalance);
//       log.info(
//         "ERC1155 BATCH TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
//         [
//           event.params._operator.toHexString(),
//           event.params._from.toHexString(),
//           event.params._to.toHexString(),
//           event.transaction.hash.toHexString(),
//           amount.toHexString(),
//           cardId.toHexString(),
//         ]
//       );
//     }
//   }
// }

// export function handleTransferBatchUnofficial(
//   event: TransferBatchUnofficial
// ): void {
//   var arrayLength = event.params._ids.length;
//   for (var i = 0; i < arrayLength; i++) {
//     var cardId = event.params._ids[i];
//     var amount = event.params._values[i];
//     if (cardId == BigInt.fromI32(171)) {
//       log.info(
//         "MISPRINT TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
//         [
//           event.params._operator.toHexString(),
//           event.params._from.toHexString(),
//           event.params._to.toHexString(),
//           event.transaction.hash.toHexString(),
//           amount.toHexString(),
//           cardId.toHexString(),
//         ]
//       );
//     } else {
//       var cardType = getCardTypeFromID(cardId, ERC1155_ADDRESS);
//       if (cardType != null) {
//         if (event.params._operator == OPENSEA_V1) {
//           log.info(
//             "OPENSEA V1 BATCH - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
//             [
//               event.params._operator.toHexString(),
//               event.params._from.toHexString(),
//               event.params._to.toHexString(),
//               event.transaction.hash.toHexString(),
//               amount.toHexString(),
//               cardId.toHexString(),
//             ]
//           );
//         }

//         // TRANSFER
//         // GET USER SENDER, GET USER SENDER CARD Balance
//         // GET USER RECEIVER and USER RECEIVER CARD Balance
//         let user_sender = getOrCreateCardHolder(event.params._from);
//         let user_sender_cardBalance = getOrCreateCardBalance(
//           event.params._from,
//           cardType,
//           user_sender
//         );

//         // GET USER RECEIVER and USER RECEIVER CARD Balance
//         let user_recevier = getOrCreateCardHolder(event.params._to);
//         let user_recevier_cardBalance = getOrCreateCardBalance(
//           event.params._to,
//           cardType,
//           user_recevier
//         );

//         // DECREASE SENDER BALANCE WRAPPED AND save
//         user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
//           amount
//         );
//         user_sender_cardBalance.save();
//         user_sender.save();

//         // INCREASE RECEIVER BALANCE WRAPPED AND save
//         user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(
//           amount
//         );
//         user_recevier_cardBalance.save();
//         user_recevier.save();
//         clearEmptyCardBalance(user_sender_cardBalance);
//         log.info(
//           "ERC1155 UNOFFICAL BATCH TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}",
//           [
//             event.params._operator.toHexString(),
//             event.params._from.toHexString(),
//             event.params._to.toHexString(),
//             event.transaction.hash.toHexString(),
//             amount.toHexString(),
//             cardId.toHexString(),
//           ]
//         );
//       }
//     }
//   }
// }

