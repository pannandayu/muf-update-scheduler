import React, { useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

const ModalCard: React.FC<{
  isOpen: boolean;
  onClose: (event: React.MouseEvent | React.KeyboardEvent) => void;
  children?: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    return () => {
      document.body.removeAttribute("class");
      document.getElementById("__next")?.removeAttribute("aria-hidden");
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Modal"
      style={{
        content: {
          width: "20%",
          height: "20%",
          margin: "auto",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "20px",
        },
      }}
    >
      <div>{children}</div>
    </Modal>
  );
};

export default ModalCard;
