import React from "react";
import { createRoot } from 'react-dom/client';

import OptInModalFreemius from "../components/OptInModal/OptInModalFreemius";
import OptInFromFreemius from "../components/OptInForm/OptInFromFreemius";
import InitializeActivation from "../components/OptInModal/InitializeActivation";

const bsdkOptInFormHandler = (prefix) => {
  const dom = document.getElementById(`${prefix}OptInForm`);

  if (dom) {
    const dataset = { ...dom.dataset } || {};

    const params = getQueryParams();
    if (params?.fs_action == `${dataset.slug}_activate_new` || params?.fs_action == `${dataset.slug}_skip_activation`) {
      createRoot(dom).render(<InitializeActivation info={params} pluginId={dataset.pluginId} {...dataset} />);
    } else {
      Object.keys(dom.dataset).map((key) => delete dom.dataset[key]);
      createRoot(dom).render(<OptInFromFreemius prefix={prefix} {...dataset} />);
    }

  }


  const modalDom = document.getElementById(`${prefix}OptInModal`);

  if (modalDom) {
    const dataset = { ...modalDom.dataset } || {};
    Object.keys(modalDom.dataset).map((key) => delete modalDom.dataset[key]);

    const params = getQueryParams();


    if (params?.fs_action == `${dataset.slug}_activate_new` || params?.fs_action == `${dataset.slug}_skip_activation`) {
      createRoot(modalDom).render(<InitializeActivation info={params} pluginId={dataset.pluginId} {...dataset} />);
    } else {
      createRoot(modalDom).render(<OptInModalFreemius prefix={prefix} {...dataset} />);
    }
  }
};

window.bsdkOptInFormHandler = bsdkOptInFormHandler;

export function getQueryParams(url = window.location.href) {
  try {
    const params = new URL(url).searchParams;
    const result = {};
    for (const [key, value] of params) {
      result[key] = key.includes("is") || key === "pending_activation"
        ? value === "1"
        : value;
    }
    return result;
  } catch (e) {
    return {};
  }
}
