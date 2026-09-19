import React, { useEffect, useState } from "react";

function TableLoader(data) {
  const [loading, setLoading] = useState(data.loading ? data.loading : true);
  const [timeduration, setTimeduration] = useState(data.loaderDuration);

  if (timeduration) {
    setTimeout(async () => {
      await setLoading(false);
    }, timeduration);
  }
  return (
    <tr>
      <td colSpan={data.colSpan}>
        <div className={`customloaderModalTable ${loading && "loaderopen"}`}>
          <div className="customloaderTableContainer">
            <div className="customloader"></div>
            <div className="customloaderprogress customloadercontainer">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default TableLoader;
