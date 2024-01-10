# CloackChain Solidity

CloackChain is an Anonymous Multichain signaling using Zero Knowledge proof.

It consists of the following packages:

| package                   | description                                                                           | 📕                          |
| ------------------------- | ------------------------------------------------------------------------------------- | --------------------------- |
| `@cloack-chain/abi`       | contract ABIs                                                                         | [📖](./abi/README.md)       |
| `@cloack-chain/contracts` | core contracts                                                                        | [📖](./contracts/README.md) |
| `@cloack-chain/library`   | functions for interacting with and validating contracts                               | [📖](./lib/README.md)       |
| `@cloack-chain/spec`      | portable tests which may be run against third-party implementations of core contracts | [📖](./spec/README.md)      |

### Contracts
| **Contract**         | **Goerli**                                 |
|----------------------|--------------------------------------------|
| CloackChain          | 0x8C331119Af77BF13A595F0B954d87b2b2330f83b |
| CloackChainSemaphore | 0xB2f4B4440A6f146E146DCe5e48f2F549F99415cA |
| Pairing              | 0xE5f751Be2bce1FA9a22E9A5747DD466EfC4f2cF0 |
| SemaphoreVerifier    | 0x676809EffBDe3d94D3dAE734375695059BE2681a |

## Development

Install dependencies via Yarn:

```bash
yarn install
```

Setup Husky to format code on commit:

```bash
yarn prepare
```

Compile contracts via Hardhat & Foundry:

```bash
yarn build
```

Automatically upgrade dependencies with yarn-up:

```bash
yarn upgrade-dependencies
```

### Testing
Before testing, you need to download snark-artifacts
```
yarn download:snark-artifacts
```

Test contracts with Hardhat, Foundry and generate gas report using `hardhat-gas-reporter`:

```bash
yarn test
```

Generate a code coverage report using `solidity-coverage`:

```bash
yarn coverage
```

### Publication

Publish packages via Lerna:

```bash
yarn lerna-publish
```
## Deployments
```
yarn deploy:cloackchain --network goerli
yarn verify:cloackchain --address '0x8C331119Af77BF13A595F0B954d87b2b2330f83b'
yarn deploy:cloackchain-semaphore --network goerli --cloackchain '0x8C331119Af77BF13A595F0B954d87b2b2330f83b'
npx hardhat verify --network goerli 0xB2f4B4440A6f146E146DCe5e48f2F549F99415cA --constructor-args ./tasks/cloackchain-semaphore-arguments.js
```