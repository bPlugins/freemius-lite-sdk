import { useEffect } from "react";
import useWPAjax from "../../utils/useWPAjax";

const InitializeActivation = ({ info, nonce, pluginId }) => {
  const { install_secret_key, install_public_key, install_id, pending_activation = false, fs_action, is_skip_activation } = info;
  const { data, isLoading, refetch } = useWPAjax("fs_lite_init_" + pluginId, { nonce, info, site: { install_id, id: install_id, plan_id: null, public_key: install_public_key, secret_key: install_secret_key } }, true);


  useEffect(() => {
    if (data) {
      const next_url = data?.config?.menu?.["first-path"] ? data.admin_url + data?.config?.menu?.["first-path"] : data.admin_url + 'plugins.php';
      window.location.href = next_url;
    }
  }, [data, isLoading]);

  useEffect(() => {
    // window.history.pushState("object or string", "Title", window.location.origin + window.location.pathname);
    const data = {};
    if (pending_activation) {
      data.notice = {
        activation_pending: {
          message: `You should receive a confirmation email for {name} to your mailbox at {email}. Please make sure you click the button in that email to complete the opt-in.`,
          title: "Thanks!",
          type: "success",
          id: "activation_pending",
          dismissible: true,
          sticky: true,
        },
      };

    } else {
      // window.history.pushState("object or string", "Title", data.admin_url + data?.config?.menu?.["first-path"]);

    }
    refetch(data);
  }, []);

  //   console.log(info);
  return <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '85vh' }}>


    <svg height="100px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="#2F29FF" stroke="#2F29FF" stroke-width="20" width="30" height="30" x="25" y="85"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></rect><rect fill="#2F29FF" stroke="#2F29FF" stroke-width="20" width="30" height="30" x="85" y="85"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></rect><rect fill="#2F29FF" stroke="#2F29FF" stroke-width="20" width="30" height="30" x="145" y="85"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></rect></svg>
  </div>;
};

export default InitializeActivation;
