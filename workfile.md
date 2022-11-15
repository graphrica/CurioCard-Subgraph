# 17b ERC1155 Wrapper

Contract Address - 0x04afa589e2b933f9463c5639f412b183ec062505

Start Block -  15826329

### Wrap - Emits transfer on ERC20 event.transaction.to 17bWrapper, Emits TransferSingle on Wrapper

### Unwrap - Emits call handlerr transfer on ERC20 call.transaction.from 17bWrapper, Emits TransferSingle on Wrapper

# Notes

When contract is setup
// mint 0 just to let explorers know it exists
// emit TransferSingle(msg.sender, address(0), msg.sender, _id, 0);

1. Ignore 0 sends, self sends

# Events

## Erc20 17b 
### Transfer
1. If event.transaction.to == 17b Wrapper, Ignore
2. Otherwise accounted for.

### CallHandler Transfer
1. If call.transaction.to == 17b Wrapper, Ignore

## Wrapper 17b 
### TransferSingle

1. If from == 0x address, it is a wrap. If wrap, removed value from unwrapped and add to wrappedOfficial on CardBalance for the event.params._to.
2. If to == 0x address, it is a unwrap. If unwrap, removed value from wrappedOfficial and add to unwrapped on CardBalance for the event.params._from.


### CallHandlers

Not Needed (Hopefully!)



