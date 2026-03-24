<?php
/**
 * ShareTech Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package ShareTech
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Define Constants
 */
define( 'CHILD_THEME_SHARETECH_VERSION', '1.0.0' );

require_once get_stylesheet_directory() . '/includes/theme-setup.php';

sharetech_theme_setup();