import React, { useState, useEffect } from "react";
import erc20 from "../util/abi/ERC20";
import { useAccount, useContractRead } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { ethers } from "ethers";

export const UsdtBalance = () => {
  const [balance, setBalance] = useState<string>("");

  const { address,isDisconnected } = useAccount();

  const { data, status }: any = useContractRead({
    address: "0x58Fb5A67150fCC0Da06A846C11779BC862D3bCDB",
    abi: erc20,
    functionName: "balanceOf",
    args: [address],
    chainId: bscTestnet.id,
  });

  useEffect(() => {
    if (status === "success") {
      setBalance(data.toString());
    }
  }, [status]);

  useEffect(() => {
    if (isDisconnected) {
      setBalance("0");
    }
  }, [isDisconnected]);
  
  return <div>balance Usdt : {ethers.utils.formatEther(balance || '0')}</div>;
};
