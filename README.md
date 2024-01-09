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
