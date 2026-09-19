import React, { useEffect, useState } from "react";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import Loader from '@/components/reusables/loader/Loader';
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from '@/components/reusables/NodataCard';
import { myRewardsDate } from "../../../utils/common/date"
import { reducedWalletAddress } from "../../../utils/common/walletaddress"
import { convertToEuro } from "../../../utils/common/currencyconversion";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SanitizeRequestString, SanitizeRequestObject } from "../../../utils/common/sanitize"
import Pagination from "react-js-pagination";



function ClaimmedNetworkRewardsHistory() {
    const [loaderStatus, setLoaderStatus] = useState(false);
    const [tableData, settableData] = useState(<tbody><tr><th colSpan={7}><div className="text-center">Loading...</div></th></tr></tbody>);
    const [totaltable1Data, setTotaltable1Data] = useState("");
    const [pagination, setPagination] = useState({
        activePage: 1,
        totalData: 0,
        pageRange: 5,
        dataperpage: 10,
    });

    const createTableData = async (data, totaldata) => {
        try {
            settableData(<TableLoader colSpan={6} />)
            let dispalyData = []
            for (let index in data) {
                dispalyData.push(
                    <tr>
                        <td>{data[index]?.created_at ? myRewardsDate(data[index].created_at) : "N/A"}</td>
                        <td>
                            {data[index]?.ClaimmedNetworkID.PublicAddress ?
                                <a target="_blank" href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${data[index].ClaimmedNetworkID.PublicAddress}`}>
                                    {reducedWalletAddress(data[index].ClaimmedNetworkID.PublicAddress)}
                                </a> : "N/A"
                            }

                        </td>
                        <td>{data[index]?.Level ? data[index]?.Level : "N/A"}</td>
                        <td>{(data[index]?.Amount && data[index]?.RewardsPercentage) ? convertToEuro(data[index].Amount * data[index].RewardsPercentage) : "N/A"}</td>
                        <td>
                            {data[index]?.ClaimmedNetworkID?.TxHash ?
                                <a target="_blank" href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}tx/${data[index].ClaimmedNetworkID.TxHash}`}>
                                    {reducedWalletAddress(data[index].ClaimmedNetworkID.TxHash)}
                                </a> : "N/A"
                            }

                        </td>
                        <td>{data[index]?.Status ? data[index]?.Status : "N/A"}</td>
                    </tr>
                )
            }
            await setPagination({
                ...pagination,
                totalData: totaldata?.count,
                activePage: totaldata?.activePageNo,
            });
            if (dispalyData.length < 1) {
                settableData(<tr><td className="text-center" colSpan={6}><NodataCard /></td></tr>);
                return;
            } else {
                settableData(dispalyData);
                setLoaderStatus(false);
            }

        } catch (e) {

            // toast.error(e.message, {
            //     position: "top-center",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     });
            setLoaderStatus(true);
            settableData(<tr><td className="text-center" colSpan={6}><FailedToFetchData /></td></tr>);
            setLoaderStatus(false);
        }
    }

    const handlePageChange = async (pageNumber) => {
        try {
            settableData(<TableLoader colSpan={9} />);
            if (isNaN(pageNumber)) {
                return;
            }
            let offset = (pageNumber - 1) * pagination.dataperpage;
            await fetchData({
                offset: offset,
                activePageNo: pageNumber,
            })

        } catch (e) {
            console.log("Handle page change : ", e);
        }
    };

    const closeModalFunc = () => {
        setShow(false);
    };

    const fetchData = async (data) => {
        try {
            setLoaderStatus(true);
            if (!data.offset) {
                data.offset = 0;
            }
            let encryptionData = await encryptRequestBody({
                offset: data.offset,
            });
            let result = await axios.post(
                `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/network/fetch/claimmed`,
                { data: encryptionData },
                {
                    withCredentials: true,
                    headers: {
                        'security-set': true
                    }
                }
            );
            let tableData = result.data;
            tableData = await SanitizeRequestObject(tableData)
            if (result.data.totaldata < 1) {
                settableData(<tr><td className="text-center" colSpan={6}><NodataCard /></td></tr>);
                return;
            }
            tableData.activePageNo = data?.activePageNo;
            await createTableData(tableData.data, tableData);
            setTotaltable1Data(tableData.count)
            setLoaderStatus(result && false);
        } catch (e) {

            // toast.error(e.message, {
            //     position: "top-center",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     });
            setLoaderStatus(true);
            settableData(<tr><td className="text-center" colSpan={6}><FailedToFetchData /></td></tr>);
            setLoaderStatus(false);
        }
    }

    useEffect(async () => {
        try {
            setLoaderStatus(true);
            await fetchData({
                offset: 0,
                limit: 10,
                activePageNo: 1,
            });
            setLoaderStatus(false);
        } catch (e) {

            // toast.error(e.message, {
            //     position: "top-center",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     });
            setLoaderStatus(true);
            settableData(<tr><td className="text-center" colSpan={6}><FailedToFetchData /></td></tr>);
            setLoaderStatus(false);
        }
    }, [])

    return (
        <div className="rewardDataContainer">
            <h3>Network Rewards History</h3>
            <div className="rewardTable customScroll">
                <table cellPadding="0" cellSpacing="0" border="0">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th> Public Key</th>
                            <th> Level</th>
                            <th> My Reward ($)</th>
                            <th> Txhash</th>
                            <th> Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData
                    /* <tr>
                    <td>02-02-2022</td>
                    <td>sdfsdf4343443d</td>
                    <td>1-4</td>
                    <td>567</td>
                    <td>sdfsf4fsf4dcccxxx</td>
                    <td>Active</td>
                    </tr>
                    <tr>
                    <td>02-02-2022</td>
                    <td>sdfsdf4343443d</td>
                    <td>1-4</td>
                    <td>567</td>
                    <td>sdfsf4fsf4dcccxxx</td>
                    <td>Active</td>
                    </tr> */}
                    </tbody>
                </table>
                <div className="pagination">
                    <div className="total">
                        <p>Total {totaltable1Data} Item</p>
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
            {/* {loaderStatus && <Loader />} */}
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
    )
}

export default ClaimmedNetworkRewardsHistory;