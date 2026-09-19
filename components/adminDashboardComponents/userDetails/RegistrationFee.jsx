import React, { useState, useEffect } from "react";
import axios from "@/utils/common/axios";
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import Loader from "@/components/reusables/loader/Loader";
import { myRewardsDate, claimmedDate } from "@/utils/common/date";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { checkAdminAuth } from "../../../utils/auth/checkAdminAuth";
import { convertToEuro, convertToUSD } from "@/utils/common/currencyconversion";
import Pagination from "react-js-pagination";
import {
    ConnectToWeb3,
    formatWei,
} from "../../.././utils/wallet/fetchtransactiondetails";
import {
    sendMetaMaskTransaction,
    sendContractTransaction,
} from "../../../utils/wallet/index";
import BootstrapModal from "../../reusables/BootstrapModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
const sendIcon = <FontAwesomeIcon icon={faPaperPlane} />;
const editIcon = <FontAwesomeIcon icon={faPen} />;
import TableLoader from "../../reusables/loader/TableLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SanitizeRequestObject } from "../../../utils/common/sanitize"


function UserRegistrationFee(props) {
    const [show, setShow] = useState(false);
    const [modalheader, setModalHeader] = useState("Edit");
    const [modalfooter, setModalFooter] = useState(null);
    const [modalbody, setModalBody] = useState(null);
    const [updateButton, setUpdateButton] = useState("Update");
    const [companyFeeTable1List, setCompanyFeeTable1List] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [totaltable1Data, setTotaltable1Data] = useState("");
    const [pagination, setPagination] = useState({
        activePage: 1,
        totalData: 0,
        pageRange: 5,
        dataperpage: 10,
    });



    const createTableData = async (tableData) => {
        try {
            //

            if (tableData.data.length < 1) {
                setCompanyFeeTable1List(
                    <tr>
                        <td className="text-center" colSpan={13}>
                            <NodataCard />
                        </td>
                    </tr>
                );
                return;
            }
            //
            let outputData = [];

            for (let index in tableData.data) {
                let transactionDetails = await ConnectToWeb3(
                    tableData.data[index].TxHash
                );
                if (transactionDetails != null && transactionDetails != undefined) {
                    transactionDetails.convertedAmount = await formatWei(
                        transactionDetails.value
                    );
                    tableData.data[index].transactionDetails = transactionDetails;
                }
            }
            if (tableData) {
                //

                let loopDate = tableData.data;
                //tableData.data.map((data, index) => {
                for (let index in loopDate) {
                    outputData.push(
                        <tr className="swaprequestedTR" key={loopDate[index]._id}>
                            <td>{Number(index) + 1}</td>

                            <td>
                                {(loopDate[index].uuid && loopDate[index].uuid.emailid)
                                    ? loopDate[index].uuid.emailid
                                    : "N/A"}
                            </td>
                            <td>
                                {loopDate[index]?.uuid? (
                                    <a
                                        target="_blank"
                                        href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${loopDate[index].uuid.walletaddress[
                                            loopDate[index].uuid.walletaddress.length - 1
                                        ]
                                            }`}
                                    >
                                        {reducedWalletAddress(
                                            loopDate[index].uuid.walletaddress[
                                            loopDate[index].uuid.walletaddress.length - 1
                                            ]
                                        )}
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </td>
                            <td>
                                {loopDate[index]?.txHash? (
                                    <a
                                        target="_blank"
                                        href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}tx/${loopDate[index].txHash
                                            }`}
                                    >
                                        {reducedWalletAddress(
                                            loopDate[index].txHash
                                        )}
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </td>
                            <td>
                                {loopDate[index].created_at ? myRewardsDate(loopDate[index].created_at) : "N/A"}
                            </td>
                            <td>
                                {(loopDate[index] &&
                                    loopDate[index]?.totalAmount) ?
                                    loopDate[index].totalAmount.toFixed(6)
                                    : "N/A"
                                }
                            </td>
                            <td>
                                {(loopDate[index] &&
                                    loopDate[index]?.totalAmountInUSD) ?
                                    loopDate[index].totalAmountInUSD.toFixed(6)
                                    : "N/A"}
                            </td>
                            <td>
                                {(loopDate[index] &&
                                    loopDate[index].conversionrate) ?
                                    loopDate[index].conversionrate.substring(0,6)
                                    : "N/A"}
                            </td>
                            <td>
                                {(loopDate[index] &&
                                    loopDate[index].correctAmountInMatic) ?
                                    loopDate[index].correctAmountInMatic.toFixed(6)
                                    : "N/A"}
                            </td>
                            <td>
                                <div>
                                    {loopDate[index].validTransaction ? (
                                        "Correct"
                                    ) : (
                                        <div>
                                            Invalid transaction <br />{" "}
                                            <span style={{ color: "#e44757", fontWeight: "700" }}>
                                                Reason:
                                            </span>{" "}
                                            <br />
                                            {loopDate[index].invalidTransactionReason}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td>
                                {(loopDate[index] &&
                                    loopDate[index].percentageChangeError) ?
                                    loopDate[index].percentageChangeError.toFixed(6) + "%"
                                    : "N/A"}
                            </td>
                            <td>
                                {(loopDate[index] &&
                                    loopDate[index]?.status) ?
                                    loopDate[index].status
                                    : "N/A"
                                }
                            </td>
                        </tr>
                    );
                }
                //})

                await setCompanyFeeTable1List(outputData);
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
            console.log(e);
            await setCompanyFeeTable1List(
                <tr>
                    <td className="text-center" colSpan={10}>
                        <FailedToFetchData />
                    </td>
                </tr>
            );
        }
    };
    const handlePageChange = async (pageNumber) => {
        try {
            if (isNaN(pageNumber)) {
                return;
            }
            let offset = (pageNumber - 1) * pagination.dataperpage;
            await fetchRegistrationFee({
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
    const fetchRegistrationFee = async (data) => {
        try {
            const data1=await SanitizeRequestObject(data)
            setCompanyFeeTable1List(<TableLoader colSpan={13} />);

            if (!data1.offset) {
                data1.offset = 0;
            }
            let encryptionData = await requestBodyEncryptionAdmin({
                offset: data1.offset,
                id: props.uuid
            });
            let result = await axios.post(
                `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/userinfofee/fetch/registrationfee`,
                { data: encryptionData },
                {
                    withCredentials: true,
                    headers: {
                        "security-set": true,
                    },
                }
            );
            setLoadingState(result && false);
            let SwapMD = result?.data;
            SwapMD=await SanitizeRequestObject(SwapMD)
            SwapMD.activePageNo = data?.activePageNo;
           await setTotaltable1Data(SwapMD?.total);
            await createTableData(SwapMD);
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
            setLoadingState(false);
            setCompanyFeeTable1List(
                <tr>
                    <td className="text-center" colSpan={10}>
                        <FailedToFetchData />
                    </td>
                </tr>
            );
            console.log(e);
        }
    };
    useEffect(async () => {
        await fetchRegistrationFee({
            offset: 0,
            limit: 10,
            activePageNo: 1,
        });
    }, []);

    return (
        <div className="SwapMDtableContainer">
            <div className="tableContainer">
                <p>Registration Fee</p>
                <div className="tableContainerTable customScroll">
                    <table cellPadding="0" cellSpacing="0" border="0">
                        <thead>
                            <tr>
                                <th className="hashTable">Sl No</th>
                                <th>Email ID</th>
                                <th>Public Key</th>
                                <th>Transaction Hash</th>
                                <th>Datetime</th>
                                <th>Total Amount</th>
                                <th>Total Amount In USD</th>
                                <th>Conversion Rate</th>
                                <th>Correct Amount(In Matic)</th>
                                <th>Valid Transation</th>
                                <th>Error Percentage</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>{companyFeeTable1List}</tbody>
                    </table>
                </div>
                <div className="pagination">
                    <div className="total"><p>Total {totaltable1Data} Item</p></div>
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
                    <div className="total">
                        <p>Total {totaltable1Data ? totaltable1Data : "N/A"} Item</p>
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
            </div>
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
}

export default UserRegistrationFee;
