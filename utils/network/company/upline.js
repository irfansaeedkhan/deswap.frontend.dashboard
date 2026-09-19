import getMongoDBConnection from "../../../utils/connection/mongodbconnection";
import usersModal from "../../../models/Users";
import companyModal from "../../../models/company/company";
import companyNetworkModal from "../../../models/company/rewards/companyNetwork";


module.exports.fetchCompanyUpline = async(companyid, defaultUpline = 2) => {
    try {
        let result = [];
        let findparent = true;
        let currentcompanyid = companyid
        await getMongoDBConnection();

        for (let i = 0; i < defaultUpline; i++) {
            //
            if (findparent) {
                //
                let companyNetwork = await companyNetworkModal.findOne({
                    companyId: currentcompanyid
                }).populate('sponsorCompanyID').lean();
                if (!companyNetwork) {
                    findparent = false;
                    return result;
                } else {

                    if (companyNetwork.sponsorCompanyId == undefined || companyNetwork.sponsorCompanyId == null) {
                        //No parent so
                        findparent = false;

                    } else {
                        //
                        result.push({
                            companyname: companyNetwork.sponsorCompanyId.companyname,
                            id: companyNetwork.sponsorCompanyId._id,
                            uuid: companyNetwork.sponsorCompanyId.uuid,
                            MetaMaskAccountPublicKey: companyNetwork.sponsorCompanyId.walletaddress,
                        });
                        currentcompanyid = companyNetwork.sponsorCompanyId._id;
                    }
                }
            } else {
                result.push(null);
            }
        }
        return result;
    } catch (e) {
        console.log("Failed to upline ", e)
    }
}