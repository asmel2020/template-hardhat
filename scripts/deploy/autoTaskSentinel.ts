/** 
 * 
 *  creating a sentinel, to track all Transfer events of the Mytoken smart contract
 *  and assigning an autoTaskTrigger via its autoTaskId to the sentinel
 * 
 **/

import { ethers, OpenzeppelinDefender } from "hardhat";

async function main() {
  const contractName = "MyToken";

  const { chainId } = await ethers.provider.getNetwork();

  //deployment of the smart contract MyToken
  const Contract = await ethers.getContractFactory(contractName);

  const contract = await Contract.deploy();

  const { interface: abi, address, provider } = await contract.deployed();

  //getting the eventSignature from the Transfer event
  const params: any = {
    abiInterface: abi,
    name: "Transfer",
    type: "event",
  };

  const {signature} =OpenzeppelinDefender.Utils.getAbiInterfaceParams(params);

  //Obtaining the name of the network through the chainId of the network
  const networkName = await OpenzeppelinDefender.Utils.fromChainId(chainId);

  //get the abi in json string using the contract interface
  const abiJsonString=OpenzeppelinDefender.Utils.AbiJsonString(abi);


  //add the contract to the admin
  const addContractOptions: any = {
    network: networkName,
    address: address,
    name: contractName,
    abi: abiJsonString,
  };

  await OpenzeppelinDefender.AdminClient.addContract(addContractOptions);

  //creating an autoTask
  const autoTaskOptions: any = {
    name: "exampleAutoTask",
    encodedZippedCode:
      await OpenzeppelinDefender.AutoTaskClint.getEncodedZippedCodeFromFolder(
        "./openzeppelinDefender/autoTasks/exampleAutoTask"
      ),
    trigger: {
      type: "webhook",
    },
    paused: false,
  };
  

  const { autotaskId } = await OpenzeppelinDefender.AutoTaskClint.create(
    autoTaskOptions
  );


  //creating a sentinel and assigning an autoTaskTrigger via its autoTaskId
  const sentinelOptions: any = {
    type: "BLOCK",
    network: networkName,
    confirmLevel: 12,
    name: "Sentinel",
    addresses: [address],
    abi: abiJsonString,
    paused: false,
    eventConditions: [signature],
    autotaskTrigger: autotaskId,
    notificationChannels: [""],
  };

  const result = await OpenzeppelinDefender.SentinelClient.create(
    sentinelOptions
  );

  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
