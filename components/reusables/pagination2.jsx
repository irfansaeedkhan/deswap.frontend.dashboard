import React, { Fragment } from "react";
import { Pagination } from "antd";
import "antd/dist/antd.css";
import styles from "../../../styles/Home.module.css";

const Pagination2 = ({
  placeHolderData,
  postperPage,
  paginate,
  totalCount,
}) => {
  const pages = [];

  for (
    let index = 1;
    index <= Math.ceil(placeHolderData / postperPage);
    index++
  ) {
    pages.push(index);
  }

  function onChange(pageNumber) {
    paginate(pageNumber);
  }
  totalCount = placeHolderData;
  return (
    <Fragment>
      <section className={``}>
        <div className="container-fluid m-0 p-0">
          <div className="row ">
            <div className="col-md-12 text-md-end ">
              <div className={`${styles.total}`}>
                <p>TOTAL {totalCount} ITEMS</p>
              </div>

              <Pagination
                className={`custompagination ${styles.pagiantionComponentStyle}`}
                defaultCurrent={1}
                total={pages.length * 10}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Pagination2;
