// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.23;

import { TestUtils } from "test/utils/TestUtils.t.sol";
import { ISemaphoreVerifier } from "contracts/interfaces/ISemaphoreVerifier.sol";
import { ISemaphoreVerifier } from "contracts/interfaces/ISemaphoreVerifier.sol";
import { ICloakChain } from "contracts/interfaces/ICloakChain.sol";
import { CloakChain } from "contracts/CloakChain.sol";
import { CloakChainSemaphore } from "contracts/protocols/CloakChainSemaphore.sol";

abstract contract ContextTest is TestUtils {
    ISemaphoreVerifier public verifier;
    CloakChainSemaphore public cloakChainSemaphore;
    CloakChain public cloakChain;

    function _initSemaphore() internal {
        verifier = ISemaphoreVerifier(DEPLOYER);
        cloakChain = new CloakChain();
        cloakChainSemaphore = new CloakChainSemaphore(verifier, cloakChain);
    }
}
