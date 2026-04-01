<?php
/**
 * Render file for sharetech/featured-products block.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

echo sharetech_render_featured_products_block( $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
