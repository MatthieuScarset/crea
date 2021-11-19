// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract UniversalPricing is Ownable {
    // Hash on IPFS network.
    string[] private versions;

    struct Pricing {
        bool available;
        string label;
        uint256 price;
    }

    Pricing[] private pricings;

    event NewVersion(uint256 indexed index);
    event NewPricing(uint256 indexed index);

    function getDocument() public view returns (string memory) {
        if (versions.length == 0) {
            revert();
        }

        return versions[(versions.length - 1)];
    }

    function getDocument(uint256 i) public view returns (string memory) {
        return versions[i];
    }

    function setDocument(string memory _path) public payable {
        require(msg.value >= 1);

        versions.push(_path);

        emit NewVersion(versions.length - 1);
    }

    function getPricingsLength() public view returns (uint256) {
        return pricings.length;
    }

    function getPricing(uint256 i) public view returns (Pricing memory) {
        return pricings[i];
    }

    function addPricing(string memory _label, uint256 _price) public payable {
        require(msg.value >= 1);

        require(bytes(_label).length > 0, "Label cannot be empty.");
        require(_price >= 0, "Price must be greater than zero.");

        pricings.push(Pricing(true, _label, _price));

        emit NewPricing(pricings.length - 1);
    }

    // edit pricing
    // disable pricing
    // add category...etc
}
