import Image from "next/image";
function FailedToFetchData() {
  return (
    <div className="nodataContainer">
      <div className="imgContainer">
        <Image
          src={"/failedtofetch.png"}
          width={800}
          height={600}
          alt=" icon"
          loading="lazy"
         style={{ width: "100%", height: "auto", objectFit: "contain" }} />
      </div>
      <h6>Failed To Fetch Data</h6>
    </div>
  );
}

export default FailedToFetchData;
