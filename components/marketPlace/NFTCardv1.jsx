import React, { useState, useEffect } from "react";
import Image from "next/image";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../redux/actions/metamask";
import {
  HeartIcon,
  EmptyHeartIcon,
  TickIcon,
} from "@/components/marketPlace/MarketIcons";

function NFTCardv1({ metamaskConn, cardDetails, dataType, buttonContent }) {
  return (
    <div
      className={`collectionCard ${dataType == "staked" && "staked"}`}
      key={cardDetails?.id}
    >
      <div className="cardTop">
        <div className="cardImg">
          <Image
            width={296}
            height={296}
            src={cardDetails?.image}
            alt={"collection image"}
            loading="lazy"
          />
        </div>
        <div className="heartImg">
          {cardDetails?.like ? <HeartIcon /> : <EmptyHeartIcon />}
        </div>
        {cardDetails?.duration && (
          <div className="timeleft">
            <div className="timeImg">
              <Image
                width={24}
                height={24}
                src={"/images/clock.png"}
                alt={"clock image"}
                loading="lazy"
              />
            </div>
            <h6>{cardDetails?.duration} days left</h6>
          </div>
        )}
      </div>
      <div className="cardBottom">
        <div className="topContent">
          <h5>{cardDetails?.name}</h5>
          <div className="author">
            <h6>
              {cardDetails?.by}
              <TickIcon />
            </h6>
          </div>
        </div>
        <div className="bottomContent">{buttonContent}</div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  //metaMaskValues = state.metamaskConn;
  return { metamaskConn: state.metamaskConn };
};

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (ctx) => {
//     await store.dispatch(metaMaskValue());
//     return await checkAdminAuth(ctx);
//   }
// );

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NFTCardv1);
