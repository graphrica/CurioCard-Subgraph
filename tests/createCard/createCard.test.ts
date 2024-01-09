import {
  clearStore,
  test,
  assert,
  describe,
  beforeEach,
  dataSourceMock,
  
} from "matchstick-as/assembly/index";
import { handleTransfer } from "../../src/erc20-mapping";
import { handleDirectTransfer as handle17bDirectTransfer, handleTransfer as handle17bTransfer } from "../../src/seventeenb-mapping";
import { ERC1155Unofficial_ADDRESS, ERC1155_ADDRESS } from "../../src/constants";
import {
  cardBalanceId,
  cardBalanceId17b,
  cardBalanceId17b2,
  cardBalanceId2,
  createCard,
  createCard17b,
  createNewERC20TransferEvent,
  creatNewERC20TransferCall,
  curioCardAddress1,
  mintCardsToUser,
  mintWrappedCardsToUser,
  randomSender1,
  randomSender2,
  seventeenbCurio,
  seventeenbWrapper,
} from "../helper";
import { afterEach } from "matchstick-as";
import { createCreateCardCall } from "./createCard.test.utils";
import { handleCreateCard } from "../../src/mapping"
import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts";
describe("Create Card", () => {
  test("Create Curio1", () => {
    //Arrange
    var createCardCall = createCreateCardCall(curioCardAddress1, "200", "CURIO1", "Apples by An Artist", "ipfs:://", "CurioCard1");
  
    //Act
    handleCreateCard(createCardCall);

    //Assert
    assert.fieldEquals("CardType", curioCardAddress1.toHexString(),  "name", "Curio1");
    assert.entityCount("CardType", 1);
  })
  test("Ignore CurioSnow", () => {
    var createCardCall = createCreateCardCall(Address.fromString("0x39786ae114cb7bca7ac103cb10aab4054c0b144e"), "200", "SNOW", "SNOW by An Artist", "ipfs:://", "SNOW");
  
    //Act
    handleCreateCard(createCardCall);

    //Assert
    assert.entityCount("CardType", 0);
  })
  test("Ignore 17b", () => {
    var createCardCall = createCreateCardCall(Address.fromString("0xe0b5e6f32d657e0e18d4b3e801ebc76a5959e123"), "200", "17b", "17b", "ipfs:://", "17b");
  
    //Act
    handleCreateCard(createCardCall);

    //Assert
   assert.entityCount("CardType", 0);
  })
  afterEach(() => {
    clearStore();
  })
});

