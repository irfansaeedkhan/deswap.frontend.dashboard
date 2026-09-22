import React, { useState, useEffect } from "react";
import Searchicon from "@/assets/svgAssets/SearchIcon";
import SimpleButton from "@/components/reusables/SimpleButton";
import Image from "next/image";
import { HeartIcon, TickIcon } from "@/components/marketPlace/MarketIcons";
import axios from "@/utils/common/axios"
import NodataCard from "@/components/reusables/NodataCard";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import { myRewardsDate } from "@/utils/common/date";
import { SanitizeRequestStringSync } from "@/utils/common/sanitize"
import { requestBodyEncryptionAdmin } from "@/utils/common/jwtToken";
import Pagination from "@/components/reusables/Pagination";


function LicenseHistory() {

    const [licenseData, setLicenseData] = useState([]);
    const [pagination, setPagination] = useState({
        activePage: 1,
        totalData: 0,
        pageRange: 5,
        dataperpage: 10,
    });
    const [searchValue, setSearchValue] = useState();


    useEffect(() => {
        fetchLicenseData({
            offset: 0,
            limit: 10,
            activePageNo: 1,
        })
    }, [])

    const fetchLicenseData = async (data) => {
        try {
            if (!data.offset) {
                data.offset = 0;
            }

            let encryptionData = await requestBodyEncryptionAdmin({
                offset: data.offset,
            });
            let result = await axios.post(
                `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/marketplace/getalllicenceshistory`,
                { data: encryptionData },
                {
                    withCredentials: true,
                    headers: {
                        'security-set': true
                    }
                }
            );
            setLicenseData(result?.data?.data)
            await setPagination({
                ...pagination,
                totalData: result.data.total,
                activePage: data.activePageNo,
            });
        } catch (e) {
            console.log(e)
        }
    }

    const handlePageChange = async (pageNumber) => {
        try {
            if (isNaN(pageNumber)) {
                return;
            }
            let offset = (pageNumber - 1) * pagination.dataperpage;
            if (searchValue != null && searchValue != undefined) {
                await fetchLicenseInfo(searchValue, {
                    offset: offset,
                    activePageNo: pageNumber
                })
            } else {
                await fetchLicenseData({
                    offset: offset,
                    activePageNo: pageNumber,
                });
            }
        } catch (e) {
            console.log("Handle page change : ", e);
        }
    };


    const fetchLicenseInfo = async (value, data) => {
        try {
            setSearchValue(value);
            let offset
            if (!data) {
                offset = 0;
            } else {
                offset = data.offset
            }

            let encryptionData = await requestBodyEncryptionAdmin({
                licenseID: value,
                offset: offset,
            });

            let result = await axios.post(
                `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/marketplace/historylicensesearch`,
                { data: encryptionData },
                {
                    withCredentials: true,
                    headers: {
                        "security-set": true,
                    },
                }
            );

            let userDataTable = result?.data;
            if (data) {
                userDataTable.activePageNo = data?.activePageNo;
            }
            await setLicenseData(userDataTable.data);
            await setPagination({
                ...pagination,
                totalData: userDataTable.totalData,
            });
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div className="searchBox">
                <Searchicon />
                <input
                    type="text"
                    placeholder="Search License By ID Or Customers Address "
                    onKeyUp={(e) => { fetchLicenseInfo(e.target.value) }}
                />
            </div>
            <div className="lincenseTable customScroll">
                <table cellPadding="0" cellSpacing="0" border="0">
                    <thead>
                        <tr>
                            <th>License ID</th>
                            <th>Address</th>
                            <th>Customer</th>
                            <th>Application Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {licenseData.length > 0 ? licenseData.map((data) => {
                            return (
                                <tr key={SanitizeRequestStringSync(data._id)}>
                                    <td>{SanitizeRequestStringSync(data.licenseID)}</td>
                                    <td>{SanitizeRequestStringSync(reducedWalletAddress(data.creatorAddress))}</td>
                                    <td>{SanitizeRequestStringSync(data.name)}</td>
                                    <td>{SanitizeRequestStringSync(myRewardsDate(data.submitedAt))}</td>
                                    <td>
                                        {SanitizeRequestStringSync(data.status)}
                                    </td>
                                </tr>
                            )
                        }) : <tr>
                            <td className="text-center" colSpan={13}>
                                <NodataCard />
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <div className="total">{/*<p>Total {totaltable1Data} Item</p>*/}</div>
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
                    {/*<p>Total {totaltable1Data ? totaltable1Data : "N/A"} Item</p>*/}
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
        </>
    );
}

export default LicenseHistory;
