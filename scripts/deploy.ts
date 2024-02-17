import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const stake = await ethers.deployContract("Stake", [unlockTime], {});

  await stake.waitForDeployment();

  console.log(
    `Timestamp ${unlockTime}. Stake Contract deployed to ${stake.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
