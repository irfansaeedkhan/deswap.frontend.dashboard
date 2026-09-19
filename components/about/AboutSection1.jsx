import Image from "next/image";

function AboutSection1() {
  return (
    <div className="section1">
      <div className="section1Inner deswapMax">
        <div className="imageContainer">
          <Image
            width={840}
            height={480}
            loading="lazy"
            src="/images/deswap.png"
            alt={"deswap image"}
          />
        </div>
      </div>
    </div>
  );
}

export default AboutSection1;
