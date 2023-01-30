import { Address, log, BigInt } from "@graphprotocol/graph-ts";
import { CreateCardCall } from "../generated/CardFactory/CardFactory";
import { CardType, Global } from "../generated/schema";
import { ERC20 } from "../generated/templates";


export function handleCreateCard(call: CreateCardCall): void {
  let global = Global.load("1");
  if(!global){
    global = new Global("1");
    global.totalCards = BigInt.fromI32(0);
    global.save();
  }

  if(global.totalCards >= BigInt.fromI32(31)) {
    log.info("FAKE CURIO CARD", []);
    return;
  }

  if ( //0x39786ae114cb7bca7ac103cb10aab4054c0b144e
    Address.fromString("0x39786ae114cb7bca7ac103cb10aab4054c0b144e") ==
    call.outputs.value0
  ) {
    log.info("FAKE CURIO CARD MINTED - CURIO SNOW", []);
  } else if (
    Address.fromString("0xe0b5e6f32d657e0e18d4b3e801ebc76a5959e123") ==
    call.outputs.value0
  ) {
    log.info("17b", []);
   
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
    global.totalCards = global.totalCards.plus(BigInt.fromI32(1));
    global.save();
  }
}
// ERC1155 Official Events

