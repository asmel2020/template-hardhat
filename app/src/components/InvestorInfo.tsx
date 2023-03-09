import React, { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import stacking from "../util/abi/Stacking";
import { bscTestnet } from "wagmi/chains";
import Address from "../util/contractAddress/Address";
import date from 'date-and-time';
import { ethers } from 'ethers';

export const InvestorInfo = () => {
  const [first, setfirst] = useState<any>();

  const [dateInvesting, setDateInvesting] = useState<any>({
    startInvestment:new Date(),
    endInvestment:new Date()
  });
  
  const { address, isDisconnected } = useAccount();

  const { data, status }: any = useContractRead({
    address: Address.staking,
    abi: stacking,
    functionName: "investors",
    args: [address],
    chainId: bscTestnet.id,
  } as any);

  useEffect(() => {
    if (status === "success") {
      
      setfirst(data);
      setDateInvesting({
        startInvestment:new Date(data['startInvestment'].toNumber()*1000),
        endInvestment:new Date(data['endInvestment'].toNumber()*1000)
      })
    }
  }, [status]);

  return (
      <>
        <div className="my-3">Investor</div>
        <div>invested Amount : {ethers.utils.formatEther(first?.investedAmount.toString() || '0')}</div>
        <div>investment Time Plan : {first?.investmentTimePlan.toString()}</div>
        <div>investment Plan : {first?.investmentPlan.toString()}</div>
        <div>start Investment : {date.format(dateInvesting.startInvestment, 'YYYY/MM/DD HH:mm:ss')}</div>
        <div>end Investment : {date.format(dateInvesting.endInvestment, 'YYYY/MM/DD HH:mm:ss')}</div>
        {/* <div>start Investment : {date.format(new Date(first?.startInvestment.toString() || 0), 'YYYY/MM/DD HH:mm:ss')}</div>
        <div>end Investment : {new Date(first?.endInvestment.toNumber()).toUTCString()}</div> */}
        <div>referral 1 : {first?.referralLv1.toString()}</div>
        <div>referral 2 : {first?.referralLv2.toString()}</div>
        <div>Withdraw : {first?.isWithdraw ? "si" : "no"}</div>
      </>
  );
};
