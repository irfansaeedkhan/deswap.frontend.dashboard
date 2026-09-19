import getMongoDBConnection from "../../../utils/connection/mongodbconnection";
import conversionPriceModal from "../../../models/conversion/conversionPrices";
import { responseBodyEncryptionUnprotected } from "../../../utils/common/jwtToken"
const handle = async(req, res) => {
    try {
        await getMongoDBConnection();
        let totalCount = await conversionPriceModal.find({
            PrimarySymbol: "MATIC",
            SecondarySymbol: "DAW"
        }).count();
        let findlatestEntry = await conversionPriceModal.find({
            PrimarySymbol: "MATIC",
            SecondarySymbol: "DAW"
        }).sort({ 'created_at': "asc" }).limit(5).skip(0);

        res.setHeader('response-security', true);
        return res.status(200).json({ data: await responseBodyEncryptionUnprotected({ data: findlatestEntry, error: null }), type: "noauth"});

    } catch (e) {
        console.log("Error : ", e)
        res.json({ data: [], error: "Failed to fetch" });
    }
}

export default handle;