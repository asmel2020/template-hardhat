/** 
 * 
 *  MyToken smart contract deployment and add to openzeppelin admin module
 * 
 **/

import { ethers,OpenzeppelinDefender } from "hardhat";

async function main() {

  const contractName='MyToken'

  const {chainId}=await ethers.provider.getNetwork()

  const Contract = await ethers.getContractFactory(contractName);

  const contract = await Contract.deploy();

  const {interface:abi,address}=await contract.deployed();

  //get the abi in json string using the contract interface
  const AbiJsonString= OpenzeppelinDefender.Utils.AbiJsonString(abi)

  //Obtaining the name of the network through the chainId of the network
  const networkName = await OpenzeppelinDefender.Utils.fromChainId(chainId);

  //add the contract to the admin
  const option:any={
    network:networkName ,
    address: address,
    name: contractName,
    abi:AbiJsonString
  }
  
  const result=await OpenzeppelinDefender.AdminClient.addContract(option);

  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

