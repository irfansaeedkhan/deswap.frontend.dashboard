import axios from "axios"
import conversionRateModal from "../../../models/conversion/conversionRate";
import moment from "moment";
import getMongoDBConnection from "../../../utils/connection/mongodbconnection";
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
        let deletDataTime = 50;
        let requestinterval = 20;
        let currentTime = await moment.utc();
        let amount = 1;

        let findLatestEntryWithTime = await moment.utc().subtract(4, "minutes");
        let deleteDataAfterTime = await moment.utc().subtract(20, "minutes");

        await getMongoDBConnection();
        
        let deleteLateEntry = await conversionRateModal.deleteMany({
            Symbol:"DAW",
            created_at:{
                $lte:deleteDataAfterTime
            }
        });

        let findlatestEntry = await conversionRateModal.find({
            created_at:{
                $gte:findLatestEntryWithTime
            },
            Symbol:"DAW"
        }).sort({'created_at': "asc"});

        if(!findlatestEntry||findlatestEntry.length>0){
            res.setHeader('response-security', true)
            return res.status(200).json({data:await responseBodyEncryptionUnprotected({data:findlatestEntry[0],error:null}),type:"noauth"});
        }

        //
        /*
        if((req.body.amount!=undefined)&&(req.body.amount!=null)){
            amount = req.body.amount
        }*/

        /*
        let result = await axios.get(`${process.env.NEXT_PUBLIC_COINMARKET_CAP_BASE}/data-api/v3/tools/price-conversion?amount=${amount}&id=2781&convert_id=11619`)
        
        if(!result){
            res.status(200).json({data:{PriceInUSD:0},error:"No Data"});
            return;
        }
  
        if(!result.data.data){
            res.status(200).json({data:{PriceInUSD:0},error:"No Data"});
            return;
        }

        /*if(!result.data.data){
            res.status(200).json({ conversion: 0, error:null ,success: false});
            return;
        }
        let conversionData = result.data.data;
        let quotedData = conversionData.quote;
        
        let returndata = 0;
        let returnResult;
        
        for(let index in quotedData){
            //
            if(quotedData[index].cryptoId==11619){
                //
                //returndata = quotedData[index].price;
                insertSymbol.push({
                    PriceInUSD:quotedData[index].price,
                    ID:11619,
                    Symbol:"DAW"
                });
                returnResult = {
                    PriceInUSD:quotedData[index].price,
                    ID:11619,
                    Symbol:"DAW"
                }
            }
        }*/
        let dollatToDeswapValue  = await dollarToDeswap(amount)
        let insertSymbol=[];
        let returnResult;
        
        insertSymbol.push({
            PriceInUSD:dollatToDeswapValue.data,
            ID:11619,
            Symbol:"DAW"
        });

        returnResult = {
            PriceInUSD:dollatToDeswapValue.data,
            ID:11619,
            Symbol:"DAW"
        }
        //
        //res.status(200).json({ conversion: quotedData[index].price, error:null,conversionRate:quotedData[index].price/amount, success:true});
        //return;
        let saveresult =await conversionRateModal.insertMany(insertSymbol);
        
        res.setHeader('response-security', true)
        res.status(200).json({data:await responseBodyEncryptionUnprotected({data:returnResult,error:null}), type:"noauth"});
        return;
    }catch(e){
        console.log("Error : ",e)
        res.setHeader('response-security', true)
        res.status(200).json({data:await responseBodyEncryptionUnprotected({data: {PriceInUSD:0}, error:null }), type:"noauth"});
    } 
}
//conversion: 0, error:null, success: false


export default unprotectedmiddleware(DollarToDeswap);