// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
interface IStaking {
    struct Investor {
        address investor;
        uint256 investmentTimePlan;
        uint256 investmentPlan;
        uint256 startInvestment;
        uint256 endInvestment;
        uint256 investedAmount;
        address referralLv1;
        address referralLv2;
        bool isWithdraw;
    }

    struct Bounty {
        address benefited;
        uint256 TimePlan;
        uint256 start;
        uint256 end;
        uint256 amount;
        address referral;
        bool isWithdraw;
    }

}