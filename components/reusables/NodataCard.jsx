import Image from "next/image";
function NodataCard() {
  return (
    <div className="nodataContainer">
      <div className="imgContainer">
        <Image
          src={"/nodata.png"}
          width={800}
          height={600}
          alt=" icon"
          loading="lazy"
         style={{ width: "100%", height: "auto", objectFit: "contain" }} />
      </div>
      <h6>No Data Found</h6>
    </div>
  );
}

export default NodataCard;
