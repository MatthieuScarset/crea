// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UniversalPricing {
    address public owner;

    

    constructor() public {
        owner = msg.sender;
    }
}
