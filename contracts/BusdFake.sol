// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BusdFake is ERC20 {
    constructor() ERC20("BusdFake", "BUSDF") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}