<?php
/**
 * Page hero helpers.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get available page hero fallback images.
 *
 * @return array<string, string>
 */
function sharetech_get_page_hero_fallback_images() {
	return array(
		'hero1' => 'assets/img/hero1.jpg',
		'hero2' => 'assets/img/hero2.jpg',
		'hero3' => 'assets/img/hero3.jpg',
	);
}

/**
 * Get a deterministic fallback hero image URL for a page.
 *
 * @param int $post_id Page ID.
 *
 * @return string
 */
function sharetech_get_page_default_hero_url( $post_id ) {
	$hero_images = sharetech_get_page_hero_fallback_images();
	$hero_keys   = array_keys( $hero_images );
	$variant     = get_theme_mod( 'sharetech_page_hero_default_variant', 'auto' );

	if ( isset( $hero_images[ $variant ] ) ) {
		return get_stylesheet_directory_uri() . '/' . $hero_images[ $variant ];
	}

	if ( 'random' === $variant ) {
		$random_key = $hero_keys[ wp_rand( 0, count( $hero_keys ) - 1 ) ];

		return get_stylesheet_directory_uri() . '/' . $hero_images[ $random_key ];
	}

	$index = absint( $post_id ) % count( $hero_keys );

	return get_stylesheet_directory_uri() . '/' . $hero_images[ $hero_keys[ $index ] ];
}

/**
 * Resolve hero image URL for a page.
 *
 * @param int $post_id Page ID.
 *
 * @return string
 */
function sharetech_get_page_hero_url( $post_id ) {
	if ( has_post_thumbnail( $post_id ) ) {
		$featured_url = get_the_post_thumbnail_url( $post_id, 'full' );

		if ( ! empty( $featured_url ) ) {
			return $featured_url;
		}
	}

	return sharetech_get_page_default_hero_url( $post_id );
}

/**
 * Register hero fallback controls in Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Customizer manager.
 *
 * @return void
 */
function sharetech_page_hero_customizer_settings( $wp_customize ) {
	$wp_customize->add_section(
		'sharetech_page_hero_settings',
		array(
			'title'       => __( 'ShareTech Hero de Páginas', 'sharetech' ),
			'description' => __( 'Controla qué imagen usar cuando una página no tiene imagen destacada.', 'sharetech' ),
			'priority'    => 166,
		)
	);

	$wp_customize->add_setting(
		'sharetech_page_hero_default_variant',
		array(
			'default'           => 'auto',
			'sanitize_callback' => 'sanitize_text_field',
		)
	);

	$wp_customize->add_control(
		'sharetech_page_hero_default_variant',
		array(
			'label'   => __( 'Hero fallback por defecto', 'sharetech' ),
			'section' => 'sharetech_page_hero_settings',
			'type'    => 'select',
			'choices' => array(
				'auto'   => __( 'Auto por ID de página', 'sharetech' ),
				'hero1'  => __( 'Hero 1', 'sharetech' ),
				'hero2'  => __( 'Hero 2', 'sharetech' ),
				'hero3'  => __( 'Hero 3', 'sharetech' ),
				'random' => __( 'Aleatorio en cada carga', 'sharetech' ),
			),
		)
	);
}

add_action( 'customize_register', 'sharetech_page_hero_customizer_settings' );
