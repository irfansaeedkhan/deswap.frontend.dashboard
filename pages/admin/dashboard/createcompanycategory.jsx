import React, { useState, useEffect, useContext } from "react";
import Loader from "@/components/reusables/loader/Loader";
import axios from "@/utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import NodataCard from "@/components/reusables/NodataCard";
import CategoryCard from "@/components/adminDashboardComponents/companyCategory/CategoryCard";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { CategoryContext } from "@/layout/admindashboard.layout";
import {
  SanitizeRequestObject,
  SanitizeRequestString,
} from "../../../utils/common/sanitize";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";

export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
};
function CreateCompanyCategory() {
  const [categoryList, setCategoryList] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const refreshList = useContext(CategoryContext);
  // api call
  const fetchCategoryListFunc = async (mydata) => {
    try {
      const data1 = await SanitizeRequestObject(mydata);
      if (!data1?.offset) {
        data1.offset = 0;
      }
      let encryptionData = await requestBodyEncryptionAdmin({
        offset: data1?.offset,
      });

      setLoadingState(true);

      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/company/catagory/fetch`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      setLoadingState(result && false);
      console.log("result::::", result);
      if (result) {
        if (result?.data?.data?.length > 0) {
          setCategoryList(result?.data?.data);
          setLoadingState(false);
        } else {
          setCategoryList(<NodataCard />);
          setLoadingState(false);
        }
      } else {
        setLoadingState(false);
        setCategoryList(<NodataCard />);
      }

      setLoadingState(false);
      const data = result?.data?.data;
      data = await SanitizeRequestObject(data);
      return data;
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      setCategoryList(<FailedToFetchData />);
      console.log(e);
      setLoadingState(false);
      return 0;
    }
  };

  //   use effect to fetch latest data
  useEffect(async () => {
    await fetchCategoryListFunc({
      offset: 0,
      limit: 10,
    });
  }, [refreshList]);
  // handle update
  const handleUpdate = async (Updatedata) => {
    const sanData = await SanitizeRequestObject(Updatedata);
    let data = await requestBodyEncryptionAdmin(sanData);

    try {
      setLoadingState(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/company/catagory/update`,
        { data: data },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      await fetchCategoryListFunc();
      toast.success("Successfully Updated", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoadingState(result && false);

      return result;
    } catch (e) {
      toast.error(e.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(e);
      setLoadingState(false);
      return 0;
    }
  };
  // handle delete
  const handleDelete = async (Deletedata) => {
    const sanData = await SanitizeRequestObject(Deletedata);
    let data = await requestBodyEncryptionAdmin(sanData);
    try {
      setLoadingState(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/company/catagory/delete`,
        { data: data },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      await fetchCategoryListFunc();
      setLoadingState(result && false);

      return result;
    } catch (e) {
      toast.error(e.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(e);
      setLoadingState(false);
      return 0;
    }
  };

  return (
    <div className="nftLicenseContainer">
      <div className="nftLicenseInner">
        <div className="title">
          <h1>Create Company Category</h1>
        </div>
        <div className="nftLicenseMain">
          <div className="nftLicenseCardsContainer">
            {categoryList?.length > 0
              ? categoryList.map((cardInfo) => {
                  return (
                    <CategoryCard
                      cardInfo={cardInfo}
                      key={cardInfo?._id}
                      handleUpdate={handleUpdate}
                      handleDelete={handleDelete}
                    />
                  );
                })
              : categoryList}
          </div>
        </div>
      </div>
      {loadingState && <Loader />}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </div>
  );
}

export default CreateCompanyCategory;
CreateCompanyCategory.PageLayout = AdminDashboardLayout;
