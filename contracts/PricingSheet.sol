// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ImmutableDocument.sol";

contract PricingSheet is ImmutableDocument {
    struct Pricing {
        bool available;
        string label;
        uint256 price;
    }

    Pricing[] private pricings;

    event NewPricing(uint256 indexed index);
    event PricingUpdated(uint256 indexed index);
    event PricingDisabled(uint256 indexed index);

    function getPricingsLength() public view returns (uint256) {
        return pricings.length;
    }

    function getPricing(uint256 i) public view returns (Pricing memory) {
        return pricings[i];
    }

    /// @dev Fee is set by the owner - inherited from ImmutableDocument.
    function addPricing(string memory _label, uint256 _price) public payable {
        require(msg.value >= this.getFee());

        require(bytes(_label).length > 0, "Label cannot be empty.");
        require(_price >= 0, "Price must be greater than zero.");

        pricings.push(Pricing(true, _label, _price));

        emit NewPricing(pricings.length - 1);
    }

    function editPricing(
        uint256 i,
        string memory _label,
        uint256 _price
    ) public payable {
        require(msg.value >= this.getFee());

        require(bytes(_label).length > 0, "Label cannot be empty.");
        require(_price >= 0, "Price must be greater than zero.");
        require(pricings[i].available, "Pricing is not available anymore.");

        pricings[i].label = _label;
        pricings[i].price = _price;

        emit PricingUpdated(i);
    }

    function disablePricing(uint256 i) public payable {
        require(msg.value >= this.getFee());

        pricings[i].available = false;

        emit PricingDisabled(i);
    }

    // add category...etc
}
