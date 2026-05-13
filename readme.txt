=== Freemius Lite SDK ===
Contributors:      bplugins
Tags:              sdk, opt-in, freemius, gutenberg, block
Requires at least: 6.0
Tested up to:      6.9
Requires PHP:      7.4
Stable tag:        2.2.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A lightweight Freemius-compatible opt-in SDK for WordPress Gutenberg block plugins.

== Description ==

Freemius Lite is a drop-in SDK that provides a Freemius-compatible user opt-in and consent flow for WordPress block plugins. It handles:

* **Opt-in consent form** — Full-page form shown on first activation.
* **Opt-in / Opt-out modal** — Accessible from the Plugins page action links.
* **Admin notices** — Activation-pending email confirmation notices.
* **Lifecycle events** — Plugin activation and deactivation tracking (only after explicit user consent).
* **Permission management** — Granular control over communication, diagnostic, and extension tracking.

**No data is ever sent to external servers before the user explicitly opts in.**

If the full Freemius SDK is detected (`fs_dynamic_init` exists), Freemius Lite defers to it automatically.

= Third-Party Services =

This SDK communicates with the following external services **only after the user explicitly opts in** via the consent form:

1. **bPlugins Middleware API** (`https://api.bplugins.com/wp-json/freemius/v1/middleware/`)
   Used for: Plugin activation/deactivation events and permission updates.
   Sent data: Site URL, WordPress version, PHP version, plugin version, locale, site title, and an anonymous site identifier.
   Privacy policy: [https://bplugins.com/privacy-policy](https://bplugins.com/privacy-policy)

2. **Freemius Opt-In Service** (`https://wp.freemius.com/action/service/user/install/`)
   Used for: Processing user opt-in form submissions.
   Sent data: User name, email, site URL, plugin slug/version, and WordPress environment info.
   Privacy policy: [https://freemius.com/privacy/](https://freemius.com/privacy/)
   Terms of service: [https://freemius.com/terms/](https://freemius.com/terms/)

3. **WordPress.org Plugin Assets** (`https://ps.w.org/`)
   Used for: Loading the plugin icon on the opt-in form.
   Sent data: None (GET request for a public image).

== Installation ==

Freemius Lite is not installed as a standalone plugin. It is bundled inside your block plugin as an SDK.

= Step 1 — Add the SDK =

Download the SDK zip from the releases and extract it into your plugin root:

`
your-plugin/
├── freemius-lite/
│   ├── build/
│   ├── inc/
│   │   └── FreemiusAdmin.php
│   ├── index.php
│   └── start.php
├── your-plugin.php
└── ...
`

= Step 2 — Bootstrap in PHP =

In your main plugin file, require and initialize the SDK:

`
if ( ! function_exists( 'your_prefix_fs' ) ) {
    function your_prefix_fs() {
        require_once plugin_dir_path( __FILE__ ) . 'freemius-lite/start.php';
        return fs_lite_dynamic_init( array(
            'id'         => '12345',
            'slug'       => 'your-plugin-slug',
            'public_key' => 'pk_xxxxxxxxxxxxxxxxxxxxxxx',
            'prefix'     => 'your_prefix',
            '__FILE__'   => __FILE__,
            'menu'       => array(
                'first-path' => 'options-general.php?page=your-settings',
            ),
        ) );
    }
    your_prefix_fs();
} else {
    your_prefix_fs()->uninstall_plugin();
}
`

= Configuration Parameters =

* **id** (required) — Your Freemius plugin ID.
* **slug** (required) — Your plugin slug (must match the plugin directory name).
* **public_key** (required) — Your Freemius public key.
* **prefix** (optional) — Prefix for options and DOM elements. Defaults to slug.
* **__FILE__** (required) — The main plugin file path. Pass `__FILE__`.
* **menu.first-path** (optional) — Admin page to redirect to after opt-in. Defaults to `plugins.php`.

= Step 3 — Premium Feature Gating (PHP) =

`
$fs = your_prefix_fs();

if ( $fs->can_use_premium_feature() ) {
    // Premium-only code.
}
`

Note: In Freemius Lite, `can_use_premium_feature()` always returns `false`. This is intentional — the Lite SDK provides API compatibility so your code works with both Freemius and Freemius Lite without changes. When the full Freemius SDK is active, it takes over and returns the real license status.

= Step 4 — Free/Pro Plugin Switching =

To deactivate the free version when the pro version is activated (or vice versa):

`
$fs = your_prefix_fs();
$fs->set_basename( true, __FILE__ );
`

== Frequently Asked Questions ==

= Does this SDK send data without user consent? =

No. All remote API calls are gated behind explicit user opt-in. The lifecycle hooks (activation/deactivation) only fire after the user has submitted the consent form. This complies with WordPress.org Plugin Guidelines 7 and 9.

= What happens if the full Freemius SDK is also present? =

`fs_lite_dynamic_init()` checks for `fs_dynamic_init()` first. If the full Freemius SDK is active, it delegates to it and Freemius Lite does nothing.

= What PHP versions are supported? =

PHP 7.4 through 8.5.

= What WordPress versions are supported? =

WordPress 6.0 through 6.9.

= Can I use this with non-block plugins? =

Yes. The SDK works with any WordPress plugin. The React-based opt-in form and modal are rendered via `wp-scripts` and only require `react`, `react-dom`, and `wp-util` as dependencies — all of which are available in the WordPress admin since WordPress 5.0+.

= What is the `unique_id` / `fs_lite_unique_id` option? =

An anonymous site identifier (MD5 hash) used to track activation/deactivation events. It contains no personally identifiable information. The SDK migrates from the legacy `unique_id` option name to the namespaced `fs_lite_unique_id` automatically.

== Changelog ==

= 2.2.0 =
* Security: Secret keys are no longer exposed in AJAX responses.
* Security: Nonce actions scoped per plugin ID to prevent cross-plugin validation.
* Security: AJAX action `fs_init` namespaced to `fs_lite_init_{id}`.
* Compatibility: PHP 7.4+ support (removed `private const`).
* Compatibility: React 18 `createRoot` API (removed deprecated `render`).
* Fix: `class_exists` guard on `FreemiusLiteAdmin` prevents fatal errors with multiple SDK instances.
* Fix: `fs_lite_dynamic_init` return type removed for Freemius SDK interop.
* Fix: `unique_id` option renamed to `fs_lite_unique_id` with automatic migration.
* Fix: `useWPAjax` hook — moved guard inside callback to comply with React Rules of Hooks.
* Fix: Query parameter parsing rewritten with `URLSearchParams`.
* Improvement: Capability check reordered before option read in redirect handler.

= 0.1.0 =
* Initial release.


= Freemius Lite SDK =

* **Source:** [https://bplugins.com/](https://bplugins.com/)
* **GitHub:** [https://github.com/bPlugins/freemius-lite-sdk](https://github.com/bPlugins/freemius-lite-sdk)
* **License:** GPL-2.0-or-later – [https://www.gnu.org/licenses/gpl-2.0.html](https://www.gnu.org/licenses/gpl-2.0.html)
* **Purpose:** Provides an opt-in consent form for usage tracking and analytics to help improve the plugin. No data is sent before explicit user consent.
* **External Services:** Communicates with `api.bplugins.com` (activation events) and `wp.freemius.com` (opt-in processing) only after user opt-in. See [bPlugins Privacy Policy](https://bplugins.com/privacy-policy) and [Freemius Privacy Policy](https://freemius.com/privacy/).
