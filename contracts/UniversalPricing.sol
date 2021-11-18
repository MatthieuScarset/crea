// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract UniversalPricing is Ownable {
    struct Pricing {
        bool available;
        string label;
        uint256 price;
    }

    Pricing[] public pricings;

    event NewPricing(uint256 indexed index);

    function addPricing(string memory _label, uint256 _price) public onlyOwner {
        require(bytes(_label).length > 0, "Label cannot be empty.");
        require(_price >= 0, "Price must be greater than zero.");

        pricings.push(Pricing(false, _label, _price));

        emit NewPricing(pricings.length - 1);
    }
}
