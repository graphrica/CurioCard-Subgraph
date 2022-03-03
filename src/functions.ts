import { Address, BigInt, store } from "@graphprotocol/graph-ts";
import { ERC1155 } from "../generated/ERC1155/ERC1155";
import { CardBalance, CardHolder, CardType } from "../generated/schema";

// ERC1155 mapping
export function clearEmptyCardBalance(cardBalance: CardBalance): void {
  if (
    cardBalance.unwrappedBalance == BigInt.zero() &&
    cardBalance.wrappedBalance == BigInt.zero()
  ) {
    store.remove("CardBalance", cardBalance.id);
  }
}

export function getCardTypeFromID(
  id: BigInt,
  address: Address
): CardType | null {
  let contract = ERC1155.bind(address);
  var nftAddress = contract.try_contracts(id);
  if (!nftAddress.reverted) {
    var cardType = CardType.load(nftAddress.value.toHex());
    if (cardType != null) return cardType;
    return null;
  }
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
  cardHolder: CardHolder
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
    cardBalance.save();
  }
  return cardBalance;
}
