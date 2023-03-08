import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Address from "../util/contractAddress/Address";
import ERC20 from "../util/abi/ERC20";
import { ethers } from "ethers";

export const ApprovalButton = ({ disable, setIsApproval}: any) => {
  const { config, error } = usePrepareContractWrite({
    address: Address.usdtFake,
    abi: ERC20,
    functionName: "approve",
    args: [Address.staking, ethers.utils.parseEther("1000000").toString()],
  } as any);

  const {  writeAsync, isSuccess } = useContractWrite(config as any);

  const approval = async() =>{
    const result = await writeAsync?.();
    await result?.wait(2);
    setIsApproval(true);
  };

  return (
    <Button
      variant="primary"
      type={"button"}
      disabled={disable}
      onClick={approval}
    >
      Approval
    </Button>
  );
};
