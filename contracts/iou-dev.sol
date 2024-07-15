//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IOU is ERC20 {
    constructor() ERC20("IOU", "IOU") {
        _mint(msg.sender, 100 * (10**18));
    }
    uint constant _initial_supply = 100 * (10**18);
}