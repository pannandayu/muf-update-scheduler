import { ReactNode, useEffect } from "react";
import ReactModal from "react-modal";
import styles from "@/styles/Modal.module.css";

const Modal: React.FC<{
  children: ReactNode;
  modalState: boolean;
  modalHandler: () => void;
}> = ({ children, modalState, modalHandler }) => {
  useEffect(() => {
    return () => {
      document.body.removeAttribute("style");
      document.body.removeAttribute("class");
      document.body.querySelector(".ReactModalPortal")?.remove();
    };
  }, []);

  return (
    <ReactModal
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          padding: "2rem",
          textAlign: "center",
        },
      }}
      isOpen={modalState}
      ariaHideApp={false}
    >
      {children}
      <button onClick={modalHandler} className={styles.button}>
        Close
      </button>
    </ReactModal>
  );
};

export default Modal;
