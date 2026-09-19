import { useRouter } from "next/router";
import FourofourSvg from "@/assets/svgAssets/FourofourSvg";
import { PagesLayout } from "@/components/reusables/layout/allpages";

export default function Custom404() {
  const router = useRouter();
  return (
    <div className="Custom404pageContainer">
      <div className="backBtnContainer">
        <div className="backBtn" onClick={() => router.back()}>
          <span className="line tLine"></span>
          <span className="line mLine"></span>
          <span className="label">Back</span>
          <span className="line bLine"></span>
        </div>
      </div>
      <div className="svgContainer">
        <FourofourSvg />
      </div>
    </div>
  );
}
