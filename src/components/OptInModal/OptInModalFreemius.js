import { useState, useRef, useEffect } from "react";
// import Freemius_Api from "../../lib/Freemius_Api";
import "./style.scss";
import useWPAjax from "../../utils/useWPAjax";
import SimpleLoader from "../SimpleLoader";

const OptInModalFreemius = ({ prefix, pluginId, nonce, slug }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentlySaving, setCurrentlySaving] = useState(null);
  const { data, isLoading, error, isError, saveData } = useWPAjax(`bsdk_fetch_info_${pluginId}`, { nonce, type: "modal" });
  // const { data: fs_response, refetch: fs_Api, isLoading: fsLoading, error: fs_error } = useWPAjax(`fs_api_request`, { nonce }, true);
  const modalBtnRef = useRef();
  const communicationRef = useRef();
  const diagnosticRef = useRef();
  const permissionsRef = useRef();
  const { is_events_tracking_allowed, is_extensions_tracking_allowed, is_site_tracking_allowed, is_user_tracking_allowed } = data?.data || {};

  useEffect(() => {
    if (!showModal && error) {
      saveData();
    }
  }, [showModal]);

  const handleBtnClick = (e) => {
    e.preventDefault();
    setShowModal(!showModal);
  };

  useEffect(() => {
    modalBtnRef.current = document.querySelector(`.optInBtn.${slug}`);
    modalBtnRef.current?.addEventListener("click", handleBtnClick);

    communicationRef.current.querySelector(`.fs-opt-out-cancel-button`)?.addEventListener("click", () => {
      communicationRef.current.style.display = "none";
      permissionsRef.current.style.display = "block";
    });

    // Opt out Communication
    communicationRef.current.querySelector(`.fs-opt-out-button`)?.addEventListener("click", (e) => {
      e.preventDefault();
      saveData({ thread: "permission_update", permissions: "user", is_enabled: false });
      setCurrentlySaving("user");
    });

    diagnosticRef.current.querySelector(`.fs-opt-out-cancel-button`)?.addEventListener("click", () => {
      diagnosticRef.current.style.display = "none";
      permissionsRef.current.style.display = "block";
    });

    // Opt out Diagnostic
    diagnosticRef.current.querySelector(`.fs-opt-out-button`)?.addEventListener("click", (e) => {
      e.preventDefault();
      saveData({ thread: "permission_update", permissions: "site", is_enabled: false });
      setCurrentlySaving("site");
    });
  }, []);

  // Enable/Disable Extension Tracking
  const handleExtension = (e) => {
    e.preventDefault();
    saveData({ thread: "permission_update", is_enabled: !is_extensions_tracking_allowed, permissions: "extensions" });
    setCurrentlySaving(e.target?.classList?.contains("fs-switch") ? "extensions-toggle" : "extensions");
  };

  // Enabled Communication Tracking
  const handleCommunication = (e) => {
    e.preventDefault();
    if (is_user_tracking_allowed) {
      communicationRef.current.style.display = "block";
      permissionsRef.current.style.display = "none";
    } else {
      saveData({ thread: "permission_update", is_enabled: true, permissions: "user" });
      setCurrentlySaving("user");
    }
  };

  // Enable Diagnostic Tracking
  const handleDiagnostic = (e) => {
    e.preventDefault();
    if (is_events_tracking_allowed && is_site_tracking_allowed) {
      diagnosticRef.current.style.display = "block";
      permissionsRef.current.style.display = "none";
    } else {
      saveData({ thread: "permission_update", is_enabled: true, permissions: "site" });
      setCurrentlySaving("site");
    }
  };

  const handleModalClose = (e) => {
    e.preventDefault();
    setShowModal(false);
    communicationRef.current.style.display = "none";
    diagnosticRef.current.style.display = "none";
    permissionsRef.current.style.display = "block";
  };

  useEffect(() => {
    if (!isLoading && modalBtnRef.current) {
      if (!is_site_tracking_allowed || !is_user_tracking_allowed || !is_events_tracking_allowed || !is_extensions_tracking_allowed) {
        modalBtnRef.current.innerText = "Opt In";
      } else {
        modalBtnRef.current.innerText = "Opt Out";
      }
      if (showModal) {
        communicationRef.current.style.display = "none";
        diagnosticRef.current.style.display = "none";
        permissionsRef.current.style.display = "block";
      }
    }
  }, [data, isLoading]);

  return (
    <div
      id={`fs_opt_out_${data?.id}`}
      className={`fs-modal fs-modal-opt-out ${showModal ? "active" : ""}`}
      data-plugin-id={data?.id}
      data-action={`fs_toggle_permission_tracking_${data?.id}`}
      data-security={nonce}
    >
      <div className="fs-modal-dialog">
        <div className="fs-modal-header">
          <h4>Opt Out</h4>
          <a href="!#" className="fs-close" onClick={handleModalClose}>
            <i className="dashicons dashicons-no" title="Dismiss"></i>
          </a>
        </div>
        <div className="fs-opt-out-permissions" ref={permissionsRef}>
          <div className="fs-modal-body">
            <div className="notice notice-error inline opt-out-error-message" style={{ display: isError ? "block" : "none" }}>
              <p>{typeof error === "string" ? error : "Something went wrong!"}</p>
            </div>
            <div className="fs-permissions fs-open">
              <div className="fs-permissions-section fs-communication-permissions">
                <div>
                  <div className="fs-permissions-section--header">
                    <a
                      onClick={handleCommunication}
                      className="fs-group-opt-out-button"
                      data-type="required"
                      data-group-id="communication"
                      data-is-enabled={is_user_tracking_allowed}
                      href="#"
                      disabled={isLoading && currentlySaving === "user"}
                    >
                      {is_user_tracking_allowed ? "Opt Out" : "Opt In"}
                    </a>
                    {isLoading && currentlySaving === "user" && <SimpleLoader className="fs-opt-in-loader" style={{ float: "right" }} />}
                    <span className="fs-permissions-section--header-title">Communication</span>
                  </div>
                  <p className="fs-permissions-section--desc"></p>
                </div>
                <ul>
                  <li id="fs_permission_user" data-permission-id="user" className={`fs-permission fs-user ${is_user_tracking_allowed ? "" : "fs-disabled"}`}>
                    <i className="dashicons dashicons-admin-users"></i>

                    <div className="fs-permission-description">
                      <span className="fs-tooltip-trigger">
                        View Basic Profile Info
                        <i className="dashicons dashicons-editor-help">
                          <span className="fs-tooltip" style={{ width: "200px" }}>
                            Never miss important updates, get security warnings before they become public knowledge, and receive notifications about special offers and awesome new features.
                          </span>
                        </i>
                      </span>

                      <p>Your WordPress {"user's"}: first & last name, and email address</p>
                    </div>
                  </li>
                </ul>
              </div>
              <hr />
              <div className="fs-permissions-section fs-diagnostic-permissions">
                <div>
                  <div className="fs-permissions-section--header">
                    <a
                      className="fs-group-opt-out-button"
                      data-type="required"
                      data-group-id="diagnostic"
                      data-is-enabled="true"
                      href="#"
                      onClick={handleDiagnostic}
                      disabled={isLoading && currentlySaving === "site"}
                    >
                      {is_events_tracking_allowed && is_site_tracking_allowed ? "Opt Out" : "Opt In"}
                    </a>
                    {isLoading && currentlySaving === "site" && <SimpleLoader className="fs-opt-in-loader" style={{ float: "right" }} />}
                    <span className="fs-permissions-section--header-title">Diagnostic Info</span>
                  </div>
                  <p className="fs-permissions-section--desc"></p>
                </div>
                <ul>
                  <li id="fs_permission_site" data-permission-id="site" className={`fs-permission fs-site ${is_site_tracking_allowed ? "" : "fs-disabled"}`}>
                    <i className="dashicons dashicons-admin-links"></i>

                    <div className="fs-permission-description">
                      <span className="fs-tooltip-trigger">
                        View Basic Website Info
                        <i className="dashicons dashicons-editor-help">
                          <span className="fs-tooltip" style={{ width: "200px" }}>
                            To provide additional functionality {"that's"} relevant to your website, avoid WordPress or PHP version incompatibilities that can break your website, and recognize which
                            languages & regions the plugin should be translated and tailored to.
                          </span>
                        </i>
                      </span>

                      <p>Homepage URL & title, WP & PHP versions, and site language</p>
                    </div>
                  </li>
                  <li id="fs_permission_events" data-permission-id="events" className={`fs-permission fs-events ${is_events_tracking_allowed ? "" : "fs-disabled"}`}>
                    <i className="dashicons dashicons-admin-plugins"></i>

                    <div className="fs-permission-description">
                      <span>View Basic Plugin Info</span>

                      <p>Current plugin & SDK versions, and if active or uninstalled</p>
                    </div>
                  </li>
                </ul>
              </div>
              <hr />
              <div className="fs-permissions-section fs-extensions-permissions">
                <div>
                  <div className="fs-permissions-section--header">
                    <a
                      onClick={handleExtension}
                      disabled={isLoading && ["extensions", "extensions-toggle"].includes(currentlySaving)}
                      className="fs-group-opt-out-button"
                      data-type="optional"
                      data-group-id="extensions"
                      data-is-enabled="true"
                      href="#"
                    >
                      {is_extensions_tracking_allowed ? "Opt Out" : "Opt In"}
                    </a>
                    {isLoading && currentlySaving === "extensions" && <SimpleLoader className="fs-opt-in-loader" style={{ float: "right" }} />}
                    <span className="fs-permissions-section--header-title">Extensions</span>
                  </div>
                  <p className="fs-permissions-section--desc"></p>
                </div>
                <ul>
                  <li id="fs_permission_extensions" data-permission-id="extensions" className={`fs-permission fs-extensions ${is_extensions_tracking_allowed ? "" : "fs-disabled"}`}>
                    <i className="dashicons dashicons-block-default"></i>
                    <div
                      onClick={handleExtension}
                      disabled={isLoading && ["extensions", "extensions-toggle"].includes(currentlySaving)}
                      className={`fs-switch fs-small fs-round fs-${is_extensions_tracking_allowed ? "on" : "off"}`}
                    >
                      <div className="fs-toggle"></div>
                    </div>
                    {isLoading && currentlySaving === "extensions-toggle" && <SimpleLoader className="fs-opt-in-loader" style={{ float: "right", marginTop: "8px" }} />}

                    <div className="fs-permission-description">
                      <span className="fs-tooltip-trigger">
                        View Plugins & Themes List
                        <i className="dashicons dashicons-editor-help">
                          <span className="fs-tooltip" style={{ width: "200px" }}>
                            To ensure compatibility and avoid conflicts with your installed plugins and themes.
                          </span>
                        </i>
                      </span>

                      <p>Names, slugs, versions, and if active or not</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="fs-modal-footer">
            <button className="button button-primary button-close" tabIndex="1" onClick={() => setShowModal(false)}>
              Done
            </button>
          </div>
        </div>
        <div ref={communicationRef} className="fs-communication-opt-out fs-opt-out-disclaimer" data-group-id="communication" style={{ display: "none" }}>
          <div className="fs-modal-body">
            <div className="fs-modal-panel active">
              <div className="notice notice-error inline opt-out-error-message" style={{ display: isError ? "block" : "none" }}>
                <p>{typeof error === "string" ? error : "Something went wrong!"}</p>
              </div>
              <p>
                Sharing your name and email allows us to keep you in the loop about new features and important updates, warn you about security issues before they become public knowledge, and send you
                special offers.
              </p>
              <p>
                By clicking {'"Opt Out"'}, <strong>{data?.plugin_name}</strong> will no longer be able to view your name and email.
              </p>
            </div>
          </div>
          <div className="fs-modal-footer">
            {isLoading && currentlySaving === "user" && <SimpleLoader className="fs-opt-in-loader" />}
            <a disabled={isLoading} className="fs-opt-out-button" tabIndex="2" href="#">
              Opt Out
            </a>
            <button disabled={isLoading} className="button button-primary fs-opt-out-cancel-button" tabIndex="1">
              Stay Connected
            </button>
          </div>
        </div>
        <div ref={diagnosticRef} className="fs-diagnostic-opt-out fs-opt-out-disclaimer" data-group-id="diagnostic" style={{ display: "none" }}>
          <div className="fs-modal-body">
            <div className="fs-modal-panel active">
              <div className="notice notice-error inline opt-out-error-message" style={{ display: isError ? "block" : "none" }}>
                <p>{typeof error === "string" ? error : "Something went wrong!"}</p>
              </div>
              <p>
                Sharing diagnostic data helps to provide additional functionality{"that's"} relevant to your website, avoid WordPress or PHP version incompatibilities that can break the website, and
                recognize which languages & regions the plugin should be translated and tailored to.
              </p>
              <p>
                By clicking {'"Opt Out"'}, diagnostic data will no longer be sent to <strong>{data?.plugin_name}</strong>.
              </p>
            </div>
          </div>
          <div className="fs-modal-footer">
            {isLoading && currentlySaving === "site" && <SimpleLoader className="fs-opt-in-loader" />}
            <a disabled={isLoading} className="fs-opt-out-button" tabIndex="2" href="#">
              Opt Out
            </a>
            <button disabled={isLoading} className="button button-primary fs-opt-out-cancel-button" tabIndex="1">
              Keep Sharing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptInModalFreemius;
