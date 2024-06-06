import CoinKey from 'coinkey';

const generatePublicKeyFromPrivateKey = (privateKey) => {
    const  publicKey = new CoinKey(new Buffer.from(privateKey, 'hex'));
    publicKey.compressed = true;
    return publicKey.publicAddress;
}

const generateWifFromPrivateKey = (privateKey) => {
    const  wif = new CoinKey(new Buffer.from(privateKey, 'hex'));
    return wif.privateWif;
}

const showProgress = (startTime, number) => {
    if ((Date.now() - startTime) % 10000 === 0) {
        console.log('Progress: ', number.toString(16).padStart(14, '0'));
    }
}

const targetPublicKey = '18bHfcm8kGoAhBaQXzzVcG5534mdpWK981';
const prefixPrivateKey = 'C0DE000000000000000000000000000000000000000000003';
const startNumber = 'F'.repeat(64 - prefixPrivateKey.length);

console.log(`Target public key: ${targetPublicKey}`);
console.log(`Prefix private key: ${prefixPrivateKey} (${prefixPrivateKey.length})`);
console.log(`Start number: ${startNumber}`);


const startTime = Date.now();

for (let number = BigInt(`0x${startNumber}`); number > 0; number = number - BigInt(1)) {
    const privateKey = prefixPrivateKey + number.toString(16).padStart(14, '0');
    showProgress(startTime, number);
    const publicKey = generatePublicKeyFromPrivateKey(privateKey);
    if (publicKey === targetPublicKey) {
        console.log('Private key found!');
        console.log(`WIF: ${generateWifFromPrivateKey(privateKey)}`);
        break;
    }
}
