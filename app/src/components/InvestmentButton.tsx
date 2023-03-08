import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import erc20 from "../util/abi/ERC20";
import { bscTestnet } from "wagmi/chains";
import { useAccount, useContractRead } from "wagmi";
import Address from "../util/contractAddress/Address";
import { ethers } from "ethers";
import { ApprovalButton } from "./ApprovalButton";

export const InvestmentButton = () => {
  const [disable, setDisable] = useState<boolean>(false);
  const [isApproval, setIsApproval] = useState<boolean>(true);
 
  const { address, isDisconnected,isConnected } = useAccount();

  const { data, status }: any = useContractRead({
    address: Address.usdtFake,
    abi: erc20,
    functionName: "allowance",
    args: [address, Address.staking],
    chainId: bscTestnet.id,
  } as any);

  useEffect(() => {
    if (status === "success") {
      setIsApproval(ethers.BigNumber.from(data).gte(ethers.utils.parseEther('100')));
    }
  }, [status]);

  useEffect(() => {
    if (isConnected) {
      setDisable(!disable);
    }
  }, [isConnected]);

  useEffect(() => {
    if (isDisconnected) {
      setDisable(!disable);
      setIsApproval(true);
    }
  }, [isDisconnected]);

  useEffect(() => {}, [isApproval]);

  if(isApproval){
    return (
      <Button variant="primary" type={"submit"} disabled={disable}>
        Invest
      </Button>
    );
  }else{
    return <ApprovalButton disabled={disable} setIsApproval={setIsApproval} setDisable={setDisable}/>
  }
 
};
