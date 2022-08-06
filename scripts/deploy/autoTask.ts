/** 
 * 
 *  creating an autoTask
 * 
 **/

import {OpenzeppelinDefender} from "hardhat";

async function main() {

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
  
  const autotask  = await OpenzeppelinDefender.AutoTaskClint.create(autoTaskOptions);

  console.log(autotask)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});