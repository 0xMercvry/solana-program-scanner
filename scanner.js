
const axios = require('axios');
const { argv, env, exit } = process;

const _PID = 2;

if (!argv[_PID]) {
    console.log(`no ME project ID specified. See README.md`);
    exit(1);
}

const _COL_SYMBOL_ = argv[_PID];
const _PROGRAM_URL_ = `https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q={"$match":{"collectionSymbol":"${_COL_SYMBOL_}"},"$sort":{"takerAmount":1,"createdAt":-1},"$skip":0,"$limit":20}`;

const getProgramContract = async () => {
    try {
        const res = await axios.get(`${_PROGRAM_URL_}`);
        if (!res.data) {
            console.log(`unable to find ${_COL_SYMBOL_} on ME marketplace`);
            return ;
        }
        const { results } = res.data;
        if (!results[0] && typeof results[0] != 'object') {
            console.log(`no listed tokens for now.`);
            return ;
        }
        printTokenInformations(results[0]);
    } catch (err) {
        console.log(err);
        exit(2);
    }
};

getProgramContract();

const printTokenInformations = (data) => {
    console.log(`${data.collectionTitle}`);
    console.log(`${data.content}`);
    console.log(`===================================`);
    data.creators.sort((a, b) => a.verified > b.verified ? -1 : 1);
    const creator = data.creators[0];
    if (creator && typeof creator == 'object' && creator.verified === 1) {
        console.log(`Program address: ${creator.address}`);
    }
    console.log(`===================================`);
}