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

        let result = await networkSetting.findByIdAndUpdate({_id:req.body.id},{Percentage:req.body.Percentage,Status:req.body.Status});

        res.status(200).json({ data: "Successfully Updated",error:null}); 

    }catch(e){
        console.log(e);
        res.status(400).json({ data: null,error:"Failed to fetch"}); 
    }
}

export default adminmiddleware(handler);
