// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.23;

interface IErrors {
    error ZeroAddress(string description);
    error ZeroUint(string description);
    error ZeroArray(string description);
    error Overflow(string description);
    error ArrayIndexOutOfBounds(string description);
}
