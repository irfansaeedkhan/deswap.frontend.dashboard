import getMongoDBConnection from "../../utils/connection/mongodbconnection.js";
import conversionRateModal from "../../models/conversion/conversionRate";
import axios from "axios";
import moment from "moment";
import { responseBodyEncryptionUnprotected } from "../../utils/common/jwtToken"
import unprotectedmiddleware from "../../middleware/unprotectedmiddleware"

const handler = async(req, res) => {
    try {
        /*
        if (req.method !== 'POST') {
            res.status(400).json({ data: null,error:"Invalid Method" });
            return;
        }*/

        await getMongoDBConnection();

        //In Minutes
        let symbolID = req.body.symbol;
        let deletDataTime = 50;
        let requestinterval = 20;
        let currentTime = await moment.utc();

        let findLatestEntryWithTime = await moment.utc().subtract(20, "minutes");
        let deleteDataAfterTime = await moment.utc().subtract(30, "minutes");

        let deleteLateEntry = await conversionRateModal.deleteMany({
            created_at: {
                $lte: deleteDataAfterTime
            }
        });

        let findlatestEntry = await conversionRateModal.find({
            created_at: {
                $gte: findLatestEntryWithTime
            },
            Symbol: symbolID
        }).sort({ 'created_at': "asc" });

        if (!findlatestEntry || findlatestEntry.length > 0) {
            res.setHeader('response-security', true)
            return res.status(200).json({data:await responseBodyEncryptionUnprotected({ data: findlatestEntry[0], error: null }), type:"noauth"});
        }

        //1 BTC 1
        //1 BNB 1839
        //1 USD 1
        //1 USDT 825
        //1 MATIC 3890
        //1 DESWAP 11619
        let coinID = "825,3890,11619";

        let result = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/cryptocurrency/quotes/latest?id=${coinID}`, {
            headers: {
                'X-CMC_PRO_API_KEY': `${process.env.NEXT_PUBLIC_API_KEY}`
            }
        }).catch((error) => {
            console.log("Request failed for conversion : ");
        })

        //let url =`${process.env.NEXT_PUBLIC_COINMARKETCAP_BASE_URL}/data-api/v3/tools/price-conversion?amount=1&id=${process.env.NEXT_PUBLIC_MATIC_CMC_ID}&convert_id=${process.env.NEXT_PUBLIC_USDT_CMC_ID},${process.env.NEXT_PUBLIC_DEW_CMC_ID}`;
        //await axios.get(url);

        if (!result) {
            res.setHeader('response-security', true)
            res.status(200).json({data:await responseBodyEncryptionUnprotected({ data: { PriceInUSD: 0 }, error: "No Data" }), type:"noauth"});
            return;
        }

        if (!result.data.data) {
            res.setHeader('response-security', true)
            res.status(200).json({data:await responseBodyEncryptionUnprotected({ data: { PriceInUSD: 0 }, error: "No Data" }), type:"noauth"});
            return;
        }
        let data = result.data.data;
        let insertSymbol = [];
        let returnResult;

        for (let index in data) {
            insertSymbol.push({
                PriceInUSD: data[index].quote.USD.price,
                ID: index,
                Symbol: data[index].symbol
            });
            if (data[index].symbol == symbolID) {
                returnResult = {
                    PriceInUSD: data[index].quote.USD.price,
                    ID: index,
                    Symbol: data[index].symbol
                }
            }

        }

        let saveresult = await conversionRateModal.insertMany(insertSymbol);

        res.setHeader('response-security', true)
        res.status(200).json({data:await responseBodyEncryptionUnprotected({ data: returnResult, error: null }), type:"noauth"});
        return;
    } catch (e) {
        if (e.response) {
            if (e.response.status == 401) {
                res.setHeader('response-security', true)
                res.status(200).json({data:await responseBodyEncryptionUnprotected({ data: { PriceInUSD: 0 }, error: "Failed" }), type:"noauth"});
                return;
            } else if (e.response.status == 403) {
                res.setHeader('response-security', true)
                res.status(200).json({data:await responseBodyEncryptionUnprotected({ data: { PriceInUSD: 0 }, error: "Failed" }), type:"noauth"});
                return;
            } else if (e.response.status == 429) {
                res.setHeader('response-security', true)
                res.status(200).json({data:await responseBodyEncryptionUnprotected({ data: { PriceInUSD: 0 }, error: "Failed" }), type:"noauth"});
                return;
            }
        }

        res.setHeader('response-security', true)
        res.status(200).json({data:await responseBodyEncryptionUnprotected({ data: { PriceInUSD: 0 }, error: "Failed" }), type:"noauth"});
        return;
    }
}

//export default usermiddleware(handler);
export default unprotectedmiddleware(handler);