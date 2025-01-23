import { redirect } from "next/navigation";

export default function CampaignsPage() {
  // Redirect users to the /campaigns/new page
  redirect("/campaigns/new");
}
