// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ImmutableDocument is Ownable {
    // Hash on IPFS network.
    string[] private versions;

    // Price to pay to upload document.
    uint256 private fee = 0;

    // Events.
    event NewVersion(uint256 indexed index);
    event NewFee(uint256 indexed amount);

    // Owner-restricted methods.
    function setFee(uint256 amount) public onlyOwner {
        fee = amount;
        emit NewFee(amount);
    }

    // Use this in your dapp before sending ETH.
    function getFee() public view returns (uint256 feeAmount) {
        return fee;
    }

    // Get latest version of the online document.
    function getDocument() public view returns (string memory) {
        if (versions.length == 0) {
            return "";
        }

        return versions[(versions.length - 1)];
    }

    // Get a given version of the online document.
    function getDocument(uint256 i) public view returns (string memory) {
        return versions[i];
    }

    /// @dev Saves a given path provided by Infura
    function setDocument(string memory cid) public payable {
        require(msg.value >= fee);

        versions.push(cid);

        emit NewVersion(versions.length - 1);
    }
}
