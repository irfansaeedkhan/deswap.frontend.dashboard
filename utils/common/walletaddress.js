module.exports.reducedWalletAddress = (walletaddress)=>{
    try{
    return walletaddress?.substring(0, 6)+"...." +walletaddress?.substring(walletaddress?.length - 4);
    } catch(e){
        return "";
    } 
}
// DEMO SAFETY (round 3): explorer links are built from
// NEXT_PUBLIC_POLYGON_SCANLINK. In preview builds that variable is unset,
// so `${undefined}address/...` resolved inside the app and produced 404
// pages like /user/dashboard/address/<wallet>. Return null when no
// explorer base is configured so callers render plain text instead of a
// dead link; never invent an explorer URL.
module.exports.explorerAddressUrl = (walletaddress)=>{
    try{
        const base = process.env.NEXT_PUBLIC_POLYGON_SCANLINK;
        if(!base || !walletaddress) return null;
        const withSlash = String(base).endsWith("/") ? String(base) : `${base}/`;
        return `${withSlash}address/${walletaddress}`;
    } catch(e){
        return null;
    }
}
// Same rule for transaction links: null when no explorer base is set.
module.exports.explorerTxUrl = (txhash)=>{
    try{
        const base = process.env.NEXT_PUBLIC_POLYGON_SCANLINK;
        if(!base || !txhash) return null;
        const withSlash = String(base).endsWith("/") ? String(base) : `${base}/`;
        return `${withSlash}tx/${txhash}`;
    } catch(e){
        return null;
    }
}