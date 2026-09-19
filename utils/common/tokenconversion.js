import axios from "axios";

module.exports.maticToDeswap = async (amountToConvert) => {
    let returnData = { usd: 0.00, data: 0.00 };
    try {

        let url = `${process.env.NEXT_PUBLIC_COINMARKETCAP_BASE_URL}/data-api/v3/tools/price-conversion?amount=${amountToConvert}&id=${process.env.NEXT_PUBLIC_MATIC_CMC_ID}&convert_id=${process.env.NEXT_PUBLIC_USDT_CMC_ID},${process.env.NEXT_PUBLIC_DEW_CMC_ID}`;

        let conversionResult = await axios.get(url);

        let quotedValue = conversionResult.data.data.quote;

        for (let index in quotedValue) {
            if (quotedValue[index].symbol == "USD") {
                //
                returnData.usd = quotedValue[index].price;

            } else {
                returnData.data = quotedValue[index].price;
            }
        }
        return returnData;
    } catch (e) {
        console.log("Failed to convert matic to deswap ", e);
        return returnData;
    }
}

module.exports.deswapToMatic = async (amountToConvert) => {
    let returnData = { usd: 0.00, data: 0.00 };
    try {
        let url = `${process.env.NEXT_PUBLIC_COINMARKETCAP_BASE_URL}/data-api/v3/tools/price-conversion?amount=${amountToConvert}&id=${process.env.NEXT_PUBLIC_DEW_CMC_ID}&convert_id=${process.env.NEXT_PUBLIC_USDT_CMC_ID},${process.env.NEXT_PUBLIC_MATIC_CMC_ID}`
        let conversionResult = await axios.get(url);
        let quotedValue = conversionResult.data.data.quote;

        for (let index in quotedValue) {
            if (quotedValue[index].symbol == "USD") {
                //
                returnData.usd = quotedValue[index].price;

            } else {
                returnData.data = quotedValue[index].price;
            }
        }
        return returnData;
    } catch (e) {
        console.log("Failed to convert deswap to matic ", e);
        return returnData;
    }
}


module.exports.dollarToMatic = async (amountToConvert) => {
    let returnData = { usd: 0.00, data: 0.00, conversionrate: 0.00, valid: false };
    try {

        let url = `${process.env.NEXT_PUBLIC_COINMARKET_CAP_BASE}/data-api/v3/tools/price-conversion?amount=${amountToConvert}&id=2781&convert_id=3890`
        let conversionResult = await axios.get(url);
        let quotedData = conversionResult.data.data.quote;

        for (let index in quotedData) {
            if (quotedData[index].cryptoId == 3890) {
                //
                returnData.data = quotedData[index].price;
                returnData.conversionrate = quotedData[index].price / amountToConvert;
                returnData.valid = true
            }
        }

        return returnData;
    } catch (e) {
        console.log("Failed to convert deswap to matic ", e);
        return returnData;
    }
}

module.exports.maticToDollar = async (amountToConvert) => {
    let returnData = { usd: 0.00, data: 0.00, conversionrate: 0.00, valid: false };
    try {

        let url = `${process.env.NEXT_PUBLIC_COINMARKET_CAP_BASE}/data-api/v3/tools/price-conversion?amount=${amountToConvert}&id=3890&convert_id=2781`
        let conversionResult = await axios.get(url);
        let quotedData = conversionResult.data.data.quote;

        for (let index in quotedData) {
            if (quotedData[index].cryptoId == 2781) {
                //
                returnData.data = quotedData[index].price;
                returnData.conversionrate = quotedData[index].price / amountToConvert;
                returnData.valid = true
            }
        }

        return returnData;
    } catch (e) {
        console.log("Failed to convert deswap to matic ", e);
        return returnData;
    }

    }


module.exports.dollarToDeswap = async (amountToConvert) => {
    let returnData = { usd: 0.00, data: 0.00, conversionrate: 0.00, valid: false };
    try {

        let url = `${process.env.NEXT_PUBLIC_COINMARKET_CAP_BASE}/data-api/v3/tools/price-conversion?amount=${amountToConvert}&id=2781&convert_id=11619`
        let conversionResult = await axios.get(url);
        let quotedData = conversionResult.data.data.quote;

        for (let index in quotedData) {
            if (quotedData[index].cryptoId == 11619) {
                //
                returnData.data = quotedData[index].price;
                returnData.conversionrate = quotedData[index].price / amountToConvert;
                returnData.valid = true
            }
        }

        return returnData;
    } catch (e) {
        console.log("Failed to convert deswap to matic ", e);
        return returnData;
    }

    }

   
    