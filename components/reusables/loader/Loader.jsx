import React, { useEffect, useState } from "react";

function Loader(data) {
  const [loading, setLoading] = useState(data.loading ? data.loading : true);
  const [timeduration, setTimeduration] = useState(data.loaderDuration);
  var body;
  if (typeof document !== "undefined") {
    body = document.querySelector("body");

    if (data.loading) {
      body.classList.add("stopScrolling");
    } else {
      body.classList.remove("stopScrolling");
    }
  }
  if (timeduration) {
    setTimeout(() => {
      setLoading(false);
    }, timeduration);
  }
  return (
    <div>
      <div className={`customloaderModal ${loading && "loaderopen"}`}>
        <div className="customloaderContainer">
          <div className="customloader"></div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
