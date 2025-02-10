"use client";

import campaignContract from "@/ethereum/campaign";
import web3 from "@/ethereum/web3";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FormField, Button, Form, Input, Grid } from "semantic-ui-react";

export default function page({ params }: any) {
  const router = useRouter();
  const { campaignAddress } = params;
  const campaign = campaignContract(campaignAddress);
  const [description, setDescription] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [recipient, setRecipient] = useState("");
  const [processingTransaction, setProcessingTransaction] =
    useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) {
      toast.error("Request amount must be greater than zero");
      return;
    }
    try {
      const accounts = await web3.eth.getAccounts();
      setProcessingTransaction(true);
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });
      router.replace(`/campaigns/${campaignAddress}/requests`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessingTransaction(false);
    }
  };
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <h3>Create a request</h3>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form onSubmit={onSubmit}>
            <FormField>
              <label>Description</label>
              <Input
                required
                type="text"
                placeholder="Buy batteries"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>
            <FormField>
              <label>Amount required</label>
              <Input
                required
                type="number"
                placeholder="0"
                value={value ? value : undefined}
                onChange={(e) => e.target.value && setValue(+e.target.value)}
                label="ether"
                labelPosition="right"
                step="0.000000001"
              />
            </FormField>
            <FormField>
              <label>Recipient of this transaction</label>
              <Input
                required
                type="text"
                placeholder="0x00000000000000000000000"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </FormField>
            <Button type="submit" primary loading={processingTransaction}>
              Create!
            </Button>
          </Form>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
