import {
  CloakChain,
  CloakChain__factory,
  CloakChainSemaphore,
  CloakChainSemaphore__factory,
  Pairing,
  Pairing__factory,
} from '@cloack-chain/typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { BigNumberish, Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';
import {
  SemaphoreProof,
  generateProof,
  verifyProof,
} from '@semaphore-protocol/proof';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('CloakChainSemaphore', () => {
  let owner: SignerWithAddress;
  let instance: CloakChainSemaphore;
  let cloakChain: CloakChain;
  let pairingContract: Pairing;

  const treeDepth = Number(process.env.TREE_DEPTH) || 20;

  // array of members to add to the group
  const members: BigNumberish[] = [];

  const groupId: string = ethers.encodeBytes32String('Mina');
  let identityCommitment: BigNumberish;
  for (let i = 0; i < 10; i += 1) {
    identityCommitment = new Identity(i.toString()).commitment;
    members.push(identityCommitment);
  }

  const group: Group = new Group(BigInt(groupId), treeDepth, members);

  before(async () => {
    [owner] = await ethers.getSigners();
  });

  beforeEach(async () => {
    pairingContract = await new Pairing__factory(owner).deploy();
    const pairingAddress = await pairingContract.getAddress();

    const SemaphoreVerifierFactory = await ethers.getContractFactory(
      'SemaphoreVerifier',
      {
        libraries: {
          Pairing: pairingAddress,
        },
      },
    );

    const semaphoreVerifier = await SemaphoreVerifierFactory.deploy();

    await semaphoreVerifier.waitForDeployment();
    cloakChain = await new CloakChain__factory(owner).deploy();
    instance = await new CloakChainSemaphore__factory(owner).deploy(
      semaphoreVerifier,
      cloakChain,
    );

    await cloakChain.updateGroups([{ id: groupId, fingerprint: group.root }]);
  });

  describe('# verifyProof', () => {
    const wasmFilePath = `./snark-artifacts/semaphore.wasm`;
    const zkeyFilePath = `./snark-artifacts/semaphore.zkey`;

    const signal = ethers.encodeBytes32String('Mina');
    // external nullifier to prevent double signaling
    const externalNullifier = group.root;

    let fullProof: SemaphoreProof;

    before(async () => {
      fullProof = await generateProof(
        new Identity('1'),
        group,
        externalNullifier,
        signal,
        { wasmFilePath, zkeyFilePath },
      );
    });

    it('should able to proof offchain', async () => {
      // verify the proof
      const verified: boolean = await verifyProof(fullProof, group.depth);
      expect(verified).to.be.true;
    });

    it('Should throw an exception if the proof is not valid', async () => {
      const transaction = instance.verifyProof(
        groupId,
        group.root,
        group.depth,
        signal,
        fullProof.nullifierHash,
        0,
        fullProof.proof,
      );

      await expect(transaction).to.be.reverted;
    });

    it('Should verify a proof for an off-chain group correctly', async () => {
      const transaction = instance.verifyProof(
        groupId,
        group.root,
        group.depth,
        signal,
        fullProof.nullifierHash,
        group.root,
        fullProof.proof,
      );

      await expect(transaction)
        .to.emit(instance, 'ProofVerified')
        .withArgs(
          groupId,
          group.root,
          fullProof.nullifierHash,
          group.root,
          signal,
        );
    });
    it('Should not verify the same proof for an off-chain group twice', async () => {
      instance.verifyProof(
        groupId,
        group.root,
        group.depth,
        signal,
        fullProof.nullifierHash,
        group.root,
        fullProof.proof,
      );

      // console.log('transaction', await transaction);

      const transaction = instance.verifyProof(
        groupId,
        group.root,
        group.depth,
        signal,
        fullProof.nullifierHash,
        group.root,
        fullProof.proof,
      );

      await expect(transaction).to.be.revertedWithCustomError(
        instance,
        'CloakChainSemaphore__YouAreUsingTheSameNullifierTwice',
      );
    });
    it('Should not verify a proof if the Merkle tree root is expired', async () => {
      fullProof = await generateProof(
        new Identity('1'),
        group,
        group.root,
        signal,
        {
          wasmFilePath,
          zkeyFilePath,
        },
      );

      group.addMember(new Identity('3').commitment);

      await cloakChain.updateGroups([
        {
          id: groupId,
          fingerprint: group.root,
        },
      ]);

      const transaction = instance.verifyProof(
        groupId,
        fullProof.merkleTreeRoot,
        group.depth,
        signal,
        fullProof.nullifierHash,
        fullProof.merkleTreeRoot,
        fullProof.proof,
      );

      await expect(transaction).to.be.revertedWithCustomError(
        instance,
        'CloakChainSemaphore__MerkleTreeRootIsExpired',
      );
    });
  });
});
