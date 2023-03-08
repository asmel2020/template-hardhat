/** 
 * 
 *  MyToken smart contract deployment and add to openzeppelin admin module
 * 
 **/

import { ethers,run} from "hardhat";

async function main() {

  const contractName='IdealCoin'

  const Contract = await ethers.getContractFactory(contractName);

  const contract = await Contract.deploy();

  console.log('token IdealCoins fake',contract.address);

  setTimeout(async()=>{
    try {
      await run("verify:verify", {
        address: contract.address,
        constructorArguments: []
      });
    } catch (error) {
      console.log("verificacion fallida",contract.address);
    }
  }, 5000);

  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

