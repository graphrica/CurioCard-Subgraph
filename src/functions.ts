import { Address, BigInt, store } from "@graphprotocol/graph-ts";
import { ERC1155 as ERC1155Official} from "../generated/ERC1155/ERC1155";
import { CardBalance, CardHolder, CardType } from "../generated/schema";
import { ADDRESS_ZERO } from "./constants";

// ERC1155 mapping
export function clearEmptyCardBalance(cardBalance: CardBalance): void {
  if (
    cardBalance.unwrappedBalance == BigInt.zero() &&
    cardBalance.wrappedBalance == BigInt.zero()
  ) {
    store.remove("CardBalance", cardBalance.id);
  }
}
// let curioArray = new Map<string, number>();

export function checkIfSentToSelf(to: Address, from: Address, operator: Address) : boolean {
  if(to == from && operator == to) {
    return true
  }
  return false;
}

export function getCardTypeFromID(
  id: BigInt
): CardType | null {
  let address = ADDRESS_ZERO;
  if(id == BigInt.fromString("1")){
    address = Address.fromString("0x6aa2044c7a0f9e2758edae97247b03a0d7e73d6c");
  } else if(id == BigInt.fromString("2")){
    address = Address.fromString("0xe9a6a26598b05db855483ff5ecc5f1d0c81140c8");
  } else if(id == BigInt.fromString("3")){
    address = Address.fromString("0x3f8131b6e62472ceea9cb8aa67d87425248a3702");
  } else if(id == BigInt.fromString("4")){
    address = Address.fromString("0x4f1694be039e447b729ab11653304232ae143c69");
  } else if(id == BigInt.fromString("5")){
    address = Address.fromString("0x5a3d4a8575a688b53e8b270b5c1f26fd63065219");
  } else if(id == BigInt.fromString("6")){
    address = Address.fromString("0x1ca6ac0ce771094f0f8a383d46bf3acc9a5bf27f");
  } else if(id == BigInt.fromString("7")){
    address = Address.fromString("0x2647bd8777e0c66819d74ab3479372ea690912c3");
  } else if(id == BigInt.fromString("8")){
    address = Address.fromString("0x2fce2713a561bb019bc5a110be0a19d10581ee9e");
  } else if(id == BigInt.fromString("9")){
    address = Address.fromString("0xbf4cc966f1e726087c5c55aac374e687000d4d45");
  } else if(id == BigInt.fromString("10")){
    address = Address.fromString("0x72b34d637c0d14ace58359ef1bf472e4b4c57125");
  } else if(id == BigInt.fromString("11")){
    address = Address.fromString("0xb36c87f1f1539c5fc6f6e7b1c632e1840c9b66b4");
  } else if(id == BigInt.fromString("12")){
    address = Address.fromString("0xd15af10a258432e7227367499e785c3532b50271");
  } else if(id == BigInt.fromString("13")){
    address = Address.fromString("0x2d922712f5e99428c65b44f09ea389373d185bb3");
  } else if(id == BigInt.fromString("14")){
    address = Address.fromString("0x0565ac44e5119a3224b897de761a46a92aa28ae8");
  } else if(id == BigInt.fromString("15")){
    address = Address.fromString("0xdb7f262237ad8acca8922aa2c693a34d0d13e8fe");
  } else if(id == BigInt.fromString("16")){
    address = Address.fromString("0x1b63532ccb1fee0595c7fe2cb35cfd70ddf862cd");
  } else if(id == BigInt.fromString("17")){
    address = Address.fromString("0xf59536290906f204c3c7918d40c1cc5f99643d0b");
  } else if(id == BigInt.fromString("18")){
    address = Address.fromString("0xa507d9d28bbca54cbcffad4bb770c2ea0519f4f0");
  } else if(id == BigInt.fromString("19")){
    address = Address.fromString("0xf26bc97aa8afe176e275cf3b08c363f09de371fa");
  } else if(id == BigInt.fromString("20")){
    address = Address.fromString("0xd0ec99e99ce22f2487283a087614aee37f6b1283");
  } else if(id == BigInt.fromString("21")){
    address = Address.fromString("0xb7a5a84ff90e8ef91250fb56c50a7bb92a6306ee");
  } else if(id == BigInt.fromString("22")){
    address = Address.fromString("0x148ff761d16632da89f3d30ef3dfe34bc50ca765");
  } else if(id == BigInt.fromString("23")){
    address = Address.fromString("0xcde7185b5c3ed9ea68605a960f6653aa1a5b5c6c");
  } else if(id == BigInt.fromString("24")){
    address = Address.fromString("0xe67dad99c44547b54367e3e60fc251fc45a145c6");
  } else if(id == BigInt.fromString("25")){
    address = Address.fromString("0xc7f60c2b1dbdfd511685501edeb05c4194d67018");
  } else if(id == BigInt.fromString("26")){
    address = Address.fromString("0x1cb5bf4be53eb141b56f7e4bb36345a353b5488c");
  } else if(id == BigInt.fromString("27")){
    address = Address.fromString("0xfb9f3fa2502d01d43167a0a6e80be03171df407e");
  } else if(id == BigInt.fromString("28")){
    address = Address.fromString("0x59d190e8a2583c67e62eec8da5ea7f050d8bf27e");
  } else if(id == BigInt.fromString("29")){
    address = Address.fromString("0xd3540bcd9c2819771f9d765edc189cbd915feabd");
  } else if(id == BigInt.fromString("30")){
    address = Address.fromString("0x7f5b230dc580d1e67df6ed30dee82684dd113d1f");
  } else if(id == BigInt.fromString("171")){
    address = Address.fromString("0xe0b5e6f32d657e0e18d4b3e801ebc76a5959e123");
  }

  if(address == ADDRESS_ZERO)
    return null;
  
  var cardType = CardType.load(address.toHex());
  if (cardType != null) return cardType;
  return null;
}

// ERC20 mapping
export function getOrCreateCardHolder(address: Address): CardHolder {
  let user = CardHolder.load(address.toHex());
  if (user == null) {
    user = new CardHolder(address.toHex());
  }
  return user;
}

export function getOrCreateCardBalance(
  address: Address,
  cardType: CardType,
  cardHolder: CardHolder,
  blockNumber: BigInt
): CardBalance {
  let cardBalanceID =
    cardType.address.toHexString() + "-" + address.toHexString();
  let cardBalance = CardBalance.load(cardBalanceID);
  if (cardBalance == null) {
    cardBalance = new CardBalance(cardBalanceID);
    cardBalance.type = cardType.id;
    cardBalance.unwrappedBalance = BigInt.fromI32(0);
    cardBalance.wrappedBalance = BigInt.fromI32(0);
    cardBalance.user = cardHolder.id;
    cardBalance.blockNumber = blockNumber;
    cardBalance.save();
  }
  cardBalance.blockNumber = blockNumber;
  return cardBalance;
}
