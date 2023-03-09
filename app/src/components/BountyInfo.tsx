import React, { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import Address from "../util/contractAddress/Address";
import Stacking from "../util/abi/Stacking";
import { bscTestnet } from "wagmi/chains";
import date from 'date-and-time';
import { ethers } from "ethers";
export const BountyInfo = () => {
  const [info, setInfo] = useState<any>();

  const [dateInvesting, setDateInvesting] = useState<any>({
    startInvestment: new Date(),
    endInvestment: new Date(),
  });

  const { address, isDisconnected } = useAccount();

  const { data, status }: any = useContractRead({
    address: Address.staking,
    abi: Stacking,
    functionName: "bountys",
    args: [address],
    chainId: bscTestnet.id,
  } as any);

  useEffect(() => {
    if (status === "success") {
        console.log(data)
        setInfo(data);
      setDateInvesting({
        startInvestment: new Date(data["start"].toNumber() * 1000),
        endInvestment: new Date(data["end"].toNumber() * 1000),
      }); 
    }
  }, [status]);

  return (
    <>
      <div className="my-3">bounty</div>
      <div>Time Plan : {info?.TimePlan.toString()}</div>
      <div>start bounty : {date.format(dateInvesting.startInvestment, 'DD/MM/YYYY HH:mm:ss')}</div>
      <div>end bounty : {date.format(dateInvesting.endInvestment, 'DD/MM/YYYY HH:mm:ss')}</div>
      <div>amount : {ethers.utils.formatEther(info?.amount || '0')}</div>
      <div>referral : {info?.referral}</div>
      <div>Withdraw : {info?.isWithdraw?'si':'no'}</div>
    </>
  );
};
