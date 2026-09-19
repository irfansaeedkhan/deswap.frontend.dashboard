import axios from "axios";

const fetchAllCurrenyExchangeValue = async() =>{
    try{
        const axiosinstance = axios.create({
            /*headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers':'Origin, Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': 86400
            }*/
        });
        let result = await axiosinstance.get(`${process.env.NEXT_PUBLIC_NOMICS_BASE_URL}`+"exchange-rates?key="+`${process.env.NEXT_PUBLIC_NOMICS_API_Key}`);
        
        return {success:true, data:result.data}
    }catch(e){
        return {success:false,data:null}
    }
}

const fetchCurrenyExchangeValue = async(currency="BNB") =>{
    try{
        let result = await fetchAllCurrenyExchangeValue();
        if(!result.success){
            return {success:false,data:null}
        }

        let currencyValue = result.data.find((data)=>{
            if(data.currency==currency){
                return data;
            }
        });
        //console.log("Currency : ",currencyValue);
        if(currencyValue){
            //console.log(currencyValue);
            return {success:true,data:currencyValue}        
        }

        return {success:false,data:null}
    }catch(e){
        return {success:false,data:null}
    }
}

const convertUSDToCrypto = async(usdAmount=1,currency="BNB") =>{
    try{
        
        let result = await fetchCurrenyExchangeValue(currency);

        if(!result.success){
            return {success:false,data:null}
        }
        
        let OneBNBRate = result.data.rate;
        
        let OneUSDBNB = 1/OneBNBRate;
        
        //console.log("One USD Price in BNB ",OneUSDBNB);
        if(isNaN(OneUSDBNB)){
            return {success:false,data:null};
        }
        
        //console.log("After roud of price in BNB ",OneUSDBNB*usdAmount);
        let BNBValue = Number(Number(OneUSDBNB)*usdAmount);
        
        if(isNaN(BNBValue)){
            return {success:false,data:null};
        }

        return {success:true,data:{amount:BNBValue,rate:OneUSDBNB}};

    }catch(e){
        return {success:false,data:null}
    }
}

module.exports.fetchAllCurrenyExchangeValue = fetchAllCurrenyExchangeValue;
module.exports.fetchCurrenyExchangeValue = fetchCurrenyExchangeValue;
module.exports.convertUSDToCrypto = convertUSDToCrypto;