import axios from "axios"
import {responseBodyEncryptionUnprotected} from "../../../utils/common/jwtToken"
import {dollarToDeswap} from "../../../utils/common/tokenconversion"
import unprotectedmiddleware from "../../../middleware/unprotectedmiddleware";

const DollarToDeswap = async (req,res)=>{
    try{
        //1 BTC 1
        //1 BNB 1839
        //1 USD 1
        //1 USD 2781
        //1 MATIC 3890
        //1 DESWAP 11619
        let amount = 1;
        if((req.body.amount!=undefined)&&(req.body.amount!=null)){
            amount = req.body.amount
        }

        let dollatToDeswapValue  = await dollarToDeswap(amount)
        /*
        let result = await axios.get(`${process.env.NEXT_PUBLIC_COINMARKET_CAP_BASE}/data-api/v3/tools/price-conversion?amount=${amount}&id=2781&convert_id=11619`)
        
        if(!result.data.data){
            res.status(200).json(await responseBodyEncryptionUnprotected({ conversion: 0, error:null ,success: false}));
            return;
        }
        let conversionData = result.data.data;
        let quotedData = conversionData.quote;
        
        let returndata = 0;
        for(let index in quotedData){
            //
            if(quotedData[index].cryptoId==11619){
                //
                //returndata = quotedData[index].price;
                res.status(200).json(await responseBodyEncryptionUnprotected({ conversion: quotedData[index].price, error:null,conversionRate:quotedData[index].price/amount, success:true}));
                return;
            }
        }
        res.status(200).json(await responseBodyEncryptionUnprotected({ conversion: returndata, error:null , conversionRate:returndata/amount, success:true}));
        */
        res.setHeader('response-security', true)
        res.status(200).json({data:await responseBodyEncryptionUnprotected({ conversion: dollatToDeswapValue.data, error:null , conversionRate:dollatToDeswapValue.conversionrate, success:true}), type:"noauth"});
        return;
    }catch(e){
        console.log("Error : ",e)
        res.setHeader('response-security', true)
        res.status(200).json({data:await responseBodyEncryptionUnprotected({ conversion: 0, error:null, success: false}), type:"noauth"});
    } 
}

export default unprotectedmiddleware(DollarToDeswap);