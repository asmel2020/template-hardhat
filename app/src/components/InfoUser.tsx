import React, { useEffect, useState } from "react";
import { useAccount, useContract, useContractRead } from "wagmi";
import erc20 from "../util/abi/ERC20";
import Address from "../util/contractAddress/Address";
import { bscTestnet } from "wagmi/chains";
import { IdealCoinsBalance } from "./IdealCoinsBalance";
import { UsdtBalance } from "./UsdtBalance";
import { InvestorInfo } from "./InvestorInfo";
export const InfoUser = () => {

  const {address} = useAccount();
  return (
    <div>
      <div>address connect : {address}</div>
      <IdealCoinsBalance />
      <UsdtBalance />
      <InvestorInfo />
    </div>
  );
};
