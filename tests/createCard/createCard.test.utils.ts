import { Address, ethereum } from "@graphprotocol/graph-ts";
import { newMockCall } from "matchstick-as";
import { CreateCardCall } from "../../generated/CardFactory/CardFactory";
import { CARD_FACTORY } from "../../src/constants";
import { curioCardAddress1, randomSender1 } from "../helper";
import { BigInt } from "@graphprotocol/graph-ts";

export function createCreateCardCall(curioCardAddress: Address, initialAmount: string, symbol: string, desc: string, ipfsHash: string, name: string) : CreateCardCall {
    var mockCall = newMockCall();
    var intiialAmountBigInt = BigInt.fromString(initialAmount);
    var initialAmountParam = new ethereum.EventParam("_initialAmount", ethereum.Value.fromSignedBigInt(intiialAmountBigInt));
    var nameParam = new ethereum.EventParam("_name", ethereum.Value.fromString(name));
    var symbolParam = new ethereum.EventParam("_symbol", ethereum.Value.fromString(symbol));
    var descParam = new ethereum.EventParam("_desc", ethereum.Value.fromString(desc));
    var ipfsHashParam = new ethereum.EventParam("_ipfshash", ethereum.Value.fromString(ipfsHash));
    var value0 = new ethereum.EventParam("value0", ethereum.Value.fromAddress(curioCardAddress));
    var createCardCall = new CreateCardCall(
        CARD_FACTORY,
        randomSender1,
        mockCall.block,
        mockCall.transaction,
        [initialAmountParam, nameParam, symbolParam, descParam, ipfsHashParam],
        [value0]
    )
    return createCardCall;
}