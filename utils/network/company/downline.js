import getMongoDBConnection from "../../../utils/connection/mongodbconnection";
import usersModal from "../../../models/Users";
import companyModal from "../../../models/company/company";
import companyNetworkModal from "../../../models/company/rewards/companyNetwork";

module.exports.fetchCompanyDownline = async(companyid, defaultDownline = 2) => {
    try {
        let result = [];
        let findchild = true;
        let currentcompanyid = companyid
        await getMongoDBConnection();

        for (let i = 0; i < defaultDownline; i++) {
            //
            if (findchild) {
                //find downline for current company
                let downline = await companyNetworkModal.find({
                    companyid: currentcompanyid
                }).lean();
                if (downline.length > 0) {
                    //
                    for (let j = 0; j < downline.length; j++) {
                        //
                        result.push(downline[j]);
                        currentcompanyid = downline[j].childcompanyid;
                    }
                } else {
                    //
                    findchild = false;
                }
            } else {
                result.push(null);
            }
        }
        return result;
    } catch (e) {
        console.log("Failed to downline ", e)
    }
}