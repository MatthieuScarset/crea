// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ImmutableDocument is Ownable {
    // Hash on IPFS network.
    string[] private versions;

    // List of versions timestamp, keyed by unique CID.
    mapping(string => uint256) private list;

    // Required amount for "sufficientPay" modifier, in Wei.
    uint256 private fee = 0;

    // Events.
    event NewVersion(uint256 indexed index);
    event NewFee(uint256 indexed amount);

    modifier sufficientPay() {
        require(msg.value >= this.getFee());
        _;
    }

    // Owner-restricted methods.
    function setFee(uint256 amount) public onlyOwner {
        fee = amount;
        emit NewFee(amount);
    }

    // Use this in your dapp before sending ETH.
    function getFee() public view returns (uint256) {
        return fee;
    }

    // Get number of versions.
    function getDocumentLength() public view returns (uint256) {
        return versions.length;
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

    // Get timestamp of a given version.
    function getDocumentTimestamp(string memory cid)
        public
        view
        returns (uint256)
    {
        return list[cid];
    }

    /// @dev Saves a given path provided by Infura
    function setDocument(string memory cid) public payable sufficientPay {
        require(list[cid] == 0, "Document already exists.");

        list[cid] = block.timestamp;
        versions.push(cid);

        emit NewVersion(versions.length - 1);
    }
}
