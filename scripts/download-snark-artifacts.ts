import download from 'download';

async function main() {
  const snarkArtifactsPath = './snark-artifacts';

  if (process.argv.length === 3) {
    const treeDepth = process.argv[2];
    const url = `https://www.trusted-setup-pse.org/semaphore/${treeDepth}`;

    await download(`${url}/semaphore.wasm`, `${snarkArtifactsPath}`);
    await download(`${url}/semaphore.zkey`, `${snarkArtifactsPath}`);
  } else {
    console.error('Expected one argument!');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
