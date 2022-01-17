const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoinFlipAttack", function () {
  let CoinFlip, coinFlip, CoinFlipAttack, coinflipAttack;
  let owner, attacker, alice, signers;

  beforeEach(async function() {
    [owner, attacker, alice, signers] = await ethers.getSigners();
    CoinFlip = await ethers.getContractFactory("CoinFlip");
    coinFlip = await CoinFlip.connect(owner).deploy();
    CoinFlipAttack = await ethers.getContractFactory("CoinFlipAttack");
    coinflipAttack = await CoinFlipAttack.connect(attacker).deploy();
  });

  describe("deployment", function() {
    it("should set the attacker", async function() {
      expect(await coinflipAttack.attacker()).to.equal(attacker.address);
    });
  });

  describe("attack", function() {
    it("should fail if non-attacker tries", async function() {
      await expect(
        coinflipAttack.connect(alice).attack(coinFlip.address)
      ).to.be.revertedWith(
        "CoinFlipAttack: NOT_OWNER"
      );
    });

    it("should win 10 times consecutively", async function() {
      for (let i = 0; i < 10; i++) {
        await coinflipAttack.connect(attacker).attack(coinFlip.address);
        expect(await coinflipAttack.success()).to.equal(true);
      }
      expect(await coinFlip.consecutiveWins()).to.equal(10);
    });
  });
});
