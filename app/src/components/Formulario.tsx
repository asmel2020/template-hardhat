import React,{useState} from "react";

import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ethers } from "ethers";
import { InvestmentButton } from "./InvestmentButton";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Address from "../util/contractAddress/Address";
import ERC20 from "../util/abi/ERC20";
import Stacking from "../util/abi/Stacking";

yup.addMethod(yup.string, "ethereum", function (anyArgsYouNeed) {
  return this.test(
    "ethereum",
    ({ value }: any) => `${value} is not a valid Ethereum address`,
    (value: any): any => ethers.utils.isAddress(value)
  );
});

const schema = yup
  .object({
    MountInvestment: yup.number().required().min(100).positive().integer(),
    InvestmentPlan: yup
      .string()
      .required()
      .matches(/(1|2|3|4)/),
    Referred: yup.string()/* .required().ethereum() */,
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export const Formulario = () => {

  const [amount, setAmount] = useState<any>(0)
  const [plan, setPlan] = useState<string>('')
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const { config, error } = usePrepareContractWrite({
    address: Address.staking,
    abi:Stacking,
    functionName: "firstInvestment",
    args: [amount, plan,'0x0000000000000000000000000000000000000000'],
  } as any);

  const {  writeAsync, isSuccess } = useContractWrite(config as any);

  const onSubmit =async ({MountInvestment,InvestmentPlan}: any) => {

    setAmount(ethers.utils.parseEther(MountInvestment.toString()).toString());
    setPlan(InvestmentPlan);

    const result = await writeAsync?.();
    await result?.wait(2);
  };




  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="formBasicInvestment">
        <Form.Label>Mount Investment</Form.Label>
        <Form.Control
          type="number"
          placeholder="Mount Investment"
          min="100"
          {...register("MountInvestment", { required: true, min: 1 })}
        />
        <p>{errors.MountInvestment?.message}</p>
      </Form.Group>
      <p>{errors.MountInvestment?.message}</p>

      <Form.Group className="mb-3" controlId="formBasicPlan">
        <Form.Label>Investment Plan</Form.Label>
        <select
          className="form-select"
          aria-label="Default select example"
          {...register("InvestmentPlan", { required: true })}
        >
          <option selected value="1">
            12 months
          </option>
          <option value="2">18 Months</option>
          <option value="3">24 Months</option>
          <option value="4">36 Months</option>
        </select>
        <p>{errors.InvestmentPlan?.message}</p>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Referred</Form.Label>
        <Form.Control
          type="text"
          placeholder="Referred"
          {...register("Referred", { required: true })}
        />
        <p>{errors.Referred?.message}</p>
      </Form.Group>
    
      <InvestmentButton />
    </Form>
  );
};
