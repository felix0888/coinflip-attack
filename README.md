# Coin Flip Attack
Smart Contract Security Practice | Lv3 Coin Flip Attack

```
!!! DON'T TRY ON MAINNET !!!
```

## SUMMARY
This is a coin flipping game where you need to build up your winning streak by guessing the outcome of a coin flip. You'll need to use your psychic abilities to guess the correct outcome 10 times in a row.

#### You will beat this level if
- Guess the correct outcome 10 times in a row to win

#### Things that might help
- Random number generation in Blockchain is not safe.
- How to get the secure random number.

## Smart Contract Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';

contract CoinFlip {

  using SafeMath for uint256;
  uint256 public consecutiveWins;
  uint256 lastHash;
  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  constructor() public {
    consecutiveWins = 0;
  }

  function flip(bool _guess) public returns (bool) {
    uint256 blockValue = uint256(blockhash(block.number.sub(1)));

    if (lastHash == blockValue) {
      revert();
    }

    lastHash = blockValue;
    uint256 coinFlip = blockValue.div(FACTOR);
    bool side = coinFlip == 1 ? true : false;

    if (side == _guess) {
      consecutiveWins++;
      return true;
    } else {
      consecutiveWins = 0;
      return false;
    }
  }
}
```

## RANDOM NUMBER GENERATION
Here, we will see what is the vulnerability of block/time based random number generation and how we can generate secure random number.

#### Problem in the CoinFlip contract
```
uint256 blockValue = uint256(blockhash(block.number.sub(1)));
```
In the above contract, it tries to get the random number by using the previous minted block number. So if you predict the block number you win.
Also you can make a `Attack` contract to make a call `flip` function of the `CoinFlip` contract, then you have the same block number both in `Attack` and `CoinFlip` contract.

#### Usage of `keccak256` hash
Using `keccak256` function has ever believed as the best way to generate a random number, we used to generate random number like this.
```solidity
uint nonce = 0;
uint random = uint(keccak256(abi.encodePacked(now, msg.sender, nonce))) % 100;
randNonce++;
uint random2 = uint(keccak256(abi.encodePacked(now, msg.sender, nonce))) % 100;
...
```
On the above code, we use `now`, `msg.sender` and `nonce`(something like counter to be used only once).
Then they're packed by `abi.encodePacked` function and hashed by using `keccak256` function. The it gets the last 2 digits of the hash by using `%` modular operator.
As a result we get the random number less than 100.

No rush! Is the random number above is really secure?

We know Ethereum is PoW chain(Proof of Work).
On PoW chain, if a transaction(for examply you call a function of `CoinFlip` contract, it's broadcasted to all the nodes on the network and included in a block(pending) which is a bunch of transactions. Then the nodes try to solve the complex mathematical problem. Once `node A` solves such complex mathematical problems, the other nodes stop working to verify that the `node A`'s result is valid. The result is accepted and added as a last block on the blockchain and the nodes try to solve next block.

Now let's take a look the `CoinFlip` contract.
If you're running a node, you can publish a transaction only to your node not to share it. Your node then run the `flip` function to see if I won, if not you can choose not to include the transaction inthe next block. You do the same operation infinitely until you win and solve the next block.

#### How to generate really secure random number?
Now you might get why block-based random number generation is not really safe.
You can continue reading the articles below.
[How can I securely generate a random number in my smart contract?](https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract)
[Predicting Random Numbers in Ethereum Smart Contracts](https://blog.positive.com/predicting-random-numbers-in-ethereum-smart-contracts-e5358c6b8620)

One of the widely used approach is using `oracle` to get a random number from outside the blockchain.

## DEPLOY & TEST
#### Installation
```
npm install
npx hardhat node
```

#### Deployment
```
npx hardhat run --network [NETWORK-NAME] scripts/deploy.js
```

#### Test
```
npx hardhat test
```

You can test fallout on the local hardhat node as well.
