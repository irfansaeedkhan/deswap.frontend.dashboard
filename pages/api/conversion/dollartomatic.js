import axios from "axios"
import {responseBodyEncryptionUnprotected} from "../../../utils/common/jwtToken"
import {dollarToMatic} from "../../../utils/common/tokenconversion";
import unprotectedmiddleware from "../../../middleware/unprotectedmiddleware";


const DollarToMatic = async (req,res)=>{
    try{
        //1 BTC 1
        //1 BNB 1839
        //1 USD 1
        //1 USD 2781
        //1 MATIC 3890
        let amount = 1;
        if((req.body.amount!=undefined)&&(req.body.amount!=null)){
            amount = req.body.amount
        }

        let result = await dollarToMatic(amount);
        /*
        let result = await axios.get(`${process.env.NEXT_PUBLIC_COINMARKET_CAP_BASE}/data-api/v3/tools/price-conversion?amount=${amount}&id=2781&convert_id=3890`)
        
        if(!result.data.data){
            res.status(200).json({ conversion: 0, error:null ,success: false});
            return;
        }
        let conversionData = result.data.data;
        let quotedData = conversionData.quote;
        

        
        //dollarToMatic
        let returndata = 0;
        for(let index in quotedData){
            //
            if(quotedData[index].cryptoId==3890){
                //
                //returndata = quotedData[index].price;
                res.status(200).json(await responseBodyEncryptionUnprotected({ conversion: quotedData[index].price, error:null,conversionRate:quotedData[index].price/amount, success:true}));
                return;
            }
        }
        
        */
        res.setHeader('response-security', true)
        res.status(200).json({data:await responseBodyEncryptionUnprotected({ conversion: result.data, error:null , conversionRate:result.conversionrate, success:true}),type:"noauth"});
        return;
    }catch(e){
        console.log("Error : ",e)
        res.setHeader('response-security', true)
        res.status(200).json({data:await responseBodyEncryptionUnprotected({conversion: 0, error:null, success: false}),type: "noauth"});
    } 
}

export default unprotectedmiddleware(DollarToMatic);