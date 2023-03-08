import React, { useState, useEffect } from "react";
import erc20 from "../util/abi/ERC20";
import { useAccount, useContractRead } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import Address from "../util/contractAddress/Address";

export const IdealCoinsBalance = () => {
  const [balance, setBalance] = useState<string>("");

  const { address,isDisconnected } = useAccount();

  const { data, status }: any = useContractRead({
    address: Address.idealCoins,
    abi: erc20,
    functionName: "balanceOf",
    args: [address],
    chainId: bscTestnet.id,
  } as any);

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
  
  return <div>balance IdealCoins : {balance}</div>;
};
