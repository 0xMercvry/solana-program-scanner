
import { HttpResponse, Program, MagicEdenNFT, ProgramAddress } from "../types";

export async function _handleMagicEdenData ({ results }): Promise<Program> {
    if (!results || typeof results[0] !== 'object') throw "invalid data type for magiceden";
    let item: MagicEdenNFT = results[0];
    let creators: ProgramAddress[] = [];

    item.creators.sort((a, b) => a.share > b.share ? -1 : 1);
    for (let x in item.creators) {
        let c: ProgramAddress = item.creators[x];
        if (c.share > 0) { 
            creators.push({ address: c.address, share: c.share });
        }
    }

    return {
        marketplace: 'magiceden',
        title: item.collectionTitle,
        description: item.content,
        creators
    };
}