import sha256 from "crypto-js/sha256"
let senc = sha256

export class Block{
    constructor(data, prevHash){
        this.data = data
        this.timestamp = new Date().toJSON()
        this.prevHash = prevHash
        this.hash = this.calcHash()
        this.nonce = 0
    }

    calcHash(){
        return senc(JSON.stringify(this.data)+this.time+this.prevHash+this.nonce).toString()
    }

    mined(){
        while(this.hash.substring(0,3) !== "3b8"){
            this.nonce += 1
            this.hash = this.calcHash()
        }
        console.log("Mined with hash "+this.hash+" in "+this.nonce+" nonce")
    }
}

export class Blockchain{
    constructor(chain = []){
        this.chain = chain[0] ? chain : [this.gensBlock()]
    }

    gensBlock(){
        return new Block({}, "0")
    }
    latestBlock(){
        return this.chain[this.chain.length-1]
    }
    addBlock(data){
        const prevHash = this.latestBlock().hash
        const newBlock = new Block(data, prevHash)
        newBlock.mined()
        this.chain.push(newBlock)
    }
    isValidChain(){
        for(let i = 1; i < this.chain.length; i++){
            return this.chain[i].hash !== this.chain[i].calcHash() ||
            this.chain[i].prevHash !== this.chain[i-1].hash
        }
        return true
    }
}