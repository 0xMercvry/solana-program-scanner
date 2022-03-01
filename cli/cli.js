#!/usr/bin/env node --harmony

/**
 * Currently under development
 */

import { program } from "commander";
import scanner, { showProgramAddress } from "../dist/lib";
import { DEFAULT_MARKETPLACE } from "../dist/config";

(async () => {
    try {
        program
            .description('Find any NFT program address on Solana blockchain from the ME uri.')
            .option('-p, --project <projectId>', 'ID of project')
            .option('-m, --marketplace <marketId>', 'Marketplace ID (ME by default)')
            .parse();

        const options = program.opts();

        console.log(options);

        if (!options.project) return program.help();
        let marketplace = options.marketplace || DEFAULT_MARKETPLACE;
        const data = await scanner(options.project, marketplace);
        showProgramAddress(data);
    } catch (err) {
        console.log(err);
    }
})(); 
