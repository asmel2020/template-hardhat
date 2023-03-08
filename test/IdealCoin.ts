import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, OpenzeppelinDefender, upgrades } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

let staking: Contract;
let busdFake: Contract;
let wallet1: SignerWithAddress;
let wallet2: SignerWithAddress;
let wallet3: SignerWithAddress;
let wallet4: SignerWithAddress;
let vault: SignerWithAddress;
describe("IdealCoin", function () {

  
  async function deploy() {
    const Contract  = await ethers.getContractFactory('IdealCoin');
    const contract = await Contract.deploy();
  }

  describe("deploy", function () {

    it("deploy", async function () {
      await deploy();
    });

  });
});
