
export type HttpResponse = {
    results? // ME main object
    offers? // DE main object
};

export type ProgramAddress = {
    address: string,
    share: number
};

export type Marketplace = {
    key: string,
    getUrl: Function,
    callback: Function
};

export type MagicEdenNFT = {
    collectionName: string,
    collectionTitle: string,
    content: string,
    createdAt: Date,
    creators: ProgramAddress[]
};

export type DigitalEyesNFT = {
    creators: { Share: number, Address: string }[]
};

export interface Program {
    marketplace: string,
    title: string,
    description?: string,
    creators: ProgramAddress[]
};
