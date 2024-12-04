const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const lotteryPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];
console.log(
  JSON.parse(solc.compile(JSON.stringify(input))).contracts["Campaign.sol"]
);

fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, `${contract}.json`),
    output[contract]
  );
}
