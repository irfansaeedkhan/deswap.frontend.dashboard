import axios from "axios"
import {responseBodyEncryptionUnprotected} from "../../../utils/common/jwtToken"
import unprotectedmiddleware from "../../../middleware/unprotectedmiddleware";

const UsdtToMatic = async (req,res)=>{
    try{
        //1 BTC 1
        //1 BNB 1839
        //1 USD 1
        //1 USD 2781
        //1 MATIC 3890
        //1 USDT 825
        //1 MATIC 3890
        //1 DESWAP 11619
        let amount = 1;
        if((req.body.amount!=undefined)&&(req.body.amount!=null)){
            amount = req.body.amount
        }

        let result = await axios.get(`${process.env.NEXT_PUBLIC_COINMARKET_CAP_BASE}/data-api/v3/tools/price-conversion?amount=${amount}&id=825&convert_id=2781`)
        
        if(!result.data.data){
            res.setHeader('response-security', true);
            res.status(200).json({ conversion: 0, error:null ,success: false});
            return;
        }
        let conversionData = result.data.data;
        let quotedData = conversionData.quote;
        let returndata = 0;
        
        for(let index in quotedData){
            //
            if(quotedData[index].cryptoId==3890){
                res.setHeader('response-security', true);
                res.status(200).json(await responseBodyEncryptionUnprotected({ conversion: quotedData[index].price, error:null,conversionRate:quotedData[index].price/amount, success:true}));
                return;
            }
        }
        res.setHeader('response-security', true);
        res.status(200).json(await responseBodyEncryptionUnprotected({ conversion: returndata, error:null , conversionRate:returndata/amount, success:true}));
        return;
    }catch(e){
        res.setHeader('response-security', true);
        res.status(200).json(await responseBodyEncryptionUnprotected({ conversion: 0, error:null, success: false}));
    } 
}

export default UsdtToMatic;