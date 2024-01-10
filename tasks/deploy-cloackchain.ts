import { Contract } from 'ethers';
import { task, types } from 'hardhat/config';

task('deploy:cloackchain', 'Deploy a CloakChain contract')
  .addOptionalParam<boolean>('logs', 'Print the logs', true, types.boolean)

  .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
    const ContractFactory = await ethers.getContractFactory('CloakChain');

    const contract = await ContractFactory.deploy();

    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    if (logs) {
      console.info(
        `CloakChain contract has been deployed to: ${contractAddress}`,
      );
    }

    return contract;
  });
