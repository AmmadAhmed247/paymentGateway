// contracts/MockToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Mock Tether", "mUSDT") {}
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}