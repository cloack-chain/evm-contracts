// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.23;

import { Test } from "forge-std/Test.sol";
import { IErrors } from "contracts/interfaces/IErrors.sol";

abstract contract TestUtils is Test, IErrors {
    address public constant ZERO_ADDRESS = address(0);
    address public constant DEPLOYER = address(1);
    address public constant NON_DEPLOYER = address(2);
    uint256 public constant ZERO = 0;
    uint8 public constant MAX_UINT8 = type(uint8).max;
    uint64 public constant MAX_UINT64 = type(uint64).max;
    uint256 public constant MAX_UINT256 = type(uint256).max;
}
