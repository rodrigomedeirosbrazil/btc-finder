import CoinKey from 'coinkey';
import { intervalToDuration } from 'date-fns';

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

const zeroPad = (num) => {
    if (!num) {
        return '00';
    }
    return String(num).padStart(2, '0')
}

const getTimeElapsed = (startTime) => {
    const duration = intervalToDuration({ start: 0, end: (Date.now() - startTime)});
    return `${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`;
}

const generateRandomHex = (length) => {
    return Array(length)
    .fill()
    .map(() => Math.round(Math.random() * 0xF).toString(16))
    .join('');
}

// const targetPublicKey = '1HduPEXZRdG26SUT5Yk83mLkPyjnZuJ7Bm';
// const prefixPrivateKey = '00000000000000000000000000000000000000000000000000000000000';

const targetPublicKey = '18bHfcm8kGoAhBaQXzzVcG5534mdpWK981';
const prefixPrivateKey = 'C0DE000000000000000000000000000000000000000000003';

console.log(`Target public key: ${targetPublicKey}`);
console.log(`Prefix private key: ${prefixPrivateKey} (${prefixPrivateKey.length})`);

const startTime = Date.now();
const postfixLength = PRIVATE_KEY_LENGTH - prefixPrivateKey.length;

let postfix;
let privateKey;
let publicKey;

while (true) {
    postfix = generateRandomHex(postfixLength);
    privateKey = prefixPrivateKey + postfix;
    try {
        publicKey = generatePublicKeyFromPrivateKey(privateKey);
    } catch (error) {
        continue;
    }

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(
        `Elapsed time: ${getTimeElapsed(startTime)} ` +
        `Last privateKey: ${privateKey} `
    );

    if (publicKey === targetPublicKey) {
        console.log('');
        console.log('Private key found!')
        console.log(privateKey);
        console.log(`WIF: ${generateWifFromPrivateKey(privateKey)}`);
        break;
    }
}
