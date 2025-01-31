"use client";

import RequestRow from "@/components/RequestRow";
import campaignContract from "@/ethereum/campaign";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  MenuItem,
  Icon,
  Label,
  Menu,
  Table,
} from "semantic-ui-react";

export default function page({ params }: any) {
  const pathname = usePathname();
  const { campaignAddress } = params;
  const campaign = campaignContract(campaignAddress);
  const [requests, setRequests] = useState<any>();
  const [requestUpdated, setRequestUpdated] = useState<boolean>(false);

  const getRequests = async () => {
    const requestCount: any = await campaign.methods.getRequestCount().call();
    const requestResults: any = await Promise.all(
      Array.from({ length: parseInt(requestCount) }).map((_, index) => {
        return campaign.methods.requests(index).call();
      })
    );
    setRequests(requestResults);
  };

  const tableRow = () => {
    if (requests)
      return requests.map((request: any, index: number) => {
        return (
          <RequestRow id={index} request={request} address={campaignAddress} />
        );
      });
    else return null;
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={8}>
          <h3>Requests</h3>
        </Grid.Column>
        <Grid.Column width={8} textAlign="right">
          <Link href={`${pathname}/new`}>
            <Button primary>Create new Requests</Button>
          </Link>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Table celled>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Recipient</TableHeaderCell>
                <TableHeaderCell>Approval Count</TableHeaderCell>
                <TableHeaderCell>Approve</TableHeaderCell>
                <TableHeaderCell>Finalize</TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>{tableRow()}</TableBody>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
