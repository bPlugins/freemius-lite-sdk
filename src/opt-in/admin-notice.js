// eslint-disable-next-line react/no-deprecated
import { createRoot } from "react-dom/client";

import AdminNotice from "../components/Notice/AdminNotice";
import jsonParse from "../utils/jsonParse";

document.addEventListener("DOMContentLoaded", () => {
  const notices = document.querySelectorAll(`.fs_notice_board`);
  notices.forEach((dom) => {
    const dataset = { ...dom.dataset } || {};
    Object.keys(dom.dataset).map((key) => delete dom.dataset[key]);

    const notice = jsonParse(dataset.notice);
    if (notice.message) {
      dom.classList.add("notice");
      dom.classList.add("notice-success");
      dom.classList.add("is-dismissible");
      dom.setAttribute("id", "message");
    }
    const root = createRoot(dom);
    root.render(<AdminNotice {...notice} nonce={dataset.nonce} slug={dataset.slug} />);
  });
});
