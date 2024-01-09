import { task, types } from "hardhat/config"

task("verify:cloackchain-semaphore", "Verify a CloackChainSemaphore contract")
    .addParam(
        "address",
        "CloackChainSemaphore contract address",
        undefined,
        types.string
    )
    .addParam(
        "args",
        "CloackChainSemaphore constructor arguments",
        undefined,
        types.json
    )
    .setAction(async ({ address, args }, { run }): Promise<void> => {
        try {
            await run("verify:verify", {
                address,
                constructorArguments: args
            })
        } catch (error) {
            console.error(error)
        }
    })