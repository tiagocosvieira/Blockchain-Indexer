interface event{
    name: string;
    signature: string;
}

interface OptimisticContract{
    identifier: string;
    abi: string[];
    address: string; 
    eventToIndex: OptimisticEvent;
    startId: number; 
    disable?: boolean;

}

interface OptimisticEvent{
    eventName: string;
    arguments: string[];
}