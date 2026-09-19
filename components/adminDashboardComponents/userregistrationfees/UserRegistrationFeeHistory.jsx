import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import Web3 from "web3";
import { bindActionCreators } from "redux";
import { connect, useSelector, useDispatch } from "react-redux";
import {
    connectToMeta,
    metaMaskDisconnected,
    metaMaskValue,
} from "../../../redux/actions/metamask";
import { wrapper } from "../../../redux/store/store";
import {
    sendMetaMaskTransaction,
    sendContractTransaction,
} from "../../../utils/wallet/index";
import BootstrapModal from "../../reusables/BootstrapModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const sendIcon = <FontAwesomeIcon icon={faPaperPlane} />;
const editIcon = <FontAwesomeIcon icon={faPen} />;
import { SanitizeRequestObject } from "../../../utils/common/sanitize"


var metaMaskValues = null;
const UserRegistrationFeeHistory = () => {
    const [show, setShow] = useState(false);
    const [modalheader, setModalHeader] = useState("Edit");
    const [modalfooter, setModalFooter] = useState(null);
    const [modalbody, setModalBody] = useState(null);
    const [updateButton, setUpdateButton] = useState("Update");
    const [userRegistrationFeeList, setUserRegistrationFeeList] = useState([]);
    const [totalRewards, setTotalRewards] = useState("");
    const [pagination, setPagination] = useState({
        activePage: 1,
        totalData: 0,
        pageRange: 5,
        dataperpage: 10,
    });

    const closeConnectButtonClick = async () => {
        try {
            await setShow(false);
        } catch (e) {
            console.log(e);
            // toast.error(e.message, {
            //   position: "top-center",
            //   autoClose: 3000,
            //   hideProgressBar: false,
            //   closeOnClick: true,
            //   pauseOnHover: true,
            //   draggable: true,
            //   progress: undefined,
            //   });
        }
    };

    //
    const createTableData = async (tableData) => {
        try {
            if (tableData.data.length < 1) {
                setUserRegistrationFeeList(
                    <tr>
                        <td className="text-center" colSpan={7}>
                            <NodataCard />
                        </td>
                    </tr>
                );
                return;
            }
            if (tableData) {
                setUserRegistrationFeeList(
                    tableData.data.map((data, index) => {
                        return (
                            <tr key={data._id}>
                                <td>{index + 1}</td>
                                <td>
                                    {data?.uuid ? data.uuid.emailid : "N/A"}
                                </td>
                                <td>
                                    {
                                        data.uuid?.walletaddress ?
                                            reducedWalletAddress(
                                                data.uuid.walletaddress[
                                                data.uuid.walletaddress.length - 1
                                                ]
                                            ) : "N/A"}
                                </td>
                                <td>{data?.totalAmountInUSD ? data.totalAmountInUSD : "N/A"}</td>
                                <td>{data?.totalAmount ? data.totalAmount : "N/A"}</td>
                                <td>{data?.correctAmountInMatic ? data.correctAmountInMatic : "N/A"}</td>
                                <td>
                                    {data?.created_at ? myRewardsDate(data.created_at) : "N/A"}
                                </td>
                                <td>{data?.conversionrate ? data.conversionrate.substring(0, 6) : "N/A"}</td>
                                <td>
                                    <div>
                                        {data.validTransaction ? (
                                            "Correct"
                                        ) : (
                                            <div>
                                                Invalid transaction <br />{" "}
                                                <span style={{ color: "#e44757", fontWeight: "700" }}>
                                                    Reason:
                                                </span>{" "}
                                                <br />
                                                {data.invalidTransactionReason}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>{data?.percentageChangeError ? data.percentageChangeError.toFixed(6) : "N/A"}</td>
                                <td>
                                    {data?.status && data?.status}
                                    {data.status == "Rejected" &&
                                        <div>
                                            <span style={{ color: "#e44757", fontWeight: "700" }}>
                                                Reason:
                                            </span>{" "}
                                            <br />
                                            {data.RejectReason}
                                        </div>
                                    }
                                </td>
                            </tr>
                        );
                    })
                );
                await setPagination({
                    ...pagination,
                    totalData: tableData.total,
                    activePage: tableData.activePageNo,
                });
            }
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
            setUserRegistrationFeeList(
                <tr>
                    <td className="text-center" colSpan={10}>
                        <FailedToFetchData />
                    </td>
                </tr>
            );
            console.log(e);
        }
    };


    //
    const handlePageChange = async (pageNumber) => {
        try {
            setUserRegistrationFeeList(<TableLoader colSpan={7} />);
            if (isNaN(pageNumber)) {
                return;
            }
            let offset = (pageNumber - 1) * pagination.dataperpage;
            await fetchUserRegistrationFeeListFunc({
                offset: offset,
                activePageNo: pageNumber,
            });
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
            console.log("Handle page change : ", e);
        }
    };
    //   function to fetch api response
    const fetchUserRegistrationFeeListFunc = async (data) => {
        try {
            const data1=await SanitizeRequestObject(data)
            setUserRegistrationFeeList(<TableLoader colSpan={7} />);
            if (!data1.offset) {
                data1.offset = 0;
            }
            let encryptionData = await requestBodyEncryptionAdmin({
                offset: data1.offset,
            });

            let result = await axios.post(
                `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/users/registrationfee/fetchhistory`,
                { data: encryptionData },
                {
                    withCredentials: true,
                    headers: {
                        "security-set": true,
                    },
                }
            );

            const regData = await SanitizeRequestObject(result.data)
            regData.activePageNo = data.activePageNo;

            await setTotalRewards(regData.total);
            await createTableData(regData);
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
            setUserRegistrationFeeList(
                <tr>
                    <td className="text-center" colSpan={7}>
                        <FailedToFetchData />
                    </td>
                </tr>
            );
            console.log(e);
            return 0;
        }
    };
    useEffect(async () => {
        try {
            await fetchUserRegistrationFeeListFunc({
                offset: 0,
                limit: 10,
                activePageNo: 1,
            });
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
            console.log("Error message ", e);
        }
    }, []);

    return (
        <div className="stackingpackfeetableContainer">
            <div className="tableContainer">
                <p>User Registration Fee History Table</p>
                <div className="tableContainerTable customScroll">
                    <table cellPadding="0" cellSpacing="0" border="0">
                        <thead>
                            <tr>
                                <th className="hashTable">#</th>
                                <th>Email ID</th>
                                <th>Public Key</th>
                                <th>Total Amount (In USD)</th>
                                <th>Total Amount</th>
                                <th>Correct Amount (In Matic)</th>
                                <th>Date</th>
                                <th>Conversion Rate</th>
                                <th>Valid Transaction</th>
                                <th>Percentage</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>{userRegistrationFeeList}</tbody>
                    </table>
                </div>
                <div className="pagination">
                    <div className="total">

                        <p>Total Items : {totalRewards ? totalRewards : "N/A"} </p>
                    </div>
                    <Pagination
                        disabledClass={pagination.disabledClass}
                        hideDisabled={true}
                        activePage={pagination.activePage}
                        itemsCountPerPage={pagination.dataperpage}
                        totalItemsCount={pagination.totalData}
                        pageRangeDisplayed={pagination.pageRange}
                        innerClass={"pagination"}
                        activeClass={"link"}
                        onChange={handlePageChange}
                    />
                </div>
                <div className="pagination mobile">
                    <Pagination
                        disabledClass={pagination.disabledClass}
                        hideDisabled={true}
                        activePage={pagination.activePage}
                        itemsCountPerPage={pagination.dataperpage}
                        totalItemsCount={pagination.totalData}
                        pageRangeDisplayed={pagination.pageRange}
                        innerClass={"pagination"}
                        activeClass={"link"}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
            <BootstrapModal
                show={show}
                handleClose={closeConnectButtonClick}
                modaltitle={modalheader}
                modalbody={modalbody}
                modalfooter={modalfooter}
            ></BootstrapModal>
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
                toastStyle={{ backgroundColor: "#232323", color: "#FFFFFF", fontSize: "12px" }}
            />
        </div>
    );
};

export default UserRegistrationFeeHistory;
