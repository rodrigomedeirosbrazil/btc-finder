import CoinKey from 'coinkey';

const PRIVATE_KEY_LENGTH = 64;

const generatePublicKeyFromPrivateKey = (privateKey) => {
    const  publicKey = new CoinKey(new Buffer.from(privateKey, 'hex'));
    publicKey.compressed = true;
    return publicKey.publicAddress;
}

const generateWifFromPrivateKey = (privateKey) => {
    const  wif = new CoinKey(new Buffer.from(privateKey, 'hex'));
    return wif.privateWif;
}

const showProgress = (startTime, number, startNumber, targetNumber) => {
    if ((Date.now() - startTime) % 10000 === 0) {
        console.log('Progress: ', number.toString(16).padStart(14, '0'));
    }
}

const generatePrivateKeyUsingPrefix = (prefix, number) => {
    const prefixLength = prefix.length;
    const hexNumber = number.toString(16);
    return prefix + hexNumber.padStart(PRIVATE_KEY_LENGTH - prefixLength, '0');
}

const generateHighestStartNumber = (prefixPrivateKey) => {
    return 'F'.repeat(PRIVATE_KEY_LENGTH - prefixPrivateKey.length);
}

const targetPublicKey = '18bHfcm8kGoAhBaQXzzVcG5534mdpWK981';
const prefixPrivateKey = 'C0DE000000000000000000000000000000000000000000003';
const startNumber = 'fffffffdd134ec8'; //generateHighestStartNumber(prefixPrivateKey);

console.log(`Target public key: ${targetPublicKey}`);
console.log(`Prefix private key: ${prefixPrivateKey} (${prefixPrivateKey.length})`);
console.log(`Start number: ${startNumber}`);


const startTime = Date.now();

for (let number = BigInt(`0x${startNumber}`); number > 0; number = number - BigInt(1)) {
    const privateKey = generatePrivateKeyUsingPrefix(prefixPrivateKey, number);
    showProgress(startTime, number, startNumber, 0);
    const publicKey = generatePublicKeyFromPrivateKey(privateKey);
    if (publicKey === targetPublicKey) {
        console.log('Private key found!');
        console.log(`WIF: ${generateWifFromPrivateKey(privateKey)}`);
        break;
    }
}
