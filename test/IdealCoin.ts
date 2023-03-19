import { ethers} from "hardhat";


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
