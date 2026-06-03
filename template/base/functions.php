<?php
// Includes dev mode configuration
if(file_exists(__DIR__ . '/dev config/dev-mode.php')) {
    include "dev config/dev-mode.php";
}

// Enqueue Vite assets in WordPress
function theme_enqueue_assets() {

    // Checks the current template being used
    function get_current_template_name() {
        if ( is_front_page() ) return 'front-page';
        if ( is_home() ) return 'home';
        if ( is_single() ) return 'single';
        if ( is_page() ) {
            $tpl = get_page_template_slug();
            return $tpl ? basename( $tpl, '.php' ) : 'page';
        }
        if ( is_404() ) return '404';
        return 'index';
    }

    // Checks for the dev configuration
    if (defined('WP_ENV') && WP_ENV === 'development') {
        // Dev build

        // Inject Vite HMR client and module entry points manually
        add_action('wp_head', function () {
            $dev_file = get_template_directory() . "/src/" . get_current_template_name() . ".js";
            $local_file = 'http://localhost:5173/src/'. get_current_template_name() . '.js';

            echo '<script type="module" src="http://localhost:5173/@vite/client"></script>';

            // Checks if a js file with the same name as the template exists.
            if (file_exists($dev_file)) {
                echo '<script type="module" src='. $local_file .'></script>';
            } else {
                echo '<script type="module" src="http://localhost:5173/src/main.js"></script>'; 
            }
        });
    } else {
        // Production build

        // Loads vite's manifest file
        $manifest = json_decode( file_get_contents( get_template_directory() . '/.vite/manifest.json' ), true );
        $keyExists = array_key_exists("src/" . get_current_template_name() . ".js", $manifest);
        
        // Checks if the keys exist in the manifest
        $prod_js_file = $keyExists ? get_template_directory() . "/" . $manifest["src/" . get_current_template_name() . ".js"]["file"] : null;
        $prod_css_files = $keyExists ? $manifest["src/" . get_current_template_name() . ".js"]["css"] : null;

        // Loads the main.js file if no other js files exists
        $js_file_name;
        if($prod_js_file !== null) {
            $js_file_name = file_exists($prod_js_file) ? $manifest["src/" . get_current_template_name() . ".js"]["file"] : "assets/main.js";
        } else {
            $js_file_name = "assets/main.js";
        }
        
        // Loads the main.css file if no other css files exists
        $css_file_names = [];
        if($prod_css_files !== null) {
            foreach ($prod_css_files as $file) {
                if(file_exists(get_template_directory() . "/" . $file)) {
                    array_push($css_file_names, $file);
                }
            }
            if(count($css_file_names) == 0) {
                array_push($css_file_names, "assets/main.css");
            }
        } else {
            array_push($css_file_names, "assets/main.css");
        }
        
        // Adds the files to the head and body tag
        wp_enqueue_script('theme-script', get_template_directory_uri() . "/" . $js_file_name, [], null, true);
        $i = 0;
        foreach ($css_file_names as $file) {
            wp_enqueue_style('theme-style-' . $i, get_template_directory_uri() . "/" . $file);
            $i++;
        }
        
    }
}
add_action('wp_enqueue_scripts', 'theme_enqueue_assets');


// Register theme support for menus
function register_menus() {
    register_nav_menus( array(
        'primary' => __( 'main navigation', 'My custom Vite theme' ),
    ));
}
add_action( 'after_setup_theme', 'register_menus' );

