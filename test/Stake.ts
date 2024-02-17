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

    it("Should receive and deposit the funds to stake", async function () {
      const { stake, owner } = await loadFixture(deployOneYearLockFixture);

      await stake.deposit({ value: ethers.parseEther("1") });

      const stakerBal = await stake.stakers(owner);
      expect(stakerBal).to.equal(1000000000000000000n);
    });
    z;
  });
});
