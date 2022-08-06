/** 
 * 
 *  creation of a relay and use of its address so that it assumes the MINTER_ROLE in the MyNft contract
 * 
 **/

import { ethers, OpenzeppelinDefender } from "hardhat";

async function main() {
 
  const contractName = "MyNFT";

  const {chainId}=await ethers.provider.getNetwork()

  //relay creation
  const RelayParams:any={
    name:'Relay_1',
    network: await OpenzeppelinDefender.Utils.fromChainId(chainId),
    minBalance: BigInt(1e18).toString(),
  };

  const {address:addressRelay}=await OpenzeppelinDefender.RelayClient.create(RelayParams);

  const Contract = await ethers.getContractFactory(contractName);

  //pass its address as a parameter so that it assumes MINTER_ROLE
  const contract = await Contract.deploy(addressRelay);

  const { interface: abi, address} =await contract.deployed();

  //add the contract to the admin
  const option:any={
    network:await OpenzeppelinDefender.Utils.fromChainId(chainId),
    address: address,
    name: contractName,
    abi: abi.format(ethers.utils.FormatTypes.json)
  }

  await OpenzeppelinDefender.AdminClient.addContract(option);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
