// @ts-ignore: typechain folder will be generated after contracts compilation.
// eslint-disable-next-line import/extensions
import { CloakChain, CloakChain__factory } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { BigNumberish, Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('CloakChain', () => {
  let owner: SignerWithAddress;
  let instance: CloakChain;

  const treeDepth = Number(process.env.TREE_DEPTH) || 20;

  // array of members to add to the group
  const members: BigNumberish[] = [];

  const groupId: string = ethers.encodeBytes32String('Mina');
  let identityCommitment: BigNumberish;
  for (let i = 0; i < 10; i += 1) {
    identityCommitment = new Identity(i.toString()).commitment;
    members.push(identityCommitment);
  }

  let group: Group = new Group(BigInt(groupId), treeDepth, members);

  before(async () => {
    [owner] = await ethers.getSigners();
  });

  beforeEach(async () => {
    instance = await new CloakChain__factory(owner).deploy();
    await instance.updateGroups([{ id: groupId, fingerprint: group.root }]);
  });

  describe('# updateGroups', () => {
    it('Should update groups', async () => {
      const transaction = instance.updateGroups([
        {
          id: groupId,
          fingerprint: group.root,
        },
      ]);

      await expect(transaction)
        .to.emit(instance, 'GroupUpdated')
        .withArgs(groupId, group.root);
    });
  });

  describe('# groups', () => {
    it('Should get the current fingerprint of an off-chain group', async () => {
      const fingerprint = await instance.groups(groupId);

      expect(fingerprint).to.equal(group.root);
    });
  });

  describe('# updateFingerprintDuration', () => {
    it('Should update the fingerprint duration', async () => {
      const duration = 3600;

      await instance.updateFingerprintDuration(groupId, duration);

      const fingerprintDuration = await instance.fingerprintDuration(groupId);

      expect(duration).to.equal(fingerprintDuration);
    });
  });
});
