// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract UniversalPricing is Ownable {
    struct Pricing {
        bool available;
        bytes name;
        uint256 price;
    }

    Pricing[] public pricings;

    event NewPricing(uint256 indexed index, Pricing price);

    function addPricing(string memory name, uint256 price) public onlyOwner {
        require(bytes(name).length > 0, "Name cannot be empty.");
        require(price >= 0, "Price must be greater than zero.");

        pricings.push(Pricing(false, bytes(name), price));

        uint256 i = pricings.length - 1;
        emit NewPricing(pricings.length - 1, pricings[i]);
    }
}
