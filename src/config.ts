
import { _handleMagicEdenData } from "./marketplaces/magiceden";
import { _handleDigitalEyesData } from "./marketplaces/digitaleyes";

export const AVAILABLE_MARKETPLACES: string[] = ['magiceden', 'digitaleyes'];

export const DEFAULT_MARKETPLACE: string = 'magiceden';

export const MARKETPLACES = {
    [DEFAULT_MARKETPLACE]: {
        key: 'me',
        getUrl: programId => `https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q={"$match":{"collectionSymbol":"${programId}"},"$sort":{"takerAmount":1,"createdAt":-1},"$skip":0,"$limit":20}`,
        callback: _handleMagicEdenData
    },
    'digitaleyes': {
        key: 'de',
        getUrl: programId => `https://us-central1-digitaleyes-prod.cloudfunctions.net/offers-retriever?collection=${programId}`,
        callback: _handleDigitalEyesData
    }
};
