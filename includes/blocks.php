<?php
/**
 * Gutenberg blocks registration.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register custom blocks from block.json metadata.
 *
 * @return void
 */
function sharetech_register_custom_blocks() {
	$blocks_root = get_stylesheet_directory() . '/custom-blocks';
	$block_metadata_files = glob( $blocks_root . '/*/block.json' );

	if ( empty( $block_metadata_files ) ) {
		return;
	}

	foreach ( $block_metadata_files as $metadata_file ) {
		$block_dir = dirname( $metadata_file );

		if ( file_exists( $metadata_file ) ) {
			register_block_type( $block_dir );
		}
	}
}

add_action( 'init', 'sharetech_register_custom_blocks' );