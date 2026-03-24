<?php
/**
 * Enqueue scripts and styles.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue child theme stylesheet.
 *
 * @return void
 */
function sharetech_enqueue_styles() {
	wp_enqueue_style(
		'sharetech-theme-css',
		get_stylesheet_directory_uri() . '/style.css',
		array( 'astra-theme-css' ),
		CHILD_THEME_SHARETECH_VERSION,
		'all'
	);
}

add_action( 'wp_enqueue_scripts', 'sharetech_enqueue_styles', 15 );