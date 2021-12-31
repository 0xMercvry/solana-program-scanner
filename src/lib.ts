import axios from "axios";
import {table} from "table";

import {  MARKETPLACES, DEFAULT_MARKETPLACE, AVAILABLE_MARKETPLACES } from "./config";
export const PROGRAM_URL_TEMPLATE: string = "{projectId}";
import { Marketplace, Program } from "./types"

function showProgramAddress (data: Program): boolean {
    let template = `${data.title}\n--------------------------------\n${data.description}\nFound from ${data.marketplace}\n`;
    let arr = [['Address', 'Share']];
    for (let x in data.creators) {
        let c = data.creators[x];
        arr.push([c.address, `${c.share}%`]);
    }
    process.stdout.write(template + table(arr));
    return true;
}

/**
 * DEFAULT: Get Program Creators Addresses
 * @param programUrl 
 * @param marketplace 
 * @returns 
 */
export default async function solanaNftCreatorScanner (programUrl: string, marketplace?: string): Promise<Program> {
    try {
        let mpTable: string[]     = Object.keys(MARKETPLACES);
        let marketplaceId: number = mpTable.indexOf(marketplace || DEFAULT_MARKETPLACE);
        
        if (marketplaceId < 0) throw `unexpected marketplace "${marketplace}" provided. Please choose from [${AVAILABLE_MARKETPLACES.join(', ')}]`;
        let marketplaceObj: Marketplace = MARKETPLACES[mpTable[marketplaceId]];
        let { data } = await axios.get(marketplaceObj.getUrl(programUrl));
        return marketplaceObj.callback(data);
    } catch (err) {
        console.log(err);
    }
}

export { showProgramAddress };