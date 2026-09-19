import Image from "next/image";

function MetaverseSection2() {
  return (
    <div className="section2">
      <div className="section2Inner deswapMax">
        <div className="imageContainer">
          <Image
            width={1000}
            height={500}
            src="/images/metaverseimage1.png"
            alt={"octagon metaverse"}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default MetaverseSection2;
