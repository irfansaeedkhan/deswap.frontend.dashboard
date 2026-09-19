import conversionRateModal from "../../../models/conversion/conversionRate";
import moment from "moment";
import {dollarToMatic} from "../../../utils/common/tokenconversion"
import getMongoDBConnection from "../../../utils/connection/mongodbconnection";
import {responseBodyEncryptionUnprotected} from "../../../utils/common/jwtToken"
import unprotectedmiddleware from "../../../middleware/unprotectedmiddleware";

const DollarToMatic = async (req,res)=>{
    try{

        //1 BTC 1
        //1 BNB 1839
        //1 USD 1
        //1 USD 2781
        //1 MATIC 3890
        let deletDataTime = 50;
        let requestinterval = 20;
        let currentTime = await moment.utc();
        let amount = 1;

        let findLatestEntryWithTime = await moment.utc().subtract(4, "minutes");
        let deleteDataAfterTime = await moment.utc().subtract(20, "minutes");

        await getMongoDBConnection();
        
        let deleteLateEntry = await conversionRateModal.deleteMany({
            Symbol:"MATIC",
            created_at:{
                $lte:deleteDataAfterTime
            }
        });

        let findlatestEntry = await conversionRateModal.find({
            created_at:{
                $gte:findLatestEntryWithTime
            },
            Symbol:"MATIC"
        }).sort({'created_at': "asc"});

        if(!findlatestEntry||findlatestEntry.length>0){
            res.setHeader('response-security', true)
            return res.status(200).json({data:await responseBodyEncryptionUnprotected({data:findlatestEntry[0],error:null}), type:"noauth"});
        }

        //
        /*
        if((req.body.amount!=undefined)&&(req.body.amount!=null)){
            amount = req.body.amount
        }*/

        let dollarToMaticValue = await dollarToMatic(amount);

        if(!dollarToMaticValue.valid){
            //
            res.setHeader('response-security', true)
            res.status(200).json({data:await responseBodyEncryptionUnprotected({data:{PriceInUSD:0},error:"No Data"}), type:"noauth"});
            return;
        }

        let insertSymbol=[];
        let returnResult;

        insertSymbol.push({
            PriceInUSD:dollarToMaticValue.data,
            ID:3890,
            Symbol:"MATIC"
        });
        returnResult = {
            PriceInUSD:dollarToMaticValue.data,
            ID:3890,
            Symbol:"MATIC"
        }
        /*
        let result = await axios.get(`${process.env.NEXT_PUBLIC_COINMARKET_CAP_BASE}/data-api/v3/tools/price-conversion?amount=${amount}&id=2781&convert_id=3890`)
        
        if(!result){
            res.setHeader('response-security', true)
            res.status(200).json({data:await responseBodyEncryptionUnprotected({data:{PriceInUSD:0},error:"No Data"}), type:"noauth"});
            return;
        }
  
        if(!result.data.data){
            res.setHeader('response-security', true)
            res.status(200).json({data:await responseBodyEncryptionUnprotected({data:{PriceInUSD:0},error:"No Data"}), type:"noauth"});
            return;
        }

        let conversionData = result.data.data;
        let quotedData = conversionData.quote;
        
        let returndata = 0;
        let returnResult;
        let insertSymbol=[];
        for(let index in quotedData){
            //
            if(quotedData[index].cryptoId==3890){
                //
                //returndata = quotedData[index].price;
                insertSymbol.push({
                    PriceInUSD:quotedData[index].price,
                    ID:3890,
                    Symbol:"MATIC"
                });
                returnResult = {
                    PriceInUSD:quotedData[index].price,
                    ID:3890,
                    Symbol:"MATIC"
                }
            }
        }
        */
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

export default unprotectedmiddleware(DollarToMatic);