//SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.23;

import { ICloakChain } from "./interfaces/ICloakChain.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/// @title CloakChain
/// @dev This contract is used to save the groups fingerprints.
contract CloakChain is ICloakChain, Ownable {
    /// @dev See {ICloakChain-groups}.
    mapping(uint256 groupId => uint256 fingerprint) public override groups;

    mapping(uint256 => mapping(uint256 fingerprint => uint256 date))
        public fingerprintCreationDates;

    /// @dev See {ICloakChain-fingerprintDuration}.
    mapping(uint256 fingerprint => uint256 duration)
        public
        override fingerprintDuration;

    constructor() Ownable(msg.sender) {}

    /// @dev See {ICloakChain-updateGroups}.
    function updateGroups(
        Group[] calldata _groups
    ) external override onlyOwner {
        for (uint256 i = 0; i < _groups.length; ) {
            groups[_groups[i].id] = _groups[i].fingerprint;

            fingerprintCreationDates[_groups[i].id][
                _groups[i].fingerprint
            ] = block.timestamp;

            emit GroupUpdated(_groups[i].id, _groups[i].fingerprint);

            unchecked {
                ++i;
            }
        }
    }

    /// @dev See {ICloakChain-getFingerprintCreationDate}.
    function getFingerprintCreationDate(
        uint256 groupId,
        uint256 fingerprint
    ) external view override returns (uint256) {
        return fingerprintCreationDates[groupId][fingerprint];
    }

    /// @dev See {ICloakChain-updateFingerprintDuration}.
    function updateFingerprintDuration(
        uint256 groupId,
        uint256 durationSeconds
    ) external override onlyOwner {
        fingerprintDuration[groupId] = durationSeconds;
    }
}
