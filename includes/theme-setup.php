<?php
/**
 * Theme bootstrap for ShareTech child theme.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load modular theme files.
 *
 * @return void
 */
function sharetech_theme_setup() {
	require_once get_stylesheet_directory() . '/includes/enqueue.php';
	require_once get_stylesheet_directory() . '/includes/blocks.php';
	require_once get_stylesheet_directory() . '/includes/woocommerce-editor.php';
	require_once get_stylesheet_directory() . '/includes/shop-archive.php';
	require_once get_stylesheet_directory() . '/includes/featured-products.php';
	require_once get_stylesheet_directory() . '/includes/footer.php';
	require_once get_stylesheet_directory() . '/includes/page-hero.php';
}