import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Neobank,
  AccountCreated,
  Erc20DepositMade,
  EthDepositMade,
  OwnershipTransferred
} from "../generated/Neobank/Neobank"
import { PaymentLinkCreated, PaymentMade } from "../generated/Payments/Payments"
import { FdCreated, RdCreated, FdRedeemd } from "../generated/Investments/Investments"
import { Account, Token, Transaction, Payment, PaymentLink, Fd, Rd } from "../generated/schema"

export function handleAccountCreated(event: AccountCreated): void {
  
  let entity = new Account(event.transaction.hash.toString())
  
  // Entity fields can be set based on event parameters
  entity.owner = event.params._owner
  entity.metadata = event.params._metadata
  entity.accountNumber = event.params._accountNumber

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.getAccountDetails(...)
  // - contract.getContractBalance(...)
  // - contract.getERC20Balance(...)
  // - contract.getERC20BalanceWithInterest(...)
  // - contract.getEthBalance(...)
  // - contract.getEthBalanceWithInterest(...)
  // - contract.getRelaventCToken(...)
  // - contract.getTotalErc20Balance(...)
  // - contract.getTotalEthBalance(...)
  // - contract.myAccounts(...)
  // - contract.owner(...)
}

// export function handleCompoundTokenAdded(event: CompoundTokenAdded): void {

//   let entity = new Token(event.transaction.hash.toString())

//   // Entities only exist after they have been saved to the store;
//   // `null` checks allow to create entities on demand
//   // if (!entity) {
//   //   entity = new Token(event.transaction.hash.toString())
//   // }

//   // Entity fields can be set based on event parameters
//   entity.name = event.params.name
//   entity.decimal = event.params.decimal
//   entity.symbol = event.params.symbol
//   entity.address = event.params.token
//   entity.cToken = event.params.cToken
//   entity.icon = event.params.icon

//   // Entities can be written to the store with `.save()`
//   entity.save()
// }

export function handleErc20DepositMade(event: Erc20DepositMade): void {
  let entity = new Transaction(event.transaction.hash.toString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  // if (!entity) {
  //   entity = new Transaction(event.transaction.hash.toString())
  // }

  entity.currency = 'ERC20';
  entity.token = event.params.currency;
  entity.depositor = event.params._depositor;
  entity.owner = event.params._owner;
  entity.accountNumber = event.params._accountNumber;
  entity.amount = event.params._amount;
  entity.timestamp = event.block.timestamp;
  entity.save();
}

export function handleEthDepositMade(event: EthDepositMade): void {
  let entity = new Transaction(event.transaction.hash.toString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  // if (!entity) {
  //   entity = new Transaction(event.transaction.hash.toString())
  // }

  entity.currency = 'ETH';
  entity.token = event.address;
  entity.depositor = event.params._depositor;
  entity.owner = event.params._owner;
  entity.accountNumber = event.params._accountNumber;
  entity.amount = event.params._amount;
  entity.timestamp = event.block.timestamp;
  entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {

}
export function handlePaymentLinkCreated(event: PaymentLinkCreated): void {
  let entity = new PaymentLink(event.transaction.hash.toString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  // if (!entity) {
  //   entity = new PaymentLink(event.transaction.hash.toString())
  // }

  entity.owner = event.params._owner;
  entity.paymentLinkId = event.params.paymentLinkId;
  entity.url = event.params._url;
  entity.type = event.params._type;
  entity.receiver = event.params.receiver;
  entity.account = event.params.account;
  entity.metadata = event.params.metadata;
  entity.timestamp = event.block.timestamp;

  entity.save();
}

export function handlePaymentMade(event: PaymentMade): void {
  let entity = new Payment(event.transaction.hash.toString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  // if (!entity) {
  //   entity = new Payment(event.transaction.hash.toString())
  // }

  entity.paymentId = event.params.paymentId;
  entity.mode = event.params.mode;
  entity.sender = event.params.sender;
  entity.receiver = event.params.receiver;
  entity.account = event.params.account;
  entity.fee = event.params.fee;
  entity.currency = event.params.currency;
  entity.timestamp = event.params.timestamp;
  
  entity.save();
}

export function handleFdCreated(event: FdCreated): void {
  let entity = Fd.load(event.params.fdId.toString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new Fd(event.params.fdId.toString())
  }

  entity.fdId = event.params.fdId;
  entity.owner = event.params.owner;
  entity.name = event.params.name;
  entity.startDate = event.params.startDate;
  entity.endDate = event.params.endDate;
  entity.amount = event.params.amount;
  entity.redeemedAmount = event.params.redeemedAmount;
  entity.currency = event.params.currency;
  entity.cTokens = event.params.cTokens;
  entity.isActive = event.params.isActive;
  entity.timestamp = event.block.timestamp;
  
  entity.save();
}


export function handleRdCreated(event: RdCreated): void {
  let entity = Rd.load(event.params.rdId.toString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new Rd(event.params.rdId.toString())
  }

  entity.rdId = event.params.rdId;
  entity.owner = event.params.owner;
  entity.name = event.params.name;
  entity.startDate = event.params.startDate;
  entity.endDate = event.params.endDate;
  entity.amount = event.params.amount;
  entity.redeemedAmount = event.params.redeemedAmount;
  entity.frequency = event.params.frequency;
  entity.currency = event.params.currency;
  entity.cTokens = event.params.cTokens;
  entity.isActive = event.params.isActive;
  entity.timestamp = event.block.timestamp;
  
  entity.save();
}

export function handledRedeemed(event: FdRedeemd): void {
  let entity = Fd.load(event.params.fdId.toString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity) {
    // entity = new Fd(event.params.fdId.toString())
    entity.redeemedAmount = event.params.redeemedAmount;
    entity.isActive = !entity.isActive;
    entity.timestamp = event.block.timestamp;
    
    entity.save();
  }

}