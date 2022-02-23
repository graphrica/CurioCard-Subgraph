import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { CreateCardCall } from "../generated/CardFactory/CardFactory";
import { CardType } from "../generated/schema";
import {
  TransferSingle,
  ERC1155,
} from "../generated/ERC1155/ERC1155";
import {
  TransferSingle as TransferSingleUnofficial,
  ERC1155Unofficial
} from "../generated/ERC1155Unofficial/ERC1155Unofficial";
import { ERC20 } from "../generated/templates";
import { getOrCreateCardBalance, getOrCreateCardHolder } from "./erc20-mapping";
export const ADDRESS_ZERO = Address.fromString("0x0000000000000000000000000000000000000000");
export const ERC1155_ADDRESS = Address.fromString("0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313");
export const ERC1155_WRAPPER = Address.fromString("0x53f46bfbecb075b4feb3bce6828b9095e630d371");
export const ERC1155Unofficial_ADDRESS = Address.fromString("0x3c2754c0cdc5499df1a50d608d8985070bf87b30");

// export const curioArray  = [
//   { id: 1, displayName: "Curio1", address: "0x6aa2044c7a0f9e2758edae97247b03a0d7e73d6c" },
//   { id: 2, displayName: "Curio2", address: "0xe9a6a26598b05db855483ff5ecc5f1d0c81140c8" },
//   { id: 3, displayName: "Curio3", address: "0x3f8131b6e62472ceea9cb8aa67d87425248a3702" },
//   { id: 4, displayName: "Curio4", address: "0x4f1694be039e447b729ab11653304232ae143c69" },
//   { id: 5, displayName: "Curio5", address: "0x5a3d4a8575a688b53e8b270b5c1f26fd63065219" },
//   { id: 6, displayName: "Curio6", address: "0x1ca6ac0ce771094f0f8a383d46bf3acc9a5bf27f" },
//   { id: 7, displayName: "Curio7", address: "0x2647bd8777e0c66819d74ab3479372ea690912c3" },
//   { id: 8, displayName: "Curio8", address: "0x2fce2713a561bb019bc5a110be0a19d10581ee9e" },
//   { id: 9, displayName: "Curio9", address: "0xbf4cc966f1e726087c5c55aac374e687000d4d45" },
//   { id: 10, displayName: "Curio10", address: "0x72b34d637c0d14ace58359ef1bf472e4b4c57125" },
//   { id: 11, displayName: "Curio11", address: "0xb36c87f1f1539c5fc6f6e7b1c632e1840c9b66b4" },
//   { id: 12, displayName: "Curio12", address: "0xd15af10a258432e7227367499e785c3532b50271" },
//   { id: 13, displayName: "Curio13", address: "0x2d922712f5e99428c65b44f09ea389373d185bb3" },
//   { id: 14, displayName: "Curio14", address: "0x0565ac44e5119a3224b897de761a46a92aa28ae8" },
//   { id: 15, displayName: "Curio15", address: "0xdb7f262237ad8acca8922aa2c693a34d0d13e8fe" },
//   { id: 16, displayName: "Curio16", address: "0x1b63532ccb1fee0595c7fe2cb35cfd70ddf862cd" },
//   { id: 17, displayName: "Curio17", address: "0xf59536290906f204c3c7918d40c1cc5f99643d0b" },
//   { id: 18, displayName: "Curio18", address: "0xa507d9d28bbca54cbcffad4bb770c2ea0519f4f0" },
//   { id: 19, displayName: "Curio19", address: "0xf26bc97aa8afe176e275cf3b08c363f09de371fa" },
//   { id: 20, displayName: "Curio20", address: "0xd0ec99e99ce22f2487283a087614aee37f6b1283" },
//   { id: 21, displayName: "Curio21", address: "0xb7a5a84ff90e8ef91250fb56c50a7bb92a6306ee" },
//   { id: 22, displayName: "Curio22", address: "0x148ff761d16632da89f3d30ef3dfe34bc50ca765" },
//   { id: 23, displayName: "Curio23", address: "0xcde7185b5c3ed9ea68605a960f6653aa1a5b5c6c" },
//   { id: 24, displayName: "Curio24", address: "0xe67dad99c44547b54367e3e60fc251fc45a145c6" },
//   { id: 25, displayName: "Curio25", address: "0xc7f60c2b1dbdfd511685501edeb05c4194d67018" },
//   { id: 26, displayName: "Curio26", address: "0x1cb5bf4be53eb141b56f7e4bb36345a353b5488c" },
//   { id: 27, displayName: "Curio27", address: "0xfb9f3fa2502d01d43167a0a6e80be03171df407e" },
//   { id: 28, displayName: "Curio28", address: "0x59d190e8a2583c67e62eec8da5ea7f050d8bf27e" },
//   { id: 29, displayName: "Curio29", address: "0xd3540bcd9c2819771f9d765edc189cbd915feabd" },
//   { id: 30, displayName: "Curio30", address: "0x7f5b230dc580d1e67df6ed30dee82684dd113d1f" },
// 17b 0xE0B5E6F32d657e0e18d4B3E801EBC76a5959e123
// ];


