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

