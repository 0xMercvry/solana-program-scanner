import { Program, HttpResponse, DigitalEyesNFT, ProgramAddress } from "../types";
import axios from "axios";

export async function _handleDigitalEyesData ({ offers }): Promise<Program> {
    if (!offers || !offers[0]) throw "invalid data type for DigitalEyes";
    let item: DigitalEyesNFT = offers[0];
    let creators: ProgramAddress[] = [];
    // Handle NFT Collection Description
    const { data } = await axios.get(`https://us-central1-digitaleyes-prod.cloudfunctions.net/collection-retriever?collection=${item.collection}`);
    item.creators.sort((a, b) => a.Share > b.Share ? -1 : 1);
    for (let x in item.creators) {
        let c = item.creators[x];
        if (c.Share > 0) { 
            creators.push({ address: c.Address, share: c.Share });
        }
    }
    return {
        marketplace: 'digitaleyes',
        title: data.name,
        description: data.description,
        creators
    };
}