export function handleCreateCard(call: CreateCardCall): void {
  
  if(Address.fromString("0x39786ae114cb7bca7ac103cb10aab4054c0b144e") == call.outputs.value0){
    log.info("FAKE CURIO CARD MINTED - CURIO SNOW", [])
   
  }
  else if(Address.fromString("0xE0B5E6F32d657e0e18d4B3E801EBC76a5959e123") == call.outputs.value0){
    log.info("17b IGNORE", [])
   
  }
  else { 
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

export function handleTransferSingle(event: TransferSingle): void {
  
  var cardType = getCardTypeFromID(event.params._id, ERC1155_ADDRESS);
  if (cardType != null) {
    if (event.params._to == ADDRESS_ZERO && event.params._from == ERC1155_ADDRESS) {
      // UNWRAPPED
     
      // GET USER SENDER, USER SENDER Balance
      let user_sender = getOrCreateCardHolder(event.params._operator);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params._operator,
        cardType,
        user_sender
      );

      // DECREASE SENDER WRAPPED BALANCE
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        event.params._value
      );
      // INCREASE SENDER UNWRAPPED BALANCE
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.plus(
        event.params._value
      );
      user_sender_cardBalance.save();
      user_sender.save();
      log.info("ERC1155 UNWRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    } else if (event.params._from == ADDRESS_ZERO && event.params._operator != ERC1155_WRAPPER) {
      // WRAP EVENT
      let user_recevier = getOrCreateCardHolder(event.params._to);
      let user_recevier_cardBalance = getOrCreateCardBalance(event.params._to, cardType, user_recevier);

     
      user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.minus(event.params._value);
      user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(event.params._value);
      user_recevier_cardBalance.save();
      user_recevier.save()
      log.info("ERC1155 WRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    } else {
      // TRANSFER
      // GET USER SENDER, GET USER SENDER CARD Balance
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_sender = getOrCreateCardHolder(event.params._from);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params._from,
        cardType,
        user_sender
      );

      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params._to);
      let user_recevier_cardBalance = getOrCreateCardBalance(
        event.params._to,
        cardType,
        user_recevier
      );

      // DECREASE SENDER BALANCE WRAPPED AND save
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        event.params._value
      );
      user_sender_cardBalance.save();
      user_sender.save();
      // INCREASE RECEIVER BALANCE WRAPPED AND save
      user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(
        event.params._value
      );
      user_recevier_cardBalance.save();
      user_recevier.save();
      log.info("ERC1155 TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    }
  } else {
    throw "CardType does not exist";
  }
}


export function handleTransferSingleUnofficial(event: TransferSingleUnofficial): void {
  if(event.params._id == BigInt.fromI32(171)){
    log.info("MISPRINT TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
  }
  else
  {
    log.info("EVENT UNOFFICIAL - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
  
  
  var cardType = getCardTypeFromID(event.params._id, ERC1155_ADDRESS);
  if (cardType != null) {
    if (event.params._operator == ADDRESS_ZERO) {
      // UNWRAPPED
     
      // GET USER SENDER, USER SENDER Balance
      let user_sender = getOrCreateCardHolder(event.params._to);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params._to,
        cardType,
        user_sender
      );

      // DECREASE SENDER WRAPPED BALANCE
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        event.params._value
      );
      // INCREASE SENDER UNWRAPPED BALANCE
      user_sender_cardBalance.unwrappedBalance = user_sender_cardBalance.unwrappedBalance.plus(
        event.params._value
      );
      user_sender_cardBalance.save();
      user_sender.save();
      log.info("ERC1155 UNWRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    } else if (event.params._from == ADDRESS_ZERO && event.params._operator != ERC1155Unofficial_ADDRESS) {
      // WRAP EVENT
      let user_recevier = getOrCreateCardHolder(event.params._to);
      let user_recevier_cardBalance = getOrCreateCardBalance(event.params._to, cardType, user_recevier);

     
      user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.minus(event.params._value);
      user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(event.params._value);
      user_recevier_cardBalance.save();
      user_recevier.save()
      log.info("ERC1155 WRAP EVENT - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    } else {
      // TRANSFER
      // GET USER SENDER, GET USER SENDER CARD Balance
      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_sender = getOrCreateCardHolder(event.params._from);
      let user_sender_cardBalance = getOrCreateCardBalance(
        event.params._from,
        cardType,
        user_sender
      );

      // GET USER RECEIVER and USER RECEIVER CARD Balance
      let user_recevier = getOrCreateCardHolder(event.params._to);
      let user_recevier_cardBalance = getOrCreateCardBalance(
        event.params._to,
        cardType,
        user_recevier
      );

      // DECREASE SENDER BALANCE WRAPPED AND save
      user_sender_cardBalance.wrappedBalance = user_sender_cardBalance.wrappedBalance.minus(
        event.params._value
      );
      user_sender_cardBalance.save();
      user_sender.save();
      // INCREASE RECEIVER BALANCE WRAPPED AND save
      user_recevier_cardBalance.wrappedBalance = user_recevier_cardBalance.wrappedBalance.plus(
        event.params._value
      );
      user_recevier_cardBalance.save();
      user_recevier.save();
      log.info("ERC1155 TRANSFER - operator: {} from: {} to: {} txhash: {} value: {} id: {}", [ event.params._operator.toHexString() ,event.params._from.toHexString(), event.params._to.toHexString(),event.transaction.hash.toHexString(),event.params._value.toHexString(), event.params._id.toHexString() ])
    }
  } 
  } 
}

export function getCardTypeFromID(id: BigInt, address: Address): CardType | null {
  let contract = ERC1155.bind(address);
  var nftAddress = contract.try_contracts(id);
  if(!nftAddress.reverted)
  {
    var cardType = CardType.load(nftAddress.value.toHex());
    if (cardType != null) return cardType;
    return null;
  }
  return null;
}

