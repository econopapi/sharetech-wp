<?php
/**
 * ShareTech Featured Products block render logic.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Normalize block attributes.
 *
 * @param array $attributes Raw block attributes.
 *
 * @return array<string,mixed>
 */
function sharetech_featured_products_get_attributes( $attributes ) {
	$defaults = array(
		'title'            => 'Productos destacados',
		'productsToShow'   => 4,
		'filterType'       => 'manual',
		'selectedProducts' => array(),
		'selectedTags'     => array(),
		'randomizeProducts'=> false,
	);

	$attrs = wp_parse_args( is_array( $attributes ) ? $attributes : array(), $defaults );

	$attrs['title'] = sanitize_text_field( $attrs['title'] );
	$attrs['productsToShow'] = max( 1, min( 12, absint( $attrs['productsToShow'] ) ) );
	$attrs['filterType'] = in_array( $attrs['filterType'], array( 'manual', 'tags', 'sale', 'featured' ), true )
		? $attrs['filterType']
		: 'manual';
	$attrs['selectedProducts'] = array_values( array_filter( array_map( 'absint', (array) $attrs['selectedProducts'] ) ) );
	$attrs['selectedTags'] = array_values( array_filter( array_map( 'absint', (array) $attrs['selectedTags'] ) ) );
	$attrs['randomizeProducts'] = ! empty( $attrs['randomizeProducts'] );

	return $attrs;
}

/**
 * Build query args for featured products block.
 *
 * @param array<string,mixed> $attrs Normalized attributes.
 *
 * @return array<string,mixed>|WP_Error
 */
function sharetech_featured_products_build_query_args( $attrs ) {
	$args = array(
		'post_type'      => 'product',
		'post_status'    => 'publish',
		'posts_per_page' => (int) $attrs['productsToShow'],
		'meta_query'     => array(
			array(
				'key'     => '_stock_status',
				'value'   => 'instock',
				'compare' => '=',
			),
		),
		'tax_query'      => array(),
	);

	switch ( $attrs['filterType'] ) {
		case 'manual':
			if ( empty( $attrs['selectedProducts'] ) ) {
				return new WP_Error( 'sharetech_empty_selection', __( 'No hay productos seleccionados.', 'sharetech' ) );
			}

			$args['post__in'] = $attrs['selectedProducts'];
			$args['posts_per_page'] = count( $attrs['selectedProducts'] ) * 2;
			$args['orderby'] = ! empty( $attrs['randomizeProducts'] ) ? 'rand' : 'post__in';
			break;

		case 'sale':
			$sale_product_ids = wc_get_product_ids_on_sale();

			if ( empty( $sale_product_ids ) ) {
				return new WP_Error( 'sharetech_empty_sale', __( 'No hay productos en oferta disponibles.', 'sharetech' ) );
			}

			$args['post__in'] = $sale_product_ids;

			if ( ! empty( $attrs['randomizeProducts'] ) ) {
				$args['orderby'] = 'rand';
			}
			break;

		case 'featured':
			$args['tax_query'][] = array(
				'taxonomy' => 'product_visibility',
				'field'    => 'name',
				'terms'    => array( 'featured' ),
			);

			if ( ! empty( $attrs['randomizeProducts'] ) ) {
				$args['orderby'] = 'rand';
			}
			break;

		case 'tags':
			if ( empty( $attrs['selectedTags'] ) ) {
				return new WP_Error( 'sharetech_empty_tags', __( 'No hay etiquetas seleccionadas.', 'sharetech' ) );
			}

			$args['tax_query'][] = array(
				'taxonomy' => 'product_tag',
				'field'    => 'term_id',
				'terms'    => $attrs['selectedTags'],
			);

			if ( ! empty( $attrs['randomizeProducts'] ) ) {
				$args['orderby'] = 'rand';
			}
			break;
	}

	return $args;
}

/**
 * Render stars for visual rating helper.
 *
 * @param float $rating Product rating average.
 *
 * @return string
 */
function sharetech_featured_products_render_stars( $rating ) {
	$rating = max( 0, min( 5, (float) $rating ) );
	$full_stars = (int) floor( $rating );

	$output = '<div class="sharetech-featured-products__stars" aria-hidden="true">';
	for ( $i = 1; $i <= 5; $i++ ) {
		$output .= $i <= $full_stars
			? '<span class="sharetech-featured-products__star sharetech-featured-products__star--filled">*</span>'
			: '<span class="sharetech-featured-products__star">*</span>';
	}
	$output .= '</div>';

	return $output;
}

/**
 * Render one product card.
 *
 * @param WC_Product $wc_product Product object.
 *
 * @return string
 */
