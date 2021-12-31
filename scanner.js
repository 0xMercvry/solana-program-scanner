const {program} = require('commander');
const axios = require('axios');
const { table } = require('table');

program
    .description('Find any NFT program address on Solana blockchain from the ME uri.')
    .option('-p, --project <projectId>', 'ID of project')
    .option('-m, --marketplace <marketId>', 'Marketplace ID (ME by default)')
    .parse();

const options = program.opts();

if (!options.project) return program.help();

const MARKETPLACE_BY_DEFAULT = 'magiceden';

const MARKETPLACES = {
    [MARKETPLACE_BY_DEFAULT]: {
        key: 'me',
        url: `https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q={"$match":{"collectionSymbol":"${options.project}"},"$sort":{"takerAmount":1,"createdAt":-1},"$skip":0,"$limit":20}`,
        callback: handleMagicEdenData
    },
    'digitaleyes': {
        key: 'de',
        url: `https://us-central1-digitaleyes-prod.cloudfunctions.net/offers-retriever?collection=${options.project}`,
        callback: handleDigitalEyesData
    }
};

function showProgramAddress (data) {
    let template = `${data.title}\n--------------------------------\n${data.description}\n\n`;
    let arr = [['Address', 'Share']];
    for (let x in data.creators) {
        let c = data.creators[x];
        arr.push([c.address, `${c.share}%`]);
    }
    process.stdout.write(template + table(arr));
    return 0;
}

/**
 * Callbacks list
 */
function handleMagicEdenData (resp) {
    let { results } = resp;
    let item = results[0];
    let creators = [];
    
    item.creators.sort((a, b) => a.share > b.share ? -1 : 1);

    for (let x in item.creators) {
        let c = item.creators[x];
        if (c.share > 0) { 
            creators.push({ address: c.address, share: c.share });
        }
    }

    showProgramAddress({
        title: item.collectionTitle,
        description: item.content,
        createdAt: item.createdAt,
        creators
    });
}

async function handleDigitalEyesData (resp) {
    let { offers } = resp;
    let item = offers[0];
    let creators = [];
    // Handle NFT Collection Description
    const { data } = await axios.get(`https://us-central1-digitaleyes-prod.cloudfunctions.net/collection-retriever?collection=${item.collection}`);
    item.creators.sort((a, b) => a.Share > b.Share ? -1 : 1);
    for (let x in item.creators) {
        let c = item.creators[x];
        if (c.Share > 0) { 
            creators.push({ address: c.Address, share: c.Share });
        }
    }
    showProgramAddress({
        title: data.name,
        description: data.description,
        createdAt: '-',
        creators
    })
}


(async () => {
    try {
        const mpTable = Object.keys(MARKETPLACES);
        let marketplaceId = mpTable.indexOf(options.marketplace || MARKETPLACE_BY_DEFAULT);
        let marketplace = MARKETPLACES[mpTable[marketplaceId]];
        const { data } = await axios.get(marketplace.url);
        let ret = marketplace.callback(data);
    } catch (err) {
        console.log(err);
    }
})();