import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken";
import company from "../../../../../models/company/company";
import catagory from "../../../../../models/company/catagory";



const handler = async (req, res) => {
  try {
    if (req.method !== "GET") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }

    //get mongodb connection
    await getMongoDBConnection();

    const totalCompany=await company.count();

    const totalActiveCompany = await company.count({status:"Active"})

    //response
    res.setHeader("response-security", true);
    res
      .status(200)
      .json({
        data: await responseBodyEncryptionAdmin({ totalCompany:totalCompany,totalActiveCompany:totalActiveCompany }),
        type: "adminauth",
      });
  } catch (error) {
    console.log(error)
    res.status(400).json({ data: null, error: "Failed to get" });
  }
};

export default adminmiddleware(handler);
