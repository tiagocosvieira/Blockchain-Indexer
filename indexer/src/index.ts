import Database from './db'
import { Alchemy, Network } from 'alchemy-sdk';
import {WebSocketProvider } from 'ethers'


export const getProvider = (network:string, apiKey: string): WebSocketProvider =>{
    const alchemy = new Alchemy ({
        apiKey: process.env.API_KEY,
        network: network as Network,
    }) 

    const wsUrl = `wss://${network}.g.alchemy.com/v2/${apiKey}`;

    return new WebSocketProvider(wsUrl);
}