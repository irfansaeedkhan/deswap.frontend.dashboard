import React, { useEffect, useRef } from "react";
// import Button from '../button/Button';
import styles from "../../styles/modal.module.scss";
import Image from "next/image";

// const NavbarToggle = () => {
//   const body = document.querySelector("body");
//   body.classList.toggle("open");
// };
const Modal = ({
  modalStyle,
  children,
  show,
  onClose,
  backdropStyle,
  modaltitle,
  cross,
}) => {
  const modalRef = useRef(null);
  useEffect(() => {
    const body = document.querySelector("body");

    if (show) {
      modalRef.current.classList.add(styles.visible);
      body.classList.add("open");
    } else {
      modalRef.current.classList.remove(styles.visible);
      body.classList.remove("open");
    }
  }, [show]);
  return (
    <React.Fragment>
      <div
        ref={modalRef}
        style={backdropStyle}
        className={`${styles.modal__wrap}`}
      >
        <div style={modalStyle} className={styles.modal}>
          {!cross && (
            <div className={styles.modalTitleContainer}>
              <h5 className={styles.title}>{modaltitle}</h5>
              <Image
                src={"/images/close.png"}
                width={24}
                height={25}
                alt="close icon"
                className={styles.closeicon}
                onClick={onClose}
                loading="lazy"
              />
            </div>
          )}

          {children}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Modal;
