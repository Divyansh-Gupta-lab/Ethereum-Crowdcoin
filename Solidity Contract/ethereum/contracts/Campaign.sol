// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimumContribution) public {
        Campaign newCampaign = new Campaign(minimumContribution, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint totalApprovers;
    Request[] public requests;

    constructor(uint minimum, address creator) {
        minimumContribution = minimum;
        manager = creator;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        totalApprovers++;
    }

    function createRequest(string memory description, uint transferValue, address targetWallet) public restricted {
        require(address(this).balance >= transferValue);
        Request storage newRequest = requests.push(); // Push the new request into the requests array
        newRequest.description = description;
        newRequest.value = transferValue;
        newRequest.recipient = payable(targetWallet); // Use payable for recipient
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage relevantRequest = requests[index];

        require(approvers[msg.sender]);
        require(!relevantRequest.approvals[msg.sender]);

        relevantRequest.approvals[msg.sender] = true;
        relevantRequest.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage relevantRequest = requests[index];

        require(!relevantRequest.complete);
        require(relevantRequest.approvalCount > (totalApprovers/2));

        relevantRequest.recipient.transfer(relevantRequest.value);
        relevantRequest.complete = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution, address(this).balance, requests.length, totalApprovers, manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}