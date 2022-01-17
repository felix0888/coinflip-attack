const { expect } = require("chai");
const { ethers } = require("hardhat");

const { advanceBlock, advanceBlockTo, advanceBlockBy} = require("./utils")

describe("CoinFlip", function () {
  let CoinFlip, coinFlip;

  beforeEach(async function() {
    CoinFlip = await ethers.getContractFactory("CoinFlip");
    coinFlip = await CoinFlip.deploy();
  });

  describe("constructor", function() {
    it("should reset consecutiveWins", async function() {
      expect(await coinFlip.consecutiveWins()).to.eq(0);
    });
  });

  describe("#flip", function() {
    /**unable to test the flip function
     * you can try flip function call several times with the same block number by using advanceBlockTo
     * and you get blockhash(block.number - 1)) is different for each call
     * it means the side value is not the same for each flip
     */
  });
});
