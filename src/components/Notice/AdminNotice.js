import React from "react";
import useWPAjax from "../../utils/useWPAjax";

const AdminNotice = ({ title, message, nonce, slug }) => {
  const noticeRef = React.useRef(null);
  const { data: response, error, refetch: dismissNotice } = useWPAjax(`fs_notice_dismiss_${slug}`, { nonce }, true);

  React.useEffect(() => {
    setTimeout(() => {
      const dismissBtn = noticeRef.current?.nextElementSibling;
      dismissBtn?.addEventListener("click", () => {
        dismissNotice(message);
      });
    }, 2000);
  }, []);

  return (
    <p ref={noticeRef} style={{ color: "green", fontSize: "15px" }}>
      {title ? <b>{title} </b> : ""}
      {message}
    </p>
  );
};

export default AdminNotice;
