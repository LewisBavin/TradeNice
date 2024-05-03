import React, { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const MyToast = ({ toastSettings }) => {
  let { strong, small, body, delay, variant, trigger } = toastSettings;
  const [show, setShow] = useState(trigger || false);
  return (
    <>
      <ToastContainer className="toast-container position-fixed top-50 end-0 translate-middle-y p-3">
        <Toast
          onClose={() => {
            setShow(false);
          }}
          show={show}
          delay={!delay ? 5000 : delay}
          autohide
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">{!strong ? "" : strong}</strong>
            <small className="text-muted">{!small ? "" : small}</small>
          </Toast.Header>
          <Toast.Body className={!variant ? "" : variant}>
            {!body ? "" : body}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default MyToast;
