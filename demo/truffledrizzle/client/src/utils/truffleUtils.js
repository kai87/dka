export function timeConverter(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
}

export function getTx(drizzleState, stackId) {
    const {transactions, transactionStack} = drizzleState;
    const txHash = transactionStack[stackId];
    if (!txHash) return null;
    return transactions[txHash];
}

export function getTxStatus(drizzleState, stackId) {
    const tx = getTx(drizzleState, stackId);
    return tx && tx.status;
}

export function getShortAddress(address) {
    return `${address.slice(0,8)}...${address.slice(-5)}`
}

