import { clearStore, test, assert, newMockEvent } from "matchstick-as/assembly/index";
import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts";
import { handleTransfer } from "../src/erc20-mapping";
import { ERC20, Transfer } from "../generated/templates/ERC20/ERC20";
import { CardType } from "../generated/schema";
import { ERC20 as ERC20Entity } from "../generated/templates";
import { ERC1155_ADDRESS } from "../src/constants";
import { getOrCreateCardBalance, getOrCreateCardHolder } from "../src/functions";


const curioCardAddress1 = Address.fromString("0x6aa2044c7a0f9e2758edae97247b03a0d7e73d6c")
const randomSender1 = Address.fromString("0x734bb23e9eafe199d808b4d3cc4fadd66799da2c")
const randomSender2 = Address.fromString("0x267e959769dfe608a578f1de63eabd18e187d8b7")
const logIndex = BigInt.fromString("1")
const txLogIndex = BigInt.fromString("1")
const cardBalanceId = (curioCardAddress1.toHexString() + "-" + randomSender1.toHexString())

export function createNewERC20TransferEvent(from: Address, to: Address, value: string) : Transfer {
    let mockEvent = newMockEvent();
    let fromParam = new ethereum.EventParam("from", ethereum.Value.fromAddress(from));
    let toParam = new ethereum.EventParam("to", ethereum.Value.fromAddress(to));
    
    let valueParam = new ethereum.EventParam("value",ethereum.Value.fromString(value));

    // Initialise event (this can be generalised into a separate function)
    let transferEvent = new Transfer(curioCardAddress1,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        [fromParam, toParam, valueParam]);

    return transferEvent
}

function mintCardsToUser(to: Address, amount: BigInt) : void {
    let cardType = new CardType(curioCardAddress1.toHex());

    cardType.supply = BigInt.fromString("1200");
    cardType.address = curioCardAddress1;
    cardType.symbol = "CURIO1";
    cardType.description = "CurioCard1";
    cardType.name = "Curio1";
    cardType.ipfsHash = "SomeHash";
    cardType.save();

    ERC20Entity.create(curioCardAddress1);

        let user_recevier = getOrCreateCardHolder(to);
        let user_recevier_cardBalance = getOrCreateCardBalance(to, cardType, user_recevier);
    
        user_recevier_cardBalance.unwrappedBalance = user_recevier_cardBalance.unwrappedBalance.plus(amount);
        user_recevier_cardBalance.save()
        user_recevier.save();
    
}




export function runTests(): void {
    test("Wrap Event", () => {

        mintCardsToUser(randomSender1, BigInt.fromString("2"))

        var transfer = createNewERC20TransferEvent(ERC1155_ADDRESS, randomSender1, "2")

        // Call mappings
        handleTransfer(transfer);

        // Assert the state of the store
        assert.fieldEquals("CardBalance", cardBalanceId, "wrappedBalance", "2");
        assert.fieldEquals("CardBalance", cardBalanceId, "unwrappedBalance", "0");

        // Clear the store before the next test (optional)
        clearStore();
    });
}
   

