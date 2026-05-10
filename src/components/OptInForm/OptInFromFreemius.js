/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react"
import "./style.scss";
import useWPAjax from "../../utils/useWPAjax";

const OptInFromFreemius = ({ nonce, pluginId }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { data } = useWPAjax("bsdk_fetch_info_" + pluginId, { nonce });
  const return_url = `${data?.admin_url}admin.php?page=${data?.slug}-opt-in&fs_action=${data?.slug}_activate_new&_wpnonce=${data?.nonce}`;
  const skip_url = `${data?.admin_url}${data?.menu?.["first-path"] ? data?.menu?.["first-path"] : 'plugins.php'}`;

  return (
    <div id="fs_connect" className="wrap">
      <div className="fs-header">
        <b className="fs-site-icon">
          <i className="dashicons dashicons-wordpress-alt"></i>
        </b>
        <div className="fs-plugin-icon">
          <img src={`https://ps.w.org/${data?.slug}/assets/icon-128x128.png`} width="50" height="50" />
        </div>
        <img className="fs-connect-logo" src="//img.freemius.com/logo/connect.svg" />
      </div>
      <div className="fs-box-container">
        <div className="fs-content">
          <h2 style={{ textAlign: "center" }}>Never miss an important update</h2>
          <p>
            Opt in to get email notifications for security &amp; feature updates, educational content, and occasional offers, and to share some basic WordPress environment info. This will help us make
            the plugin more compatible with your site and better at doing what you need it to.
          </p>
        </div>
        <div className="fs-actions">
          <a
            id="skip_activation"
            href={skip_url}
            className="button button-secondary"
            tabindex="2"
          >
            Skip
          </a>
          <form method="POST" action={data?.freemius_form_action}>
            <>
              <input type="hidden" name="sdk_version" value="2.5.12" />
              <input type="hidden" name="platform_version" value={data?.platform_version} />
              <input type="hidden" name="programming_language_version" value={data?.programming_language_version} />
              <input type="hidden" name="user_firstname" value={data?.user_first_name} />
              <input type="hidden" name="user_lastname" value={data?.user_last_name} />
              <input type="hidden" name="user_email" value={data?.user_email} />
              {/* <input type="hidden" name="user_email" value={"nahid.sulatana@gmail.com"} /> */}
              <input type="hidden" name="plugin_slug" value={data?.slug} />
              <input type="hidden" name="plugin_id" value={data?.id} />
              <input type="hidden" name="plugin_public_key" value={data?.public_key} />
              <input type="hidden" name="plugin_version" value={data?.plugin_version} />
              <input type="hidden" name="return_url" value={return_url} />
              <input type="hidden" name="account_url" value={data?.admin_url + `admin.php?_wpnonce=${data?.nonce}`} />
              <input type="hidden" name="is_premium" value="" />
              <input type="hidden" name="is_active" value="1" />
              <input type="hidden" name="is_uninstalled" value="" />
              <input type="hidden" name="is_localhost" value={window.location.host === "localhost" ? "1" : ""} />
              <input type="hidden" name="site_name" value={data?.site_name} />
              <input type="hidden" name="language" value="en-US" />
              <input type="hidden" name="site_uid" value={data?.uid} />
              <input type="hidden" name="site_url" value={data?.site_url} />
              <input type="hidden" name="is_extensions_tracking_allowed" value="1" />
              <input type="hidden" name="is_diagnostic_tracking_allowed" value="1" />
            </>

            <button className="button button-primary" tabindex="1" type="submit">
              Allow & Continue
            </button>
          </form>
        </div>
        <div className="fs-permissions">
          <a
            className="fs-trigger wp-core-ui"
            href="#"
            tabindex="1"
            style={{ color: "inherit" }}
            onClick={(e) => {
              e.preventDefault();
              setShowDetails(!showDetails);
            }}
          >
            This will allow
            <nobr className="button-link" style={{ color: "inherit" }}>
              {" "}
              {data?.plugin_name}
            </nobr>{" "}
            to<b className="fs-arrow"></b>
          </a>
          {showDetails && (
            <ul>
              <li id="fs_permission_user" data-permission-id="user" className="fs-permission fs-user">
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
                  <p>Your WordPress users: first &amp; last name, and email address</p>
                </div>
              </li>
              <li id="fs_permission_site" data-permission-id="site" className="fs-permission fs-site">
                <i className="dashicons dashicons-admin-links"></i>
                <div className="fs-permission-description">
                  <span className="fs-tooltip-trigger">
                    View Basic Website Info
                    <i className="dashicons dashicons-editor-help">
                      <span className="fs-tooltip" style={{ width: "200px" }}>
                        To provide additional functionality thats relevant to your website, avoid WordPress or PHP version incompatibilities that can break your website, and recognize which languages
                        &amp; regions the plugin should be translated and tailored to.
                      </span>
                    </i>
                  </span>
                  <p>Homepage URL &amp; title, WP &amp; PHP versions, and site language</p>
                </div>
              </li>
              <li id="fs_permission_events" data-permission-id="events" className="fs-permission fs-events">
                <i className="dashicons dashicons-admin-plugins"></i>
                <div className="fs-permission-description">
                  <span>View Basic Plugin Info</span>
                  <p>Current plugin &amp; SDK versions, and if active or uninstalled</p>
                </div>
              </li>
              <li id="fs_permission_extensions" data-permission-id="extensions" className="fs-permission fs-extensions">
                <i className="dashicons dashicons-block-default"></i>
                <div className="fs-switch fs-small fs-round fs-on">
                  <div className="fs-toggle"></div>
                </div>

                <div className="fs-permission-description">
                  <span className="fs-tooltip-trigger">
                    View Plugins &amp; Themes List
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
          )}
        </div>
      </div>
      <div className="fs-terms">
        <a className="fs-tooltip-trigger" href={`https://freemius.com/product/opt-in/${data?.id}/${data?.slug}/`} target="_blank" rel="noreferrer" tabindex="1">
          Powered by Freemius
        </a>
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <a href="https://freemius.com/privacy/" target="_blank" rel="noreferrer" tabindex="1">
          Privacy Policy
        </a>
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <a href={`https://freemius.com/product/opt-in/${data?.id}/${data?.slug}/`} target="_blank" rel="noreferrer" tabindex="1">
          Terms of Service
        </a>
      </div>
    </div>
  );
};

export default OptInFromFreemius;
