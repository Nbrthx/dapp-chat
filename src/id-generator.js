function upid(){
    const astr = "bcdfghjklmnpqrstvwxyz"
    const vstr = "aiueo"
    const nstr = "abcdefghijklmnopqrstuvwxyz"
    let text = ""
    for(let i = 0; i < 6; i++){
        const rand = Math.floor(Math.random() * astr.length)
        const rand2 = Math.floor(Math.random() * vstr.length)
        text += astr[rand]+vstr[rand2]
    }
    text += "-"
    for(let i = 0; i < 4; i++){
        const rand = Math.floor(Math.random() * nstr.length)
        text += nstr[rand]
    }
    return text
}



function peerid(psph){
    const npp = psph.replace("-","")
    if(npp.length != 16) return false
    const astr = "abcdefghijklmnopqrstuvwxyz"
    const vstr = "aiueo"
    let text = ""
    let text2 = ""
    let prev = 1
    
    for(let i = 0; i < 16; i++){
        let strint = astr.indexOf(npp[i])+1
        let strint2 = astr.indexOf(npp[npp.length-i])+1
        
        text += strint*prev+1024+i
        text2 += strint2*prev*2+2048+npp.length-i
        
        prev = Math.floor((strint+strint2)/2)
    }
    
    let newtext = ""
    text = text.match(/.{1,16}/g)
    text2 = text2.match(/.{1,16}/g)
    let word = 0
    let word2 = 0
    for(let i of text) word += parseInt(i)
    for(let i of text2) word2 += parseInt(i)
    word = word.toString(36)+word2.toString(36)
    for(let i of word) newtext += i
    
    return newtext
}

module.exports = { upid, peerid }