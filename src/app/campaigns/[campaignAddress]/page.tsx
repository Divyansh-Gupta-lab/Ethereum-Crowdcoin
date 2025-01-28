"use client";

import campaignContract from "@/ethereum/campaign";
import { CampaignDetails } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import web3 from "@/ethereum/web3";
import ContributionForm from "@/components/ContributionForm";
import Link from "next/link";

export default function CampaignPage() {
  const { campaignAddress } = useParams<{ campaignAddress: string }>();
  const campaign = campaignContract(campaignAddress);
  const [campaignUpdated, setCampaignUpdated] = useState<boolean>(true);
  const [minimumContribution, setMinimumContribution] = useState(0);
  const [balance, setBalance] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [approverCount, setApproverCount] = useState(0);
  const [manager, setManager] = useState("");

  const fetchCampaigns = async () => {
    try {
      const campaignDetails: CampaignDetails = await campaign.methods
        .getSummary()
        .call();
      setMinimumContribution(Number(campaignDetails["0"]));
      setBalance(Number(campaignDetails["1"]));
      setRequestCount(Number(campaignDetails["2"]));
      setApproverCount(Number(campaignDetails["3"]));
      setManager(campaignDetails["4"]);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    if (campaignUpdated) {
      fetchCampaigns();
      setCampaignUpdated(false);
    }
  }, [campaignUpdated]);

  const renderCampaigns = () => {
    const items = [
      {
        header: manager,
        meta: "Address of campaign Manager",
        description:
          "Manager who created this campaign and will make requests to withdraw money from the contract",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "Minimum contribution required if one wants to become an approver in this campaign",
      },
      {
        header: requestCount,
        meta: "Number of Requests",
        description:
          "Request made by the manager in order to withdraw money from the contract for a specific task. Requests needs to be approved by approvers.",
      },
      {
        header: approverCount,
        meta: "Number of Approvers",
        description: "Number of people who have donated to this campaign",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Total contribution (Ether)",
        description: "Amount of money this campaign still holds",
      },
    ];

    return <Card.Group items={items} />;
  };

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <h3>Campaign Details</h3>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={10}>{renderCampaigns()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributionForm
              campaign={campaign}
              setCampaignUpdated={setCampaignUpdated}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${campaignAddress}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
