"use client";

import Image from "next/image";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<string[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const fetchedCampaigns: string[] = await factory.methods
          .getDeployedCampaigns()
          .call();
        setCampaigns(fetchedCampaigns || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setCampaigns([]);
      }
    };

    fetchCampaigns();
  }, []);

  const renderCampaigns = () => {
    const items = campaigns.map((address: string) => {
      return {
        header: address,
        description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <div>
      <h3>Open Campaigns</h3>
      <Button
        content="Create Camapaign"
        icon="add circle"
        primary={true}
        floated="right"
        onClick={() => router.replace("/campaigns/new")}
      />
      {renderCampaigns()}
    </div>
  );
}
