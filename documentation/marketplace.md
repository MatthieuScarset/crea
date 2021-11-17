# Marketplace

Brief contract

- import UniversalPricing

- Brief struct

  - title
  - type
  - ...what else ???

- createBrief(string memory hash) => emit event
- answerBrief(string memory hash) => emit event
- answers(hash) ownerOnly
- answers(hash, hash) = CREATOR only

Brief dapp

- push brief as JSON to IPFS
- upload file to IPFS
- get resulting hash
- fed to the smart contract as a string for on-chain storage and aggregation
