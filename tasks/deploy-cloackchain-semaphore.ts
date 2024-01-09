import { Contract } from 'ethers';
import { task, types } from 'hardhat/config';

task('deploy:cloackchain-semaphore', 'Deploy a CloakChainSemaphore contract')
  .addOptionalParam<boolean>('logs', 'Print the logs', true, types.boolean)
  .addOptionalParam(
    'cloackchain',
    'CloackChain contract address',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'semaphoreVerifier',
    'SemaphoreVerifier contract address',
    undefined,
    types.string,
  )
  .setAction(
    async (
      {
        logs,
        cloackchain: cloackchainAddress,
        semaphoreVerifier: semaphoreVerifierAddress,
      },
      { ethers, run },
    ): Promise<Contract> => {
      if (!semaphoreVerifierAddress) {
        const PairingFactory = await ethers.getContractFactory('Pairing');
        const pairing = await PairingFactory.deploy();

        await pairing.waitForDeployment();
        const pairingAddress = await pairing.getAddress();

        if (logs) {
          console.info(
            `Pairing library has been deployed to: ${pairingAddress}`,
          );
        }

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
        const semaphoreVerifierAddress = await semaphoreVerifier.getAddress();

        if (logs) {
          console.info(
            `SemaphoreVerifier contract has been deployed to: ${semaphoreVerifierAddress}`,
          );
        }
      }

      if (!cloackchainAddress) {
        const cloackchain = await run('deploy:cloackchain', {
          logs,
        });

        cloackchainAddress = cloackchain.getAddress();
      }

      const ContractFactory = await ethers.getContractFactory(
        'CloakChainSemaphore',
      );

      const contract = await ContractFactory.deploy(
        semaphoreVerifierAddress,
        cloackchainAddress,
      );

      await contract.waitForDeployment();

      const contractAddress = await contract.getAddress();

      if (logs) {
        console.info(
          `CloakChainSemaphore contract has been deployed to: ${contractAddress}`,
        );
      }

      return contract;
    },
  );
