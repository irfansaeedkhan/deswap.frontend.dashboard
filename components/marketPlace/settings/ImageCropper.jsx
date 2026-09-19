import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import BootstrapModal from "@/components/reusables/BootstrapModal";
const ImageCropper = ({ coverImage, setCoverImage, show, setShow }) => {
  const cropperRef = useRef(null);

  const [modalheader, setModalHeader] = useState("Crop");
  async function dataUrlToFile(dataUrl, fileName) {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: "image/png" });
  }

  const onCrop = async () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;

    const file = await dataUrlToFile(
      cropper.getCroppedCanvas().toDataURL(),
      coverImage.blob?.name || "cropped-image.png"
    );

    setCoverImage((prev) => ({
      ...prev,
      path: cropper.getCroppedCanvas().toDataURL(),
      blob: file,
      object_name: "cropped-image.png",
      preview: "",
    }));
  };
  const [modalfooter, setModalFooter] = useState(
    <button
      className="w-fit px-6 py-2 flex text-sm rounded-lg items-center font-semibold bg-brand-primary text-black-shade-2 hover:bg-brand-primary-dark"
      onClick={onCrop}
    >
      Crop
    </button>
  );
  const [modalbody, setModalBody] = useState(
    <Cropper
      src={coverImage.preview}
      style={{
        height: 400,
        width: "100%",
        objectFit: "cover",
        display: "flex",
        justifyContent: "center",
      }}
      viewMode={1}
      movable={false}
      zoomable={false}
      scalable={false}
      initialAspectRatio={840 / 180}
      aspectRatio={840 / 180}
      cropBoxResizable={false}
      minContainerHeight={180}
      minCropBoxHeight={180}
      background={false}
      guides={false}
      ref={cropperRef}
    />
  );

  const DisplayImage = () => {
    try {
      /*setModalBody(
        <Cropper
          src={coverImage.preview}
          style={{
            height: 400,
            width: "100%",
            objectFit: "cover",
            display: "flex",
            justifyContent: "center",
          }}
          viewMode={1}
          movable={false}
          zoomable={false}
          scalable={false}
          initialAspectRatio={840 / 180}
          aspectRatio={840 / 180}
          cropBoxResizable={false}
          minContainerHeight={180}
          minCropBoxHeight={180}
          background={false}
          guides={false}
          ref={cropperRef}
        />
      );*/
      return (
        <BootstrapModal
          show={true}
          handleClose={closeButton}
          modaltitle={modalheader}
          modalbody={modalbody}
          modalfooter={modalfooter}
        ></BootstrapModal>
      );
    } catch (error) {
      return null;
    }
  };
  const closeButton = () => {
    setShow(false);
  };

  return coverImage.preview ? (
    <BootstrapModal
      show={true}
      handleClose={closeButton}
      modaltitle={modalheader}
      modalbody={modalbody}
      modalfooter={modalfooter}
    ></BootstrapModal>
  ) : (
    <BootstrapModal
      show={false}
      handleClose={closeButton}
      modaltitle={modalheader}
      modalbody={modalbody}
      modalfooter={modalfooter}
    ></BootstrapModal>
  );
};

export default ImageCropper;
