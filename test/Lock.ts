import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers,OpenzeppelinDefender } from "hardhat";

describe("Lock", function () {
  async function deployOneYearLockFixture() {
    const MyToken= await ethers.getContractFactory('MyToken');
    
    const myToken = await MyToken.deploy();

    return myToken
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const myToken = await loadFixture(deployOneYearLockFixture);

      myToken.interface
      const params:any= {
        abiInterface: myToken.interface,
        name: "Transfer",
        type: "event",
      };
          
      const result = OpenzeppelinDefender.Utils.getAbiInterfaceParams(params);

      console.log(result)
    });

   
  });

});
