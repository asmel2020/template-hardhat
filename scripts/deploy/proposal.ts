/** 
 * 
 *  add MyToken to module admin and create a proposal
 * 
 **/
import { ethers, OpenzeppelinDefender } from "hardhat";

async function main() {
  const contractName = "MyToken";
  
  const {chainId}=await ethers.provider.getNetwork()

  const [owner] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory(contractName);

  const contract = await Contract.deploy();

  const { interface: abi, address} = await contract.deployed();


  //obtaining the parameters of an event or function through the contract interface
  const params: any = {
    abiInterface: abi,
    name: "Transfer",
    type: "event",
  };
  const {inputs,name} =OpenzeppelinDefender.Utils.getAbiInterfaceParams(params);

  //adding a new contract to the admin and creating a proposal
  const option: any = {
    contract: {
      network: await OpenzeppelinDefender.Utils.fromChainId(chainId),
      address: address,
      name:contractName,
      abi: abi.format(ethers.utils.FormatTypes.json)
    },
    title: "Mint token",
    description: "minter 10 new tokens",
    type: "custom", 
    functionInterface: {
      name: name,
      inputs: inputs,
    },
    functionInputs: [owner.address,"100000000000000000000"],
    via: owner.address,
    viaType:'EOA'
  };

  const result =await OpenzeppelinDefender.AdminClient.createProposal(option);

  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
