/** 
 * 
 *  MyToken smart contract deployment and add to openzeppelin admin module
 * 
 **/

import { ethers,OpenzeppelinDefender } from "hardhat";

async function main() {

  const contractName='BusdFake'

  const Contract = await ethers.getContractFactory(contractName);

  const contract = await Contract.deploy();

  console.log('token busd fake',contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

