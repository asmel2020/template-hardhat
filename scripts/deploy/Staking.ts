/** 
 * 
 *  MyToken smart contract deployment and add to openzeppelin admin module
 * 
 **/

import { ethers,OpenzeppelinDefender, upgrades,run } from "hardhat";

async function main() {

  const contractName='Staking'

  const Staking = await ethers.getContractFactory(contractName);

  const staking = await upgrades.deployProxy(Staking,[],{ kind: "uups"});

  await staking.deployed();

  try {
    await run("verify:verify", {
      address: staking.address,
    });
  } catch (error) {
    console.log("verificacion fallida",staking.address);
  }
  
  console.log("'Staking' deployed to:",staking.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

