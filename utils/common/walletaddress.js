module.exports.reducedWalletAddress = (walletaddress)=>{
    try{
    return walletaddress?.substring(0, 6)+"...." +walletaddress?.substring(walletaddress?.length - 4);
    } catch(e){
        return "";
    } 
}