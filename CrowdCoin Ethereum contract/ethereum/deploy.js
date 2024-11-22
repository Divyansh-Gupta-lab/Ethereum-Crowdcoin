const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { abi, evm } = require("./compile");

const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "tragic slice divide enhance vintage response unaware car judge buffalo pattern sustain",
  "https://sepolia.infura.io/v3/3c7630c8955641238abc3654571dd040"
);

const web3 = new Web3(provider);

const deploy = async () => {
  console.log(provider)
  // const accounts = await web3.eth.getAccounts();

  // console.log("Attempting to deploy from account", accounts[0]);

  // const result = await new web3.eth.Contract(compiledFactory.abi)
  //   .deploy({ data: compiledFactory.evm.bytecode.object })
  //   .send({ gas: "10000000", from: accounts[0] });

  // console.log(JSON.stringify(abi));
  // console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
