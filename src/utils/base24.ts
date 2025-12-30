import crypto from"crypto";

const BASE24_CHARS="0123456789abcdefghijkmnpqrs";
const BASE=BASE24_CHARS.length;

export function generateBase24Id(minLength=6):string{
    let id="";
    while(id.length<minLength){
        const byte=crypto.randomBytes(1)[0];
        id+=BASE24_CHARS[byte% BASE];
    }
    return id;
}