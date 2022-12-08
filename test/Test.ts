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
describe("Staking", function () {

  async function deploy() {
    const Staking = await ethers.getContractFactory("Staking");
    staking = await upgrades.deployProxy(Staking);
    await staking.deployed();
    [wallet1, wallet2, wallet3, wallet4, vault] = await ethers.getSigners();
    console.log(vault.address);
  }

  async function BusdFake() {
    const BusdFake = await ethers.getContractFactory("BusdFake");
    busdFake = await BusdFake.deploy();
    await busdFake.deployed();
  }

  before(async () => {
    await deploy();
    await BusdFake();
  });

  describe("deploy proxy", function () {
    it("owner", async function () {
      expect(wallet1.address).equal(await staking.owner());
    });
  });

  describe("Math", function () {
    /*it("Calcule Percentage", async function () {
      console.log((await staking.CalculePercentage()).toString()) 
    });*/
  });

  describe("Bounty", function () {
    it("add Benefit Bounty", async function () {
      await staking.addBenefitBounty(
        [wallet2.address, wallet3.address],
        ["1", "2"]
      );
    });

    it("verify add Benefit Bounty", async function () {
      const result = await staking.bountys(wallet2.address);
      expect(wallet2.address).equal(result.benefited);
    });

    it("correct amount", async function () {
      const result = await staking.bountys(wallet2.address);
      expect("150000000000000000000").equal(result.Amount);
    });

    it("correct plan investing time", async function () {
      const result2 = await staking.bountys(wallet2.address);
      const result3 = await staking.bountys(wallet3.address);
      expect("1").equal(result2.TimePlan);
      expect("2").equal(result3.TimePlan);
    });

    it("Is Investors", async function () {
      const result = await staking.IsInvestors(wallet2.address);
      expect(false).equal(result);
    });
  });

  describe("first Investment not referral", function () {
    it("add new investment", async function () {
      await busdFake.approve(staking.address, ethers.utils.parseEther("100"));
      await staking.firstInvestment(
        ethers.utils.parseEther("100"),
        "4",
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("verify add new investment", async function () {
      const result = await staking.investors(wallet1.address);
      expect(wallet1.address).equal(result.investor);
    });

    it("correct plan investing", async function () {
      const result = await staking.investors(wallet1.address);
      expect("1").equal(result.investmentPlan);
    });

    it("correct amount investment", async function () {
      const result = await staking.investors(wallet1.address);
      expect(ethers.utils.parseEther("100")).equal(result.investedAmount);
    });

    it("correct plan investing time", async function () {
      const result = await staking.investors(wallet1.address);
    });

    it("referral", async function () {
      const result = await staking.investors(wallet1.address);
      expect("0x0000000000000000000000000000000000000000").equal(
        result.referralLv1
      );
      expect("0x0000000000000000000000000000000000000000").equal(
        result.referralLv2
      );
    });

    it("Is Investors", async function () {
      const result = await staking.IsInvestors(wallet1.address);
      expect(true).equal(result);
    });
  });

  describe("first Investment referral", function () {
    let newStaking;
    let newBusdFake;
    it("add new investment", async function () {
      newStaking = staking.connect(wallet2);
      newBusdFake = busdFake.connect(wallet2);

     await busdFake.transfer(wallet2.address,ethers.utils.parseEther("250"));

      await newBusdFake.approve(
        staking.address,
        ethers.utils.parseEther("250")
      );
      await newStaking.firstInvestment(
        ethers.utils.parseEther("250"),
        "2",
        wallet1.address
      );
    });

    it("verify add new investment", async function () {
      const result = await staking.investors(wallet2.address);
      expect(wallet2.address).equal(result.investor);
    });

    it("correct plan investing", async function () {
      const result = await staking.investors(wallet2.address);
      expect("2").equal(result.investmentPlan);
    });

    it("correct plan investing time", async function () {
      const result = await staking.investors(wallet2.address);
      expect("2").equal(result.investmentTimePlan);
    });

    it("correct amount investment", async function () {
      const result = await staking.investors(wallet2.address);
      expect(ethers.utils.parseEther("250")).equal(result.investedAmount);
    });

    it("referral", async function () {
      const result = await staking.investors(wallet2.address);
      expect(wallet1.address).equal(result.referralLv1);
      expect("0x0000000000000000000000000000000000000000").equal(
        result.referralLv2
      );
    });

    it("Is Investors", async function () {
      const result = await staking.IsInvestors(wallet2.address);
      expect(true).equal(result);
    });
  });

  describe("first Investment referral lv 2", function () {
    let newStaking;
    let newBusdFake;
    it("add new investment", async function () {
      newStaking = staking.connect(wallet3);
      newBusdFake = busdFake.connect(wallet3);
      await busdFake.transfer(wallet3.address,ethers.utils.parseEther("700"));
      await newBusdFake.approve(
        staking.address,
        ethers.utils.parseEther("700")
      );
      await newStaking.firstInvestment(
        ethers.utils.parseEther("700"),
        "3",
        wallet2.address
      );
    });

    it("verify add new investment", async function () {
      const result = await staking.investors(wallet3.address);
      expect(wallet3.address).equal(result.investor);
    });

    it("correct plan investing", async function () {
      const result = await staking.investors(wallet3.address);
      expect("3").equal(result.investmentPlan);
    });

    it("correct plan investing time", async function () {
      const result = await staking.investors(wallet3.address);
      expect("3").equal(result.investmentTimePlan);
    });

    it("correct amount investment", async function () {
      const result = await staking.investors(wallet3.address);
      expect(ethers.utils.parseEther("700")).equal(result.investedAmount);
    });

    it("referral", async function () {
      const result = await staking.investors(wallet3.address);
      expect(wallet2.address).equal(result.referralLv1);
      expect(wallet1.address).equal(result.referralLv2);
    });

    it("Is Investors", async function () {
      const result = await staking.IsInvestors(wallet3.address);
      expect(true).equal(result);
    });
  });

  describe("token balance end", function () {
    it("balance", async function () {
    const result= await busdFake.balanceOf(vault.address)
    expect(ethers.utils.parseEther("925")).equal(result)
    });
  });
});
