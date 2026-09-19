import React, { Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";

function BootstrapModal({
  show,
  handleClose,
  modaltitle,
  modalfooter,
  modalbody,
  children,
}) {
  return (
    <Modal
      show={show}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.51)" }}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="customBootstrapModal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {modaltitle}
        </Modal.Title>
        <Image
          src={"/images/close.png"}
          width={24}
          height={25}
          alt="close icon"
          className="closeicon"
          onClick={handleClose}
          loading="lazy"
        />
      </Modal.Header>
      <Modal.Body>{modalbody}</Modal.Body>
      <Modal.Footer>{modalfooter}</Modal.Footer>
    </Modal>
  );
}

export default BootstrapModal;
