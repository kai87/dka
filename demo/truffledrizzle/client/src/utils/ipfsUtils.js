import multihashes from 'multihashes'

export function hash2multihash(hash) {
    const multihash = multihashes.fromB58String(Buffer.from(hash));
    const digest = '0x' + multihash.slice(2).toString('hex');
    const hashFunction = parseInt('0x' + multihash.slice(0, 1).toString('hex'));
    const size = multihash.length - 2;
    return {digest, hashFunction, size};
}

export function multihash2hash(digest, hashFunction, size) {
    return multihashes.toB58String(
        multihashes.fromHexString(
        parseInt(hashFunction).toString(16) + parseInt(size).toString(16) + digest.substr(2)
        )
    );
}