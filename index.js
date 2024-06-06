import CoinKey from 'coinkey';
import { intervalToDuration } from 'date-fns'

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
        console.log('Elapsed time: ', (Date.now() - startTime) / 1000, ' seconds');
        console.log('Progress: ', (BigInt(`0x${startNumber}`) - number) / BigInt(`0x${startNumber}`) * 100, '%');
        console.log('Last number tried: ', number.toString(16).padStart(14, '0'));
    }
}

const calculateProgress = (startNumber, targetNumber, number) => {
    const range = BigInt(`0x${startNumber}`) - BigInt(`0x${targetNumber}`);
    return Number(BigInt(`0x${startNumber}`) - number) / Number(range) * 100;
}

const generatePrivateKeyUsingPrefix = (prefix, number) => {
    const prefixLength = prefix.length;
    const hexNumber = number.toString(16);
    return prefix + hexNumber.padStart(PRIVATE_KEY_LENGTH - prefixLength, '0');
}

const generateHighestStartNumber = (prefixPrivateKey) => {
    return 'F'.repeat(PRIVATE_KEY_LENGTH - prefixPrivateKey.length);
}

const targetPublicKey = '1CQFwcjw1dwhtkVWBttNLDtqL7ivBonGPV'; // '18bHfcm8kGoAhBaQXzzVcG5534mdpWK981';
const prefixPrivateKey = '0000000000000000000000000000000000000000000000000000000000000'; //'C0DE000000000000000000000000000000000000000000003';
const startNumber = generateHighestStartNumber(prefixPrivateKey); // 'fffffffdc2b6b67'; //generateHighestStartNumber(prefixPrivateKey);

console.log(`Target public key: ${targetPublicKey}`);
console.log(`Prefix private key: ${prefixPrivateKey} (${prefixPrivateKey.length})`);
console.log(`Start number: ${startNumber}`);


const startTime = Date.now();

for (let number = BigInt(`0x${startNumber}`); number > 0; number = number - BigInt(1)) {
    const privateKey = generatePrivateKeyUsingPrefix(prefixPrivateKey, number);
    const publicKey = generatePublicKeyFromPrivateKey(privateKey);
    console.log(calculateProgress(startNumber, BigInt(0), number).toFixed(0), '%');
    if (publicKey === targetPublicKey) {
        console.log(`Private key found!: ${privateKey}`);
        console.log(`WIF: ${generateWifFromPrivateKey(privateKey)}`);
        break;
    }
}
