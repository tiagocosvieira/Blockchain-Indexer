//import Database from './db'
import WebSocket from 'ws';
import * as dotenv from 'dotenv';
import { Alchemy, Network } from 'alchemy-sdk';
import {WebSocketProvider } from 'ethers'


dotenv.config();

const NETWORK = process.env.NETWORK || 'eth-sepolia'
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY 
const PING_INTERVAL = 30000;
const EXPECTED_PONG_BACK= 15000;

export const getProvider = (network: string, apiKey: string): WebSocketProvider =>{
    const wsUrl = `wss://${network}.g.alchemy.com/v2/${apiKey}`;
    const provider = new WebSocketProvider(wsUrl);

    const ws = provider.websocket as any;

    let pingInterval: NodeJS.Timeout | null = null;
    let pingTimeout: NodeJS.Timeout  | null = null;

    ws.on('open', ()=>{
        console.log("WebSocket connection successfully established!");

        pingInterval = setInterval(() => {
            
            if(ws.readyState === ws.OPEN){
                ws.ping();
            }
            if(pingTimeout) clearTimeout(pingTimeout);
            pingTimeout = setTimeout(()=>{
                provider.websocket.close();
            }, EXPECTED_PONG_BACK);
        }, PING_INTERVAL);
    });
    
    ws.on('close', (code: number, reason: Buffer) => {
        console.error(`WebSocket closed (Code: ${code}). Restarting the service...`, reason.toString());
        if(pingInterval) clearInterval(pingInterval);
        if(pingTimeout) clearTimeout(pingTimeout);
        
        setTimeout(()=>{
            console.log('try to reconnect');
            getProvider(network, apiKey);
        }, 5000);
        
        // process.exit(1); 
    });

    ws.on('error', (error: Error) => {
        console.error('Erro no WebSocket:', error);
    });

    return provider; 
}

/*
async function getDatabase(postgres: string, dbName:string): Promise<Db>{
    const client = 
}*/