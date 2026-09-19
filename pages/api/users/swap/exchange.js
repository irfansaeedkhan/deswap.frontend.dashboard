import axios from "axios";
import { responseBodyEncryptionUnprotected, requestBodyVerificationUnprotected, decodeRequestBodyUnprotected } from "../../../../utils/common/jwtToken"
import { maticToDeswap, deswapToMatic } from "../../../../utils/common/tokenconversion";
import unprotectedmiddleware from "../../../../middleware/unprotectedmiddleware";
/**
 * @api {post} /api/users/swap/exchange/ Exchange Matic to Deswap
 * @apiName ExchangeMaticToDeswap
 * @apiGroup User/Swap
 * @apiVersion 1.0.0
 * @apiDescription Exchange Matic to Deswap
 * @apiBody {Number} amount
 * @apiBody {Number} conversionrate
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/swap/exchange/', {
 * amount: 100,
 * conversionrate: 0.1
 * })
 * @apiSuccess {String} message Success message.
 * @apiSampleRequest /api/users/swap/exchange/
 * 
 * 
 */
const handler = async(req, res) => {
    let convertedValue = { usd: 0.00, data: 0.00 };
    try {

        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        /*
        if (req.headers.hasOwnProperty("security-set") && req.headers['security-set'] && (Boolean(req.headers['security-set']) == true) && (req.headers['security-set'] == "true")) {
            //
            if (!req.body.data) {
                res.status(400).json({ data: null, error: "Invalid request" });
                return
            }
            //Valid request
            let verifiedData = true;
            await requestBodyVerificationUnprotected(req.body.data).catch((error) => {
                verifiedData = false;
            })

            let decodedData = await decodeRequestBodyUnprotected(req.body.data);

            req.body = {...decodedData.payload, ...req.body }

        }*/

        let amount = req.body.amount;
        if (isNaN(Number(amount))) {
            res.status(400).json({ data: null, error: "Invalid Amount" });
            return;
        }


        if (req.body.converstion == "matic_to_deswap") {

            convertedValue = await maticToDeswap(amount);
        } else {
            convertedValue = await deswapToMatic(amount);
        }
        //TO DO : remove after completing testing
        /*
        if(req.body.converstion=="matic_to_deswap"){

        if (req.body.converstion == "matic_to_deswap") {

            url = `${process.env.NEXT_PUBLIC_COINMARKETCAP_BASE_URL}/data-api/v3/tools/price-conversion?amount=${amount}&id=${process.env.NEXT_PUBLIC_MATIC_CMC_ID}&convert_id=${process.env.NEXT_PUBLIC_USDT_CMC_ID},${process.env.NEXT_PUBLIC_DEW_CMC_ID}`;
        } else {
            url = `${process.env.NEXT_PUBLIC_COINMARKETCAP_BASE_URL}/data-api/v3/tools/price-conversion?amount=${amount}&id=${process.env.NEXT_PUBLIC_DEW_CMC_ID}&convert_id=${process.env.NEXT_PUBLIC_USDT_CMC_ID},${process.env.NEXT_PUBLIC_MATIC_CMC_ID}`
        }
        let conversionResult = await axios.get(url);

        let quotedValue = conversionResult.data.data.quote;
        for (let index in quotedValue) {
            if (quotedValue[index].symbol == "USD") {
                //
                returnData.usd = quotedValue[index].price;

            } else {
                returnData.data = quotedValue[index].price;
            }
        }*/
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryptionUnprotected({ data: convertedValue, error: null }), type: "noauth" });

    } catch (e) {
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryptionUnprotected({ data: convertedValue, error: null }), type: "noauth" });
    }
}

export default unprotectedmiddleware(handler);