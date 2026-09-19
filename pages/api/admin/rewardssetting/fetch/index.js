import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import networkSetting from "../../../../../models/networkRewardsSetting/networkRewardsSetting";
import adminmiddleware from "../../../../../middleware/adminmiddleware";

const handler = async (req, res) => {
    try{
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null,error:"Invalid Method" });
            return;
        }

        await getMongoDBConnection();

        let result = await networkSetting.find();

        res.status(200).json({ data: result,error:null}); 

    }catch(e){
        console.log(e);
        res.status(400).json({ data: null,error:"Failed to fetch"}); 
    }
}

export default adminmiddleware(handler);
