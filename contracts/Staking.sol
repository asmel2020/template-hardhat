// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./IStaking.sol";

contract Staking is
    IStaking,
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    IERC20 public tokenRewars;

    IERC20 public usdt;

    address public vault;

    uint256 public amountBounty;

    mapping(uint256 => uint256) public investmentTimePlan;

    //matris de planes [id del plan de deposito]x[id del plan del tiempo ]
    mapping(uint256 => mapping(uint256 => uint256)) public returnPercentage;
    mapping(uint256 => mapping(uint256 => uint256)) public returnPercentageBounty;

    // bps referral
    mapping(uint256 => uint256) public referralLv1Bps;
    mapping(uint256 => uint256) public referralLv2Bps;

    mapping(address => Investor) public investors;
    mapping(address => Bounty) public bountys;

    mapping(address => bool) public IsInvestors;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _usdt,address _tokenRewars) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        vault = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
        usdt = IERC20(_usdt); //local 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
        tokenRewars= IERC20(_tokenRewars);

        amountBounty= 150;

        // plan time
        investmentTimePlan[1] = 360;
        investmentTimePlan[2] = 540;
        investmentTimePlan[3] = 720;
        investmentTimePlan[4] = 1080;

        //interes bounty
        returnPercentageBounty[1][1] = 100;
        returnPercentageBounty[1][2] = 200;
        returnPercentageBounty[1][3] = 300;
        returnPercentageBounty[1][4] = 400;

        //plan 100BUSD
        returnPercentage[1][1]=150;
        returnPercentage[1][2]=250;
        returnPercentage[1][3]=350;
        returnPercentage[1][4]=450;

        //plan 250BUSD
        returnPercentage[2][1]=200;
        returnPercentage[2][2]=300;
        returnPercentage[2][3]=400;
        returnPercentage[2][4]=500;

        //plan 500BUSD
        returnPercentage[3][1]=250;
        returnPercentage[3][2]=350;
        returnPercentage[3][3]=450;
        returnPercentage[3][4]=550;

        //plan 750BUSD
        returnPercentage[4][1]=300;
        returnPercentage[4][2]=400;
        returnPercentage[4][3]=500;
        returnPercentage[4][4]=600;

        //plan 1000BUSD
        returnPercentage[5][1]=350;
        returnPercentage[5][2]=450;
        returnPercentage[5][3]=550;
        returnPercentage[5][4]=650;

        //plan 1250BUSD
        returnPercentage[6][1]=400;
        returnPercentage[6][2]=500;
        returnPercentage[6][3]=600;
        returnPercentage[6][4]=700;

        //plan 1500BUSD
        returnPercentage[7][1]=460;
        returnPercentage[7][2]=560;
        returnPercentage[7][3]=660;
        returnPercentage[7][4]=760;

        //referral bps lv 1
        referralLv1Bps[1] = 500;
        referralLv1Bps[2] = 800;
        referralLv1Bps[3] = 1000;
        referralLv1Bps[4] = 1200;
        referralLv1Bps[5] = 1300;
        referralLv1Bps[6] = 1400;
        referralLv1Bps[7] = 1500;

        //referral bps lv 2
        referralLv2Bps[1] = 250;
        referralLv2Bps[2] = 400;
        referralLv2Bps[3] = 500;
        referralLv2Bps[4] = 600;
        referralLv2Bps[5] = 650;
        referralLv2Bps[6] = 700;
        referralLv2Bps[7] = 750;
    }

    function firstInvestment(
        uint256 _investedAmount,
        uint256 _investmentTimePlan,
        address _codeReferral
    ) external {
        require(
            investors[msg.sender].investor == address(0),
            "User already exists"
        );

        require(msg.sender != _codeReferral, "you cannot be your own referral");

        require(
            _investedAmount >= (100 * 1 ether),
            "the minimum amount deposited cannot be less than 100 BUSD"
        );

        require(
            usdt.allowance(msg.sender, address(this)) >= _investedAmount,
            "error allowance"
        );

        require(
            investmentTimePlan[_investmentTimePlan] > 0,
            "time plan not allowed"
        );

        (
            address referralLv1,
            address referralLv2,
            bool isBounty
        ) = getReferrals(_codeReferral);

        uint256 investmentPlan = getInvestmentPlan(_investedAmount);

        investors[msg.sender] = Investor({
            investor: msg.sender,
            investmentTimePlan: _investmentTimePlan,
            investmentPlan: investmentPlan,
            startInvestment: block.timestamp,
            endInvestment: block.timestamp +
                (investmentTimePlan[_investmentTimePlan] * 1 days),
            investedAmount: _investedAmount,
            referralLv1: referralLv1,
            referralLv2: referralLv2,
            isWithdraw : false
        });

        IsInvestors[msg.sender] = true;

        uint256 amountTransferLv1;
        uint256 amountTransferLv2;
        uint256 amountTransferVault;

        if (isBounty) {
            amountTransferLv1 = referralLv1 != address(0)
                ? CalculePercentage(
                    _investedAmount,
                    referralLv1Bps[investmentPlan]
                )
                : 0;

            amountTransferLv2 = referralLv2 != address(0)
                ? CalculePercentage(
                    _investedAmount,
                    referralLv2Bps[investmentPlan]
                )
                : 0;

            amountTransferVault =
                (_investedAmount - amountTransferLv1) -
                amountTransferLv2;

            if (amountTransferLv1 > 0) {
                _transferToken(amountTransferLv1, referralLv1);
            }

            if (amountTransferLv2 > 0) {
                _transferToken(amountTransferLv2, referralLv2);
            }

            _transferToken(amountTransferVault, vault);
        } else {
            amountTransferLv1 = referralLv1 != address(0)
                ? CalculePercentage(_investedAmount, 500)
                : 0;

            amountTransferVault = _investedAmount - amountTransferLv1;

            if (amountTransferLv1 > 0) {
                _transferToken(amountTransferLv1, referralLv1);
            }

            _transferToken(amountTransferVault, vault);
        }
    }

    function reinvestment(uint256 _investedAmount) external {
        Investor storage investor = investors[msg.sender];

        require(
            _investedAmount >= 1 ether,
            "the minimum amount deposited cannot be less than 1 BUSD"
        );

        require(
            usdt.allowance(msg.sender, address(this)) >= _investedAmount,
            "error allowance"
        );

        require(investor.investor != address(0), "usuario no existe ");

        uint256 newInvestedAmount = _investedAmount + investor.investedAmount;
        investor.investmentPlan = getInvestmentPlan(newInvestedAmount);
        investor.investedAmount = newInvestedAmount;

        uint256 amountTransferLv1 = investor.referralLv1 != address(0)
            ? CalculePercentage(
                _investedAmount,
                referralLv1Bps[investor.investmentPlan]
            )
            : 0;

        uint256 amountTransferLv2 = investor.referralLv2 != address(0)
            ? CalculePercentage(
                _investedAmount,
                referralLv2Bps[investor.investmentPlan]
            )
            : 0;

        if (amountTransferLv1 > 0) {
            _transferToken(amountTransferLv1, investor.referralLv1);
        }

        if (amountTransferLv2 > 0) {
            _transferToken(amountTransferLv2, investor.referralLv2);
        }

        uint256 amountTransferVault = (_investedAmount - amountTransferLv1) - amountTransferLv2;

        _transferToken(amountTransferVault, vault);
    }

    function addBenefitBounty(
        address[] calldata _benefited,
        uint256[] calldata _timePlan
    ) external onlyOwner {
        uint256 leng = _benefited.length;

        require(leng == _timePlan.length, "have to be the same");

        for (uint256 i = 0; i < leng; ) {
            bountys[_benefited[i]] = Bounty({
                benefited: _benefited[i],
                TimePlan: _timePlan[i],
                start: block.timestamp,
                end: block.timestamp +
                    (investmentTimePlan[_timePlan[i]] * 1 days),
                amount: amountBounty * 1 ether,
                referral: address(0),
                isWithdraw : false
            });
            unchecked {
                ++i;
            }
        }
    }

    function withdrawReward(uint _rewardId) external {

        require(_rewardId == 1 || _rewardId == 2 ,"id not available");

        if(_rewardId== 1){
            _withdrawRewardInvestment();
        }

        if(_rewardId== 2){
            _withdrawRewardBounty();
        }

    }

    function _withdrawRewardInvestment() internal {
        Investor storage investor = investors[msg.sender];

        require(block.timestamp >= investor.endInvestment,"You have not yet completed the cycle to withdraw your reward");

        require(!investor.isWithdraw,"you already withdrew your reward");

        (uint amountBUSD , uint amountRewars) = compoundInvestor(msg.sender);
        
        investor.investedAmount = 0;

        investor.isWithdraw = true;

        usdt.transfer( msg.sender, amountBUSD);

        tokenRewars.transfer(msg.sender, amountRewars);
    }

    function _withdrawRewardBounty() internal {

        Bounty storage bounty = bountys[msg.sender];

        require(block.timestamp >= bounty.end,"You have not yet completed the cycle to withdraw your reward");

        require(!bounty.isWithdraw,"you already withdrew your reward");
       
        (,uint amountBountyRewars) = compoundBounty(msg.sender);

        bounty.amount=0;

        bounty.isWithdraw=true;

        tokenRewars.transfer(msg.sender, amountBountyRewars);
    }

    function getInvestmentPlan(uint256 _amount)
        internal
        pure
        returns (uint256)
    {
        if (_amount >= (1500 * 1 ether)) {
            return 7;
        }

        if (_amount >= (1250 * 1 ether)) {
            return 6;
        }

        if (_amount >= (1000 * 1 ether)) {
            return 5;
        }

        if (_amount >= (750 * 1 ether)) {
            return 4;
        }

        if (_amount >= (500 * 1 ether)) {
            return 3;
        }

        if (_amount >= (250 * 1 ether)) {
            return 2;
        }

        if (_amount >= (100 * 1 ether)) {
            return 1;
        }

        return 0;
    }

    function getReferrals(address _codeReferral)
        internal
        view
        returns (
            address,
            address,
            bool
        )
    {
        if (IsInvestors[_codeReferral]) {
            return (
                investors[_codeReferral].investor,
                investors[_codeReferral].referralLv1,
                true
            );
        } else {
            return (bountys[_codeReferral].benefited, address(0), false);
        }
    }

    function _transferToken(uint256 amount, address to) internal {
        usdt.transferFrom(msg.sender, to, amount);
    }

    function withdrawToken(address token,uint256 amount, address to) public onlyOwner {
        IERC20(token).transfer(to, amount);
    }

    function CalculePercentage(uint256 _amount, uint256 _bps)
        internal
        pure
        returns (uint256)
    {
        return (_amount * _bps) / 10_000;
    }

    function CicleCount(uint day,uint start) internal view returns(uint){

        uint  cicle  = 30 * 1 days;

        uint totalCicle =  (day *  1 days) / cicle;

        uint timeElapsed =  block.timestamp - start;

        uint elapsedCycle =  timeElapsed / cicle;

        if(elapsedCycle <= totalCicle ){
            return elapsedCycle;
        }
  
        return totalCicle;
    }

    function compoundInvestor(address _investor) view public returns(uint,uint) {
        
        Investor memory investor = investors[_investor];

        uint cicle = CicleCount(investmentTimePlan[investor.investmentTimePlan],investor.startInvestment);

        uint amount=investor.investedAmount;

        uint bps = returnPercentage[investor.investmentPlan][investor.investmentTimePlan];

        for (uint i = 0; i < cicle; ) {
            amount += CalculePercentage(amount,bps);
            unchecked {
                ++i;
            }
        }

        return (amount , amount - investor.investedAmount);
    }

    function compoundBounty(address _investor) view public returns(uint,uint) {
        
        Bounty memory bounty = bountys[_investor];

        uint cicle = CicleCount(investmentTimePlan[bounty.TimePlan],bounty.start);

        uint amount=bounty.amount;

        uint bps = returnPercentageBounty[1][bounty.TimePlan];

        for (uint i = 0; i < cicle; ) {
            amount += CalculePercentage(amount,bps);
            unchecked {
                ++i;
            }
        }

         return (amount , amount - bounty.amount);
    }
   
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
