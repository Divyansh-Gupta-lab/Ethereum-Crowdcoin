"use client";

import React, { useState } from "react";
import { FormField, Button, Form, Input } from "semantic-ui-react";
import web3 from "@/ethereum/web3";
import { toast } from "react-toastify";

export default function ContributionForm({
  campaign,
  setCampaignUpdated,
}: any) {
  const [value, setValue] = useState<number>(0);
  const [processingTransaction, setProcessingTransaction] =
    useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      setProcessingTransaction(true);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });
      setCampaignUpdated(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessingTransaction(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <FormField>
        <label>Amount to contribute</label>
        <Input
          type="number"
          placeholder="0"
          value={value ? value : undefined}
          onChange={(e) => e.target.value && setValue(+e.target.value)}
          label="ether"
          labelPosition="right"
          step="0.000000001"
        />
      </FormField>
      <Button type="submit" primary loading={processingTransaction}>
        Contribute!
      </Button>
    </Form>
  );
}
