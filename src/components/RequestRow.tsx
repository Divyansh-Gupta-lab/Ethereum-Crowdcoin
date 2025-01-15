"import client";

import campaignContract from "@/ethereum/campaign";
import web3 from "@/ethereum/web3";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, TableCell, TableRow } from "semantic-ui-react";

export default function RequestRow({ id, request, address }: any) {
  const [processingTransaction, setProcessingTransaction] =
    useState<boolean>(false);

  const onApprove = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = campaignContract(address);
      setProcessingTransaction(true);
      await campaign.methods.approveRequest(id).send({
        from: accounts[0],
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessingTransaction(false);
    }
  };

  const onFinalize = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = campaignContract(address);
      setProcessingTransaction(true);
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0],
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessingTransaction(false);
    }
  };

  return (
    <TableRow disabled={request.complete}>
      <TableCell>{id}</TableCell>
      <TableCell>{request.description}</TableCell>
      <TableCell>{web3.utils.fromWei(request.value, "ether")}</TableCell>
      <TableCell>{request.recipient}</TableCell>
      <TableCell>{Number(request.approvalCount)}</TableCell>
      <TableCell>
        <Button
          color="green"
          basic
          onClick={() => onApprove()}
          loading={processingTransaction}
        >
          Approve
        </Button>
      </TableCell>
      <TableCell>
        <Button
          color="teal"
          basic
          onClick={() => onFinalize()}
          loading={processingTransaction}
        >
          Finalize
        </Button>
      </TableCell>
    </TableRow>
  );
}
