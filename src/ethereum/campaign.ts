import web3 from "./web3";
import campaign from "../../../kickstart/ethereum/build/Campaign.json";

const campaignContract = (address: string) => {
  return new web3.eth.Contract(campaign.abi, address);
};

export default campaignContract;
