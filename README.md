# _nameless-kyc_ - Anonymous and efficient KYC whitelists for large numbers of addresses

## Vincent Chu, Initialized Capital (vince@initialized.com, [@vincentchu](https://twitter.com/vincentchu))

As governments begin to scrutinize ICOs more closely, token issuers have begun to realize the importance of stronger KYC/AML procedures to prevent unknown or unapproved entities from acquiring tokens. The ability to prevent such entities from acquiring tokens is especially acute for security tokens which are explicitly assumed to fall under regulatory oversight. Proposed protocols such as Zeppelin's [Transaction Permission Layer (TPL)](https://tplprotocol.org/) offer a framework for controlling token transactions and modeling regulations in smart contract code.

The ability to restrict token sales and transactions to KYC'ed addresses is typically implemented by publishing a "whitelist" of approved addresses to the chain. However, this approach suffers from two major drawbacks. First, the cost of publishing addresses to the blockchain is quite high; as an example, whitelisting just 7473 addresses cost Bluzelle [9.345 Eth (over $11k at the time)](https://medium.com/@PhABC/off-chain-whitelist-with-on-chain-verification-for-ethereum-smart-contracts-1563ca4b8f11). Second, publishing a whitelist forces all approved participants to be publicly known ahead of time. This is problematic for token holders who wish to spread their holdings over multiple addresses or those who wish to remain anonymous before the token issuance has started. This problem is especially acute for security tokens, where ownership percentages, transfers, or the total number of holders can convey important market information.

To ameliorate both of these problems, we propose **_nameless-kyc_**, a technique for efficiently whitelisting large numbers of addresses using [Bloom filters](https://en.wikipedia.org/wiki/Bloom_filter), reducing cost by over an order of magnitude. Moreover, the use of Bloom filters effectively anonymizes the whitelist, preventing public disclosure of the approved addresses and the exact size of the whitelist.

We include in this code repository a working implementation of a [`TransactionChcker`](https://github.com/TPL-protocol/tpl-contracts/blob/master/contracts/checks/TransactionChecker.sol) on the TPL protocol, restricting on-chain transfers of a hypothetical ERC20 token to a set of whitelisted addresses. Our results demonstrate large cost savings; storing 7500 addresses costs only 0.63 Eth, with a small probability of false positives. We believe _nameless-kyc_ can efficiently whitelist potentially hundreds of thousands or even millions of addresses.

## Technical Details

A Bloom Filter is a probabilistic data structure for modeling sets and checking set membership. Using it to store the whitelist of addresses offers many advantages; as a probabilistic data structure, it is space-efficient, allowing many elements to be tracked with no chance of false negatives and only an adjustably low probability of false positives.

The underlying storage for a Bloom filter is a bit-array of length _`m`_. Each element of the set is hashed _`k`_ times into one of _`m`_ bit positions; "adding" an element means permanently flipping each bit position to 1 (bit positions are never flipped from 1 to 0).

Our sample implementation, [`NamelessKYC`](https://github.com/vincentchu/nameless-kyc/blob/master/truffle/contracts/NamelessKYC.sol), is a smart contract which controls the transfer of a hypothetical ERC20 token called [`TPL`](https://github.com/vincentchu/nameless-kyc/blob/master/truffle/contracts/TPLToken.sol) using the TPL Protocol proposed by Zeppelin. We implement three main methods:

 - `isMember(address addr)`: Checks whether or not an Ethereum address is permitted to transfer tokens.
 - `madd(uint32[] positions)`: Add multiple addresses to the whitelist by manipulating the underlying Bloom filter directly. Member addresses are anonymized.
 - `transferAllowed(address _from, address _to, uint256)`: Enforces the rule that both parties involved in a transfer of tokens must be whitelisted in the TPL.




