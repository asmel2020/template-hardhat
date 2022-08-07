# hardhat openzeppelin defender Example

example of use of the plugin to implement the openzeppeling defender modules through hardhat

## Installation

```
$ npm install
```

or

```
$ yarn install
```

enter environment variables

```JS
TESTNET_RPC_URL=
DEPLOYER_PRIVATE_KEY_TESTNET=
//Openzeppelin Defender Credential admin
API_KEY=
API_SECRET=
```
# Example Of Use
### Example 1
MyToken smart contract deployment and add to openzeppelin admin module

```JS
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
  const option={
    network:networkName ,
    address: address,
    name: contractName,
    abi:AbiJsonString
  }
		
  await OpenzeppelinDefender.AdminClient.addContract(option);
}
```

run the example using the command

```
$ yarn deploy:addContract
```

### Example 2
Add MyToken to module admin and create a proposal

```JS
import { ethers, OpenzeppelinDefender } from "hardhat";

async function main() {

  const contractName = "MyToken";
		
  const {chainId}=await ethers.provider.getNetwork()
		
  const [owner] = await ethers.getSigners();
		
  const Contract = await ethers.getContractFactory(contractName);
		
  const contract = await Contract.deploy();
		
  const { interface: abi, address} = await contract.deployed();
		
  //obtaining the parameters of an event or function through the contract interface
  const params= {
    abiInterface: abi,
    name: "Transfer",
    type: "event",
  };
		
  const {inputs,name} =OpenzeppelinDefender.Utils.getAbiInterfaceParams(params);
		
  //adding a new contract to the admin and creating a proposal
  const option= {
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
		
  await OpenzeppelinDefender.AdminClient.createProposal(option);
}
```

run the example using the command
```
$ yarn deploy:proposal
```

### Example 3
Creation of a relay and use of its address so that it assumes the MINTER_ROLE in the MyNft contract

```JS
import { ethers, OpenzeppelinDefender } from "hardhat";

async function main() {
 
  const contractName = "MyNFT";

  const {chainId}=await ethers.provider.getNetwork()

	//relay creation
  const RelayParams={
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
  const option={
    network:await OpenzeppelinDefender.Utils.fromChainId(chainId),
    address: address,
    name: contractName,
    abi: abi.format(ethers.utils.FormatTypes.json)
  }
		
  await OpenzeppelinDefender.AdminClient.addContract(option);
}
```

run the example using the command
```
$ yarn deploy:relay
```
### Example 4
creating an autoTask

```JS
import {OpenzeppelinDefender} from "hardhat";

async function main() {

  const autoTaskOptions: any = {
    name: "exampleAutoTask",
    encodedZippedCode: await OpenzeppelinDefender.AutoTaskClint.getEncodedZippedCodeFromFolder("./openzeppelinDefender/autoTasks?exampleAutoTask"),
    trigger: {
      type: "webhook",
    },
    paused: false,
  };
  
  await OpenzeppelinDefender.AutoTaskClint.create(autoTaskOptions);
}
```

run the example using the command

```
$ yarn deploy:autoTask
```
### Example 5
Creating a sentinel, to track all Transfer events of the Mytoken smart contract and assigning an autoTaskTrigger via its autoTaskId to the sentinel

```JS
import { ethers, OpenzeppelinDefender } from "hardhat";

async function main() {

  const contractName = "MyToken";

  const { chainId } = await ethers.provider.getNetwork();

  //deployment of the smart contract MyToken
  const Contract = await ethers.getContractFactory(contractName);
		
  const contract = await Contract.deploy();
		
  const { interface: abi, address, provider } = await contract.deployed();

  //getting the eventSignature from the Transfer event		
  const params= {
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
  const addContractOptions= {
    network: networkName,
    address: address,
    name: contractName,
    abi: abiJsonString,
  };
		
  await OpenzeppelinDefender.AdminClient.addContract(addContractOptions);
		
  //creating an autoTask
  const autoTaskOptions= {
    name: "exampleAutoTask",
    encodedZippedCode: await OpenzeppelinDefender.AutoTaskClint.getEncodedZippedCodeFromFolder("./openzeppelinDefender/autoTasks/exampleAutoTask"),
    trigger: {
     type: "webhook",
    },
    paused: false,
  };
		
  const { autotaskId } = await OpenzeppelinDefender.AutoTaskClint.create(autoTaskOptions);
		
  //creating a sentinel and assigning an autoTaskTrigger via its autoTaskId
  const sentinelOptions= {
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

  await OpenzeppelinDefender.SentinelClient.create(sentinelOptions);	
}
```

run the example using the command
```
$ yarn deploy:autoTaskSentinel
```

