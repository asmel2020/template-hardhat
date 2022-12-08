/** 
 * 
 *  MyToken smart contract deployment and add to openzeppelin admin module
 * 
 **/

import { ethers,OpenzeppelinDefender, upgrades } from "hardhat";

async function main() {

  const contractName='Staking'

  const Staking = await ethers.getContractFactory(contractName);

  const staking = await upgrades.upgradeProxy('0x8B40d615c42e1DbA2782311017FD1e9B4F9771E5', Staking);

  console.log("staking upgraded");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

