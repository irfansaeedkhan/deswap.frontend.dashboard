/**
 * List all the collections
 */
export const listAllCollections = `
  query($first: Int!, $skip: Int!) {
    createCollections(
      orderBy: blockTimestamp
      orderDirection: desc,
      first: $first,
      skip: $skip
    ) {
      id,
      _collection,
      _collectionName,
      _collectionSymbol,
      _maxSupply,
      _uri,
      _creator,
      blockNumber,
      blockTimestamp,
      transactionHash
    }
  }
`;

export const likedCollections = `
  query($id: [Bytes!]) {
    createCollections(
      orderBy: blockTimestamp
      orderDirection: desc,
      where: {id_in: $id}
    ) {
      id,
      _collection,
      _collectionName,
      _collectionSymbol,
      _maxSupply,
      _uri,
      _creator,
      blockNumber,
      blockTimestamp,
      transactionHash
    }
  }
`;
/**
 * List all the collection created by account
 */
export const listCollectionByAccount = `
  query($first: Int!, $skip: Int!, $creator: Bytes!) {
    createCollections(
      orderBy: blockTimestamp
      orderDirection: desc,
      first: $first,
      skip: $skip
      where: {_creator: $creator}
    ) {
      id
      _creator
      _uri
      _collectionName
      _collectionSymbol
      _maxSupply
      transactionHash
      blockTimestamp
      _collection
    }
  }
`;

/**
 * List collection by symbol
 */
export const listCollectionBySymbol = `
  query($first: Int!, $skip: Int!, $collectionSymbol: String!) {
    createCollections(
      orderBy: blockTimestamp
      orderDirection: desc,
      first: $first,
      skip: $skip
      where: {_collectionSymbol: $collectionSymbol}
    ) {
      id
      _creator
      _uri
      _collectionName
      _collectionSymbol
      _maxSupply
      transactionHash
      blockTimestamp
      _collection
    }
  }
`;

export const listNFTsInCollection = `
  query($first: Int!, $skip: Int!,  $collectionAddress: Bytes!) {
    createItems(
      orderBy: blockTimestamp
      orderDirection: desc,
      first: $first,
      skip: $skip,
      where: {_collection: $collectionAddress}
    ) {
      id,
      _collection,
      _tokenID,
      _tokenURI,
      _price,
      _creator,
      blockNumber,
      blockTimestamp,
      transactionHash
    }
  }
`;

export const listNFTInID = `
  query($id: String!) {
    createItems(
      where: {id: $id}
    ) {
      id,
      _collection,
      _tokenID,
      _tokenURI,
      _price,
      _creator,
      blockNumber,
      blockTimestamp,
      transactionHash
    }
  }
`;

export const likedNFTs = `
  query($id: [Bytes!]) {
    createItems(
      where: {id_in: $id}
    ) {
      id,
      _collection,
      _tokenID,
      _tokenURI,
      _price,
      _creator,
      blockNumber,
      blockTimestamp,
      transactionHash
    }
  }
`;

export const listNFTsCreatedByUser = `
  query($first: Int!, $skip: Int!,  $creatorAddress: Bytes!) {
    createItems(
      orderBy: blockTimestamp
      orderDirection: desc,
      first: $first,
      skip: $skip,
      where: {_creator: $creatorAddress}
    ) {
      id,
      _collection,
      _tokenID,
      _tokenURI,
      _price,
      _creator,
      blockNumber,
      blockTimestamp,
      transactionHash
    }
  }
`;

export const listNFTsCollectedByUser = `
  query($first: Int!, $skip: Int!,  $ownerAddress: Bytes!) {
    marketItemCreateds(
      orderBy: blockTimestamp
      orderDirection: desc,
      first: $first,
      skip: $skip,
      where: {seller: $ownerAddress}
    ) {
        id,
        colleciion,
        tokenId,
        _tokenURI,
        seller,
        owner,
        price,
        sold,
        blockNumber,
        blockTimestamp,
        transactionHash,
      }
  }
`;
