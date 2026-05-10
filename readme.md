# Documentation

## **Step 1 - Install**

### To Integrate only Opted form (Only for Freemius plugins)

1. Download the sdk.zip from https://github.com/bPlugins/freemius-lite/raw/refs/heads/minimal-php/zip/freemius-lite.zip
2. unzip and put it on your plugin root folder

## **Step 2 - config.json**

find the 'config.json' file on sdk root folder and replace data with your data

# or

create a file name 'bsdk_config.json' on your plugin root folder and populate with your data. (follow config.json on sdk root folder)

`config.json file format is changed`

## **Step 3 - PHP**

Require the init.php file from {sdk folder} on the main plugin file
call the class BPlugins_SDK with 1 arguments \
@constant - \_\_FILE\_\_

> Example

```
if(!function_exists('ttp_init')){
    function ttp_init(){
        global $ttp_bs;
        require_once(plugin_dir_path(__FILE__).'bplugins_sdk/init.php');
        $ttp_bs = new BPlugins_SDK(__FILE__);
        return $ttp_bs;
    }
    ttp_init();
}else {
	ttp_init()->uninstall_plugin();
}

```

## Protect from using premium feature in php

```
$ttp_bs->can_use_premium_feature()
```

## **Step 4 - Javascript**

import BPLSDK from "../bplugins_sdk/src/components/v1/BPLSDK";

use it on your Edit components

> Example

```
<BPLSDK setAttributes={setAttributes} />
```

## Freeemius SDK information.

<details>

<summary style="margin-bottom:18px;"> <b style="font-size:20px;">Permission enable/disable</b></summary>

```php

  // Init SDK.
  $api = new Freemius_Api('install', 'FS__API_INSTALL_ID', FS__API_PUBLIC_KEY, FS__API_SECRET_KEY);

  // Update.
  $result = $api->Api("/permissions.json?sdk_version=2.5.12&url=http://localhost/freemius", 'PUT', array(
    "permissions" => "site" // site | extensions,
    "is_enabled" => true
  ));
```

</details>

<details>
<summary style="margin-bottom:18px;"> <b style="font-size:20px;">How to monitor all request from Freemius SDK</b></summary>

### Put this code on FreemiusBase.php - method \_Api() before return on freemius SDK

```php

global $wpdb;
$table_name = $wpdb->prefix . 'your_custom_table';
try {
    $wpdb->insert( $table_name, [
        'response' => wp_json_encode($result),
        'path' => $pPath,
        'method' => $pMethod,
        'params' => wp_json_encode($pParams),
        'info' => wp_json_encode([
        'id' => $this->_id,
        'scope' => $this->_scope,
        'public' => $this->_public,
        'secret' => $this->_secret
        ])
    ]);
} catch (\Throwable $th) {
  try {
    $wpdb->insert( $table_name, [
      'path' => $pPath,
      'method' => $pMethod,
      'params' => wp_json_encode($pParams),
    ]);
  } catch (\Throwable $th) {
  //throw $th;
  }
}

```

### Create a plugin and put this code on plugin main file

```php

<?php

/*
 * Plugin Name: Freemius Request Monitor
 */

 add_action('admin_init', function(){
    if(!get_option('database_created')){
        global $wpdb;
        $table_name = $wpdb->prefix . 'your_custom_table'; // Replace 'your_custom_table' with your desired table name

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id INT AUTO_INCREMENT PRIMARY KEY,
            path VARCHAR(255),
            method VARCHAR(10),
            params TEXT,
            response TEXT,
			info TEXT
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);

       	//wp_update_user(['ID' => 1, 'user_email' => 'shagir.islam@gmail.com']);
        update_option('database_created', 'true');
    }
 });

```

</details>
