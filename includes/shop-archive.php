<?php
/**
 * WooCommerce shop archive helpers.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Determine whether current shop view includes URL-based filters.
 *
 * @return bool
 */
function sharetech_shop_has_active_filters() {
	if ( empty( $_GET ) ) {
		return false;
	}

	$ignored_keys = array(
		'paged',
		'page',
		'post_type',
	);

	foreach ( $_GET as $key => $value ) {
		$key = (string) $key;
		if ( in_array( $key, $ignored_keys, true ) ) {
			continue;
		}

		if ( '' !== trim( (string) $value ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Resolve whether we should render custom parent-category shop layout.
 *
 * @return bool
 */
function sharetech_shop_is_main_archive_context() {
	return is_shop() && ! is_search() && ! sharetech_shop_has_active_filters();
}

/**
 * Get top-level product categories for custom shop sections.
 *
 * @return WP_Term[]
 */
function sharetech_shop_get_parent_categories() {
	$terms = get_terms(
		array(
			'taxonomy'   => 'product_cat',
			'hide_empty' => true,
			'parent'     => 0,
			'orderby'    => 'menu_order',
			'order'      => 'ASC',
		)
	);

	if ( is_wp_error( $terms ) || empty( $terms ) ) {
		return array();
	}

	return $terms;
}

/**
 * Get child categories for one parent category.
 *
 * @param int $parent_term_id Parent term ID.
 *
 * @return WP_Term[]
 */
function sharetech_shop_get_subcategories( $parent_term_id ) {
	$terms = get_terms(
		array(
			'taxonomy'   => 'product_cat',
			'hide_empty' => true,
			'parent'     => absint( $parent_term_id ),
			'orderby'    => 'menu_order',
			'order'      => 'ASC',
		)
	);

	if ( is_wp_error( $terms ) || empty( $terms ) ) {
		return array();
	}

	return $terms;
}

/**
 * Build product query for one category section.
 *
 * @param int $category_id Product category term ID.
 * @param int $limit       Products to display.
 *
 * @return WP_Query
 */
function sharetech_shop_get_products_for_category( $category_id, $limit = 8 ) {
	return new WP_Query(
		array(
			'post_type'      => 'product',
			'post_status'    => 'publish',
			'posts_per_page' => max( 1, absint( $limit ) ),
			'tax_query'      => array(
				array(
					'taxonomy' => 'product_cat',
					'field'    => 'term_id',
					'terms'    => absint( $category_id ),
				),
			),
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);
}

/**
 * Resolve product category image URL if available.
 *
 * @param int $category_id Product category term ID.
 *
 * @return string
 */
function sharetech_shop_get_category_image_url( $category_id ) {
	$thumbnail_id = (int) get_term_meta( absint( $category_id ), 'thumbnail_id', true );
	if ( $thumbnail_id <= 0 ) {
		return '';
	}

	$image_url = wp_get_attachment_url( $thumbnail_id );
	return is_string( $image_url ) ? $image_url : '';
}
