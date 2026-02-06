// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyBEP20Upgradeable.sol";

contract MyBEP20UpgradeableV2 is MyBEP20Upgradeable {
    // New storage variable (safe to add at the end)
    uint256 public version;

    function initializeV2() public reinitializer(2) {
        version = 2;
    }

    // Example new function
    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
    }
}
