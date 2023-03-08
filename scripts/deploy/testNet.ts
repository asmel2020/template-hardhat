import { ethers, OpenzeppelinDefender, upgrades, run } from "hardhat";

async function main() {
  const IdealCoinName = "IdealCoin";

  const IdealCoin = await ethers.getContractFactory(IdealCoinName);

  const idealCoin = await IdealCoin.deploy();

  await idealCoin.deployed();

  console.log("token IdealCoins fake", idealCoin.address);

  const BusdFakeName = "BusdFake";

  const BusdFake = await ethers.getContractFactory(BusdFakeName);

  const busdFake = await BusdFake.deploy();

  await busdFake.deployed();

  console.log("token busd fake", busdFake.address);

  const StakingName = "Staking";

  const Staking = await ethers.getContractFactory(StakingName);

  const staking = await upgrades.deployProxy(Staking, [busdFake.address,idealCoin.address], {
    kind: "uups",
  });

  await staking.deployed();

  console.log("'Staking' deployed to:", staking.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
