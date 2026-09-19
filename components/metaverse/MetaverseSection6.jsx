import Image from "next/image";

function MetaverseSection6() {
  return (
    <section className="section6">
      <div className="section6Inner deswapMax">
        <div className="content">
          <div className="imgContainer">
            <Image
              width={435}
              height={435}
              src="/images/metaverseimage5.png"
              alt="metaverse icon"
              loading="lazy"
            />
          </div>
          <div className="rightBox">
            <p>
              Find out which are the first <span>Real Estate Agencies</span>{" "}
              that will be featured in our Octagon Metaverse!
            </p>
            <button className="btnHoverEffectOutline">Find out now!</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MetaverseSection6;
