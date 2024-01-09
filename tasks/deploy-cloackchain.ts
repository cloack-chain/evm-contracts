import { Contract } from 'ethers';
import { task, types } from 'hardhat/config';

task('deploy:cloackchain', 'Deploy a CloakChain contract')
  .addOptionalParam<boolean>('logs', 'Print the logs', true, types.boolean)

  .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
    const ContractFactory = await ethers.getContractFactory('CloakChain');

    const contract = await ContractFactory.deploy();

    await contract.waitForDeployment();

    if (logs) {
      console.info(
        `CloakChain contract has been deployed to: ${contract.address}`,
      );
    }

    return contract;
  });
