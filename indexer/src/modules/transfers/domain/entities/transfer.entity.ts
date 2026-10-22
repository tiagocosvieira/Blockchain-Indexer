import { Entity, PrimaryColumn, Column, Index } from "typeorm";

@Entity("transfers")
export class TransferEntity{

    @PrimaryColumn({ type: "varchar", length: 255 })
    id: string;

    @Index()
    @Column({type:"varchar",length: 255})
    transactionHash: string;


    @Index()
    @Column({type:"varchar",length:255})
    fromAddress: string;

    @Index()
    @Column({type:"varchar",length:255})
    toAddress: string;



    constructor(
        id: string,
        fromAddress: string,
        toAddress: string,
        transactionHash: string,
    ){
        this.id = id;
        this.transactionHash = transactionHash;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
    }
    
}