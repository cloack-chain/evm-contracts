import { task, types } from "hardhat/config"

task("verify:cloackchain", "Verify a CloackChain contract")
    .addParam("address", "CloackChain contract address", undefined, types.string)
    .setAction(async ({ address }, { run }): Promise<void> => {
        try {
            await run("verify:verify", {
                address
            })
        } catch (error) {
            console.error(error)
        }
    })