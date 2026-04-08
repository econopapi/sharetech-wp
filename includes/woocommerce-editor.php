<?php
/**
 * WooCommerce editor integration.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enable block editor for WooCommerce products.
 *
 * @param bool   $can_edit  Whether the post type can use block editor.
 * @param string $post_type Current post type.
 *
 * @return bool
 */
function sharetech_enable_block_editor_for_products( $can_edit, $post_type ) {
	if ( 'product' === $post_type ) {
		return true;
	}

	return $can_edit;
}

add_filter( 'use_block_editor_for_post_type', 'sharetech_enable_block_editor_for_products', 10, 2 );

/**
 * Enable required post type supports for product editor UX.
 *
 * @return void
 */
function sharetech_enable_product_editor_supports() {
	add_post_type_support( 'product', 'editor' );
	add_post_type_support( 'product', 'excerpt' );
}

add_action( 'init', 'sharetech_enable_product_editor_supports', 20 );

/**
 * Force block editor for product posts when a plugin toggles per-post checks.
 *
 * @param bool    $use_block_editor Whether block editor should be used.
 * @param WP_Post $post             Current post object.
 *
 * @return bool
 */
function sharetech_force_block_editor_for_product_posts( $use_block_editor, $post ) {
	if ( $post instanceof WP_Post && 'product' === $post->post_type ) {
		return true;
	}

	return $use_block_editor;
}

add_filter( 'use_block_editor_for_post', 'sharetech_force_block_editor_for_product_posts', 10, 2 );

/**
 * Render short description as blocks when block markup is present.
 *
 * @param string $post_excerpt Product short description.
 *
 * @return string
 */
function sharetech_render_product_short_description_blocks( $post_excerpt ) {
	if ( ! is_string( $post_excerpt ) || '' === $post_excerpt ) {
		return $post_excerpt;
	}

	if ( has_blocks( $post_excerpt ) ) {
		$post_excerpt = do_blocks( $post_excerpt );
		$post_excerpt = shortcode_unautop( $post_excerpt );
		$post_excerpt = wptexturize( $post_excerpt );
		$post_excerpt = convert_smilies( $post_excerpt );
		$post_excerpt = wpautop( $post_excerpt );
	}

	return $post_excerpt;
}

add_filter( 'woocommerce_short_description', 'sharetech_render_product_short_description_blocks', 10 );