import React, { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import stacking from "../util/abi/Stacking";
import { bscTestnet } from "wagmi/chains";
import Address from "../util/contractAddress/Address";
import { Stack } from "react-bootstrap";

export const InvestorInfo = () => {
  const [first, setfirst] = useState<any>();
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
    }
  }, [status]);

  return (
      <>
        <div className="my-3">Investor</div>
        <div>invested Amount : {first?.investedAmount.toString()}</div>
        <div>investment Time Plan : {first?.investmentTimePlan.toString()}</div>
        <div>investment Plan : {first?.investmentPlan.toString()}</div>
        <div>start Investment : {new Date(first?.startInvestment.toNumber()).toUTCString()}</div>
        <div>end Investment : {new Date(first?.endInvestment.toNumber()).toUTCString()}</div>
        <div>referral 1 : {first?.referralLv1.toString()}</div>
        <div>referral 2 : {first?.referralLv2.toString()}</div>
        <div>Withdraw : {first?.isWithdraw ? "si" : "no"}</div>
      </>
  );
};