function sharetech_featured_products_render_card( $wc_product ) {
	$product_id = $wc_product->get_id();
	$title = $wc_product->get_name();
	$permalink = get_permalink( $product_id );
	$is_on_sale = $wc_product->is_on_sale();
	$is_featured = $wc_product->is_featured();
	$rating = (float) $wc_product->get_average_rating();
	$brands = get_the_terms( $product_id, 'pa_brand' );
	$brand_name = ( $brands && ! is_wp_error( $brands ) ) ? (string) $brands[0]->name : '';

	$discount_percentage = 0;
	if ( $is_on_sale ) {
		$regular_price = (float) $wc_product->get_regular_price();
		$sale_price = (float) $wc_product->get_sale_price();

		if ( $regular_price > 0 && $sale_price > 0 && $regular_price > $sale_price ) {
			$discount_percentage = (int) round( ( ( $regular_price - $sale_price ) / $regular_price ) * 100 );
		}
	}

	$card_classes = array( 'sharetech-featured-products__item' );
	if ( $is_on_sale ) {
		$card_classes[] = 'is-on-sale';
	}
	if ( $is_featured ) {
		$card_classes[] = 'is-featured';
	}

	ob_start();
	$previous_global_product = isset( $GLOBALS['product'] ) ? $GLOBALS['product'] : null;
	$GLOBALS['product'] = $wc_product;
	?>
	<article class="<?php echo esc_attr( implode( ' ', $card_classes ) ); ?>">
		<div class="sharetech-featured-products__badges">
			<?php if ( $is_on_sale && $discount_percentage > 0 ) : ?>
				<span class="sharetech-featured-products__badge sharetech-featured-products__badge--sale">
					<?php echo esc_html( '-' . $discount_percentage . '%' ); ?>
				</span>
			<?php else : ?>
				<span class="sharetech-featured-products__badge sharetech-featured-products__badge--recommended">
					<?php esc_html_e( 'Recomendado', 'sharetech' ); ?>
				</span>
			<?php endif; ?>
			<?php if ( $is_featured ) : ?>
				<span class="sharetech-featured-products__badge sharetech-featured-products__badge--featured">
					<?php esc_html_e( 'Top', 'sharetech' ); ?>
				</span>
			<?php endif; ?>
		</div>

		<div class="sharetech-featured-products__image-wrap">
			<a href="<?php echo esc_url( $permalink ); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Ver producto: %s', 'sharetech' ), $title ) ); ?>">
				<?php echo $wc_product->get_image( 'woocommerce_thumbnail', array( 'loading' => 'lazy', 'decoding' => 'async' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</a>
		</div>

		<div class="sharetech-featured-products__content">
			<?php if ( $rating > 0 ) : ?>
				<div class="sharetech-featured-products__rating" aria-label="<?php echo esc_attr( sprintf( __( 'Calificación: %s de 5', 'sharetech' ), $rating ) ); ?>">
					<?php echo sharetech_featured_products_render_stars( $rating ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
			<?php endif; ?>

			<?php if ( '' !== $brand_name ) : ?>
				<p class="sharetech-featured-products__brand"><?php echo esc_html( $brand_name ); ?></p>
			<?php endif; ?>

			<h3 class="sharetech-featured-products__title">
				<a href="<?php echo esc_url( $permalink ); ?>"><?php echo esc_html( $title ); ?></a>
			</h3>

			<div class="sharetech-featured-products__price">
				<?php echo wp_kses_post( $wc_product->get_price_html() ); ?>
			</div>

			<div class="sharetech-featured-products__cart">
				<?php
				woocommerce_template_loop_add_to_cart();
				?>
			</div>
		</div>
	</article>
	<?php
	$GLOBALS['product'] = $previous_global_product;

	return (string) ob_get_clean();
}

/**
 * Render callback for sharetech/featured-products block.
 *
 * @param array<string,mixed> $attributes Block attributes.
 *
 * @return string
 */
function sharetech_render_featured_products_block( $attributes ) {
	if ( ! class_exists( 'WooCommerce' ) ) {
		return '<div class="sharetech-featured-products"><p>' . esc_html__( 'Este bloque requiere WooCommerce activo.', 'sharetech' ) . '</p></div>';
	}

	$attrs = sharetech_featured_products_get_attributes( $attributes );
	$query_args = sharetech_featured_products_build_query_args( $attrs );

	if ( is_wp_error( $query_args ) ) {
		return '<div class="sharetech-featured-products"><p>' . esc_html( $query_args->get_error_message() ) . '</p></div>';
	}

	$products_query = new WP_Query( $query_args );

	if ( ! $products_query->have_posts() ) {
		return '<div class="sharetech-featured-products"><p>' . esc_html__( 'No se encontraron productos.', 'sharetech' ) . '</p></div>';
	}

	$requested_max = (int) $attrs['productsToShow'];
	$manual_max = count( $attrs['selectedProducts'] );
	$max_products = 'manual' === $attrs['filterType'] ? min( $requested_max, $manual_max ) : $requested_max;

	$cards = array();
	$shown = 0;

	while ( $products_query->have_posts() && $shown < $max_products ) {
		$products_query->the_post();
		$product = wc_get_product( get_the_ID() );

		if ( ! $product || ! $product->is_visible() || ! $product->is_in_stock() ) {
			continue;
		}

		$cards[] = sharetech_featured_products_render_card( $product );
		$shown++;
	}

	wp_reset_postdata();

	if ( empty( $cards ) ) {
		return '<div class="sharetech-featured-products"><p>' . esc_html__( 'No se encontraron productos disponibles para mostrar.', 'sharetech' ) . '</p></div>';
	}

	$grid_class = 'products-count-' . min( 4, max( 1, count( $cards ) ) );

	ob_start();
	?>
	<section class="sharetech-featured-products" aria-label="<?php echo esc_attr( $attrs['title'] ); ?>">
		<?php if ( '' !== $attrs['title'] ) : ?>
			<h2 class="sharetech-featured-products__title-main"><?php echo esc_html( $attrs['title'] ); ?></h2>
		<?php endif; ?>
		<div class="sharetech-featured-products__grid <?php echo esc_attr( $grid_class ); ?>">
			<?php echo implode( '', $cards ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	</section>
	<?php

	return (string) ob_get_clean();
}
