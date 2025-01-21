"use client";

import factory from "@/ethereum/factory";
import React, { useState } from "react";
import { FormField, Button, Checkbox, Form, Input } from "semantic-ui-react";
import web3 from "@/ethereum/web3";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [value, setValue] = useState<number>();
  const [processingTransaction, setProcessingTransaction] =
    useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      const fromAddress = accounts[0];
      setProcessingTransaction(true);
      const gasEstimate = await factory.methods
        .createCampaign(value)
        .estimateGas({ from: fromAddress });
      const tx = {
        from: fromAddress,
        to: factory.options.address, // Address of the contract
        data: factory.methods.createCampaign(value).encodeABI(),
        gas: gasEstimate,
      };
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const signedTx = await window.ethereum.request({
          method: "eth_signTransaction",
          params: [tx],
        });
        console.log("Signed transaction:", signedTx); // await factory.methods.createCampaign(value).send({
      } else {
        console.log("no metamask?");
      }

      //   from: accounts[0],
      // });
      // router.replace("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessingTransaction(false);
    }
  };
  return (
    <div>
      <h3>Create New Campaigns</h3>
      <Form onSubmit={onSubmit}>
        <FormField>
          <label>Minimum Contribution</label>
          <Input
            type="number"
            // placeholder="0"
            value={value}
            onChange={(e) => setValue(+e.target.value)}
            label="wei"
            labelPosition="right"
          />
        </FormField>
        <Button type="submit" primary loading={processingTransaction}>
          Create!
        </Button>
      </Form>
    </div>
  );
}
