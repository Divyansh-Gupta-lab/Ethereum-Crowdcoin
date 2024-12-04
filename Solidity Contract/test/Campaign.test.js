const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let factory;
let campaign;
let campaignAddress;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "10000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[1], gas: "1000000" });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaign", () => {
  it("deploys the contract", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("assigns the manager correctly", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[1]);
  });

  it("allows people to contribute to campaigns", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[2], value: "10000" });
    assert(await campaign.methods.approvers(accounts[2]).call());
  });

  it("needs a minimum contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ from: accounts[2], value: "10" });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[2], value: "10000" });
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[9])
      .send({
        from: accounts[1],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, "Buy batteries");
  });

  it("sends eth on request approval", async () => {
    const initialBalance = await web3.eth.getBalance(accounts[9]);
    await campaign.methods
      .contribute()
      .send({ from: accounts[2], value: web3.utils.toWei("10", "ether") });
    await campaign.methods
      .createRequest(
        "Buy batteries",
        web3.utils.toWei("3", "ether"),
        accounts[9]
      )
      .send({
        from: accounts[1],
        gas: "1000000",
      });
    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[2], gas: "100000" });
    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[1], gas: "100000" });
    const finalBalance = await web3.eth.getBalance(accounts[9]);
    const diff = finalBalance - initialBalance;
    console.log(web3.utils.fromWei(diff, "ether"));
    assert(finalBalance - initialBalance > web3.utils.toWei("2.9", "ether"));
  });
});
