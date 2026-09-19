import MonogConnection from "../../utils/connection/mongodbconnection"
import userModel from "../../models/Users";
import UserSesion from "../../models/users/usersSession";
import usermiddleware from "../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../utils/common/jwtToken"


const UserCredentails = async(req, res) => {

    //const { emailid } = req.body

    try {
        await MonogConnection()

        const UserCredentails = await userModel.findOne({ _id: req.body.uuid }).select("username emailid walletaddress uuid")
            //fetch those userSessions whose updated time is with 40 min of current time
        const userNetwork = await UserSesion.find({ uuid: UserCredentails._id, Status: "Active", updatedAt: { $gte: new Date(new Date().getTime() - (40 * 60 * 1000)) } }).select("Country clientAgent ipv6 state_city updatedAt").limit(5)

        if (UserCredentails) {
            res.setHeader('response-security', true)
            return res.status(200).json({
                data: await responseBodyEncryption({
                    success: true,
                    message: "successfully retrieved user data ",
                    UserCredentails,
                    userNetwork
                }),
                type: "userauth"
            })
        }
        res.setHeader('response-security', true)
        return res.json({
            data: await responseBodyEncryption({

                success: false,
                message: "unable to retreieve data"

            }),
            type: "userauth"
        })
    } catch (error) {
        res.setHeader('response-security', true)
        return res.json({
            data: await responseBodyEncryption({

                success: false,
                message: "unable to retreieve data"

            }),
            type: "userauth"
        })
    }


}
export default usermiddleware(UserCredentails)