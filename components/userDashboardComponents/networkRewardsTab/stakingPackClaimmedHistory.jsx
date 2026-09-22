import React,{useEffect,useState} from "react";
import Loader from '@/components/reusables/loader/Loader';
import NodataCard from '@/components/reusables/NodataCard';
import FailedToFetchData from "@/components/reusables/FailedToFetchData";

function StakingPackClaimmedHistory(){

  const [tableData, settableData] = useState(<tbody><tr><th colSpan={7}><div className="text-center">Loading...</div></th></tr></tbody>);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    void (async () => {
    try{

    }catch(e){

    }
      })();
  },[])

    return(
        <div className="rewardDataContainer">
            <h3>Pack Claimed Rewards History</h3>
            <div className="rewardTable customScroll">
              <table cellPadding="0" cellSpacing="0" border="0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th> Pack Name</th>
                    <th> Staking Pack ID</th>
                    <th> Days</th>
                    <th> TxHash</th>
                    <th> Amount (DESWAP)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="text-center" colSpan={6}><NodataCard /></td></tr>
                </tbody>
              </table>
            </div>
            {/* {loading && <Loader />} */}
        </div>
    )
}

export default StakingPackClaimmedHistory;