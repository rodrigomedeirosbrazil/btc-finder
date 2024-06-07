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

const calcTimeRemaining = (startTime, number, startNumber, targetNumber) => {
    const duration = intervalToDuration({ start: 0, end: (Date.now() - startTime)});
    const progress = calculateProgress(startNumber, targetNumber, number);
    const timeRemaining = (duration.seconds / progress) * (100 - progress);
    return `${zeroPad(Math.floor(timeRemaining / 3600))}:${zeroPad(Math.floor((timeRemaining % 3600) / 60))}:${zeroPad(Math.floor(timeRemaining % 60))}`;
}

const generatePrivateKeyUsingPrefix = (prefix, number) => {
    const prefixLength = prefix.length;
    const hexNumber = number.toString(16);
    return prefix + hexNumber.padStart(PRIVATE_KEY_LENGTH - prefixLength, '0');
}

const generateHighestStartNumber = (prefixPrivateKey) => {
    return 'F'.repeat(PRIVATE_KEY_LENGTH - prefixPrivateKey.length);
}

// const targetPublicKey = '1HduPEXZRdG26SUT5Yk83mLkPyjnZuJ7Bm';
// const prefixPrivateKey = '00000000000000000000000000000000000000000000000000000000000';
// const startNumber = generateHighestStartNumber(prefixPrivateKey);

const targetPublicKey = '18bHfcm8kGoAhBaQXzzVcG5534mdpWK981';
const prefixPrivateKey = 'C0DE000000000000000000000000000000000000000000003';
const startNumber = 'fffffffdc2b6b67';

console.log(`Target public key: ${targetPublicKey}`);
console.log(`Prefix private key: ${prefixPrivateKey} (${prefixPrivateKey.length})`);
console.log(`Start number: ${startNumber}`);


const startTime = Date.now();

for (let number = BigInt(`0x${startNumber}`); number > 0; number = number - BigInt(1)) {
    const privateKey = generatePrivateKeyUsingPrefix(prefixPrivateKey, number);
    const publicKey = generatePublicKeyFromPrivateKey(privateKey);

    if ((Date.now() - startTime) % 1000 === 0) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(
            `Elapsed time: ${getTimeElapsed(startTime)} ` +
            `Remaining time: ${calcTimeRemaining(startTime, number, startNumber, BigInt(0))} ` +
            `Progress: ` + calculateProgress(startNumber, BigInt(0), number).toFixed(0) + '%' +
            ` Last number tried: ${number.toString(16).padStart(14, '0')}`
        );
    }

    if (publicKey === targetPublicKey) {
        console.log('');
        console.log('Private key found!')
        console.log(privateKey);
        console.log(`WIF: ${generateWifFromPrivateKey(privateKey)}`);
        break;
    }
}
