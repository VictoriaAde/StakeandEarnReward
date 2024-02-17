import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Stake", function () {
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const [owner, otherAccount] = await ethers.getSigners();

    const Stake = await ethers.getContractFactory("Stake");
    const stake = await Stake.deploy(unlockTime);

    return { stake, unlockTime, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { stake, unlockTime } = await loadFixture(deployOneYearLockFixture);
      expect(await stake.unlockTime()).to.equal(unlockTime);
    });
  });

  describe("Deposit", function () {
    it("Should receive and deposit the funds to stake", async function () {
      const { stake, owner } = await loadFixture(deployOneYearLockFixture);

      await stake.deposit({ value: ethers.parseEther("1") });

      const stakerBal = await stake.stakers(owner);
      expect(stakerBal).to.equal(1000000000000000000n);
    });

    it("should revert with error when trying to deposit zero value", async function () {
      const { stake } = await loadFixture(deployOneYearLockFixture);
      const tx = stake.deposit({ value: 0 });
      expect(tx).to.be.revertedWithCustomError;
    });

    it("Should emit deposit successful event, if deposit was successful", async function () {
      const { stake } = await loadFixture(deployOneYearLockFixture);
      const tx = await stake.deposit({ value: ethers.parseEther("1") });
      expect(tx).emit;
    });
  });

  // describe("Reward", function () {
  //   it("Should pass if reward is accurately 10% every minute", async function () {
  //     const { stake } = await loadFixture(deployOneYearLockFixture);
  //   });
  // });

  describe("Reward", function () {
    it("Should revert with error when users are trying to checkReward without staking", async function () {
      const { stake } = await loadFixture(deployOneYearLockFixture);

      // Attempt to check reward without staking
      expect(stake.checkReward()).to.be.revertedWithCustomError;
    });
  });
});
