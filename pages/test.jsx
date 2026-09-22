import React, { useEffect, useState } from "react";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { listNFTsCollectedByUser } from "../subgraph/query";

export default function Test() {
  const fetchCollection = async () => {
    try {
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(listNFTsCollectedByUser),
        variables: {
          first: 5,
          skip: 0,
          ownerAddress: "0xbf9c32cbd7602d3b279e1f141d1401680a1c5d88",
        },
        fetchPolicy: "cache-first",
      });

      console.log("Fetching data : ", data);
    } catch (error) {
      console.log("testing ", error);
    }
  };

  /**
  const fetchNFTCreatedByUser = async () => {
    try {
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(listNFTsCreatedByUser),
        variables: {
          first: 5,
          skip: 0,
          creatorAddress: "0xbf9c32cbd7602d3b279e1f141d1401680a1c5d88",
        },
        fetchPolicy: "cache-first",
      });

      console.log("Fetching data : ", data);
    } catch (error) {
      console.log("testing ", error);
    }
  };
  */

  /*
  const fetchNFTInCollection = async () => {
    try {
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(listNFTsInCollection),
        variables: {
          first: 5,
          skip: 0,
          collectionAddress: "0xf95102a5ed674bdb63945c1f1d757cf2b9c3048d",
        },
        fetchPolicy: "cache-first",
      });

      console.log("Fetching data : ", data);
    } catch (error) {
      console.log("testing ", error);
    }
  }; 
  */
  /*
  Pass user address and 
  const fetchCollectionByAddress = async () => {
    try {
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(listCollectionByAccount),
        variables: {
          first: 5,
          skip: 0,
          creator: "0xbf9c32cbd7602d3b279e1f141d1401680a1c5d88",
        },
        fetchPolicy: "cache-first",
      });

      console.log("Fetching data : ", data);
    } catch (error) {
      console.log("testing ", error);
    }
  };
  */

  /*
  const fetchCollectionBySymbol = async () => {
    try {
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(listCollectionBySymbol),
        variables: {
          first: 5,
          skip: 0,
          collectionSymbol: "RYOY",
        },
        fetchPolicy: "cache-first",
      });

      console.log("Fetching data : ", data);
    } catch (error) {
      console.log("testing ", error);
    }
  };*/

  useEffect(() => {
    void (async () => {
    try {
      // const client = new ApolloClient({
      //   uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
      //   cache: new InMemoryCache(),
      // });
      // const { data } = await client.query({
      //   query: gql(listCollectionBySymbol),
      //   variables: {
      //     first: 5,
      //     skip: 0,
      //     collectionSymbol: "C",
      //   },
      //   fetchPolicy: "cache-first",
      // });

      //console.log("Fetching data : ", data);

      await fetchCollection();
    } catch (error) {
      console.log("testing ", error);
    }
      })();
  }, []);
  return <div></div>;
}
