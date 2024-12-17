import web3 from "./web3";
import campaignFactory from "../../../kickstart/ethereum/build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  campaignFactory.abi,
  "0xF0765D2C37c99e89d5Eb8d8230911A2c7c0cD7b8"
);

export default instance;
