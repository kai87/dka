const ipfsClient = require('ipfs-http-client')
// or using options
const ipfs = ipfsClient({host: 'localhost', port: '5001', protocol: 'http'});
export default ipfs;