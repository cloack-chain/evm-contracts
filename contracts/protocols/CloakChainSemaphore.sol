//SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.23;

import { ICloakChain } from "../interfaces/ICloakChain.sol";
import { ICloakChainSemaphore } from "./ICloakChainSemaphore.sol";
import { ISemaphoreVerifier } from "../interfaces/ISemaphoreVerifier.sol";

/// @title CloakChainSemaphore
/// @dev This contract is used to verify Semaphore proofs.
contract CloakChainSemaphore is ICloakChainSemaphore {
    ISemaphoreVerifier public verifier;
    ICloakChain public cloackchain;

    /// @dev Gets a group id and a nullifier hash and returns true if it has already been used.
    mapping(uint256 index => mapping(uint256 groupId => bool valid))
        internal nullifierHashes;

    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    /// @param _verifier: Semaphore verifier address.
    /// @param _cloackchain: CloackChain address.
    constructor(ISemaphoreVerifier _verifier, ICloakChain _cloackchain) {
        verifier = _verifier;
        cloackchain = _cloackchain;
    }

    /// @dev See {ICloackChain-verifyProof}.
    function verifyProof(
        uint256 groupId,
        uint256 merkleTreeRoot,
        uint256 merkleTreeDepth,
        uint256 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external override {
        uint256 currentMerkleTreeRoot = cloackchain.groups(groupId);

        // A proof could have used an old Merkle tree root.
        // https://github.com/semaphore-protocol/semaphore/issues/98
        if (merkleTreeRoot != currentMerkleTreeRoot) {
            uint256 merkleRootCreationDate = cloackchain
                .getFingerprintCreationDate(groupId, merkleTreeRoot);
            uint256 merkleTreeDuration = cloackchain.fingerprintDuration(
                groupId
            );

            if (merkleRootCreationDate == 0) {
                revert CloakChainSemaphore__MerkleTreeRootIsNotPartOfTheGroup();
            }

            if (block.timestamp > merkleRootCreationDate + merkleTreeDuration) {
                revert CloakChainSemaphore__MerkleTreeRootIsExpired();
            }
        }

        if (nullifierHashes[groupId][nullifierHash]) {
            revert CloakChainSemaphore__YouAreUsingTheSameNullifierTwice();
        }

        verifier.verifyProof(
            merkleTreeRoot,
            nullifierHash,
            signal,
            externalNullifier,
            proof,
            merkleTreeDepth
        );

        nullifierHashes[groupId][nullifierHash] = true;

        emit ProofVerified(
            groupId,
            merkleTreeRoot,
            nullifierHash,
            externalNullifier,
            signal
        );
    }
}
