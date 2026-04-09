<?php
/**
 * Custom product archive template.
 *
 * @package ShareTech
 */

defined( 'ABSPATH' ) || exit;

get_header( 'shop' );

do_action( 'woocommerce_before_main_content' );

$is_main_shop_context = sharetech_shop_is_main_archive_context();

if ( $is_main_shop_context ) {
	wp_enqueue_script(
		'sharetech-shop-archive-filters',
		get_stylesheet_directory_uri() . '/assets/js/shop-archive-filters.js',
		array(),
		CHILD_THEME_SHARETECH_VERSION,
		true
	);

	echo '<style>.woocommerce-breadcrumb{display:none;}</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
?>

<div class="sharetech-shop-wrapper <?php echo $is_main_shop_context ? 'sharetech-shop-wrapper--main' : 'sharetech-shop-wrapper--default'; ?>">
	<?php if ( $is_main_shop_context ) : ?>
		<header class="sharetech-shop-hero">
			<div class="sharetech-shop-hero__inner">
				<h1 class="sharetech-shop-hero__title"><?php woocommerce_page_title(); ?></h1>
			</div>
		</header>

		<?php $parent_categories = sharetech_shop_get_parent_categories(); ?>

		<?php if ( ! empty( $parent_categories ) ) : ?>
			<?php foreach ( $parent_categories as $category ) : ?>
				<?php
				$category_link  = get_term_link( $category );
				$category_link  = is_wp_error( $category_link ) ? '#' : $category_link;
				$subcategories  = sharetech_shop_get_subcategories( $category->term_id );
				$products_query = sharetech_shop_get_products_for_category( $category->term_id, 8 );
				$default_filter = ( ! empty( $subcategories ) && 1 === count( $subcategories ) ) ? (string) $subcategories[0]->slug : 'all';
				?>

				<section class="sharetech-shop-category" data-default-filter="<?php echo esc_attr( $default_filter ); ?>" aria-labelledby="sharetech-category-title-<?php echo esc_attr( (string) $category->term_id ); ?>">
					<div class="sharetech-shop-category__header">
						<h2 id="sharetech-category-title-<?php echo esc_attr( (string) $category->term_id ); ?>" class="sharetech-shop-category__title">
							<?php echo esc_html( $category->name ); ?>
						</h2>
						<?php if ( ! empty( $category->description ) ) : ?>
							<p class="sharetech-shop-category__description"><?php echo esc_html( $category->description ); ?></p>
						<?php endif; ?>

						<?php if ( ! empty( $subcategories ) ) : ?>
							<ul class="sharetech-shop-subcategories" aria-label="<?php echo esc_attr( sprintf( __( 'Subcategorias de %s', 'sharetech' ), $category->name ) ); ?>">
								<?php if ( count( $subcategories ) > 1 ) : ?>
									<li>
										<button type="button" class="sharetech-shop-subcategory-card is-active" data-filter="all" aria-pressed="true">
											<span class="sharetech-shop-subcategory-card__name"><?php esc_html_e( 'Todos', 'sharetech' ); ?></span>
										</button>
									</li>
								<?php endif; ?>

								<?php foreach ( $subcategories as $subcategory ) : ?>
									<?php
									$subcategory_image = sharetech_shop_get_category_image_url( $subcategory->term_id );
									$is_default_subcat = $default_filter === (string) $subcategory->slug;
									?>
									<li>
										<button type="button" class="sharetech-shop-subcategory-card<?php echo $is_default_subcat ? ' is-active' : ''; ?>" data-filter="<?php echo esc_attr( (string) $subcategory->slug ); ?>" aria-pressed="<?php echo $is_default_subcat ? 'true' : 'false'; ?>">
											<?php if ( '' !== $subcategory_image ) : ?>
												<span class="sharetech-shop-subcategory-card__image">
													<img src="<?php echo esc_url( $subcategory_image ); ?>" alt="<?php echo esc_attr( $subcategory->name ); ?>" loading="lazy" decoding="async" />
												</span>
											<?php endif; ?>
											<span class="sharetech-shop-subcategory-card__name"><?php echo esc_html( $subcategory->name ); ?></span>
										</button>
									</li>
								<?php endforeach; ?>
							</ul>
						<?php endif; ?>
					</div>

					<?php if ( $products_query->have_posts() ) : ?>
						<ul class="products columns-4 sharetech-shop-products-grid">
							<?php while ( $products_query->have_posts() ) : ?>
								<?php
								$products_query->the_post();
								do_action( 'woocommerce_shop_loop' );
								wc_get_template_part( 'content', 'product' );
								?>
							<?php endwhile; ?>
						</ul>

						<p class="sharetech-shop-products-grid__empty" hidden>
							<?php esc_html_e( 'No hay productos para esta subcategoria.', 'sharetech' ); ?>
						</p>

						<div class="sharetech-shop-category__footer">
							<a href="<?php echo esc_url( $category_link ); ?>" class="sharetech-shop-category__cta">
								<?php echo esc_html( sprintf( __( 'Ver todos los productos de %s', 'sharetech' ), $category->name ) ); ?>
							</a>
						</div>
					<?php else : ?>
						<p class="sharetech-shop-category__empty"><?php esc_html_e( 'No hay productos en esta categoria.', 'sharetech' ); ?></p>
					<?php endif; ?>

					<?php wp_reset_postdata(); ?>
				</section>
			<?php endforeach; ?>
		<?php else : ?>
			<p class="sharetech-shop-empty"><?php esc_html_e( 'No hay categorias de producto configuradas.', 'sharetech' ); ?></p>
		<?php endif; ?>
	<?php else : ?>
		<?php do_action( 'woocommerce_shop_loop_header' ); ?>

		<?php if ( woocommerce_product_loop() ) : ?>
			<div class="sharetech-shop-controls">
				<?php do_action( 'woocommerce_before_shop_loop' ); ?>
			</div>

			<?php woocommerce_product_loop_start(); ?>
				<?php if ( wc_get_loop_prop( 'total' ) ) : ?>
					<?php while ( have_posts() ) : ?>
						<?php
						the_post();
						do_action( 'woocommerce_shop_loop' );
						wc_get_template_part( 'content', 'product' );
						?>
					<?php endwhile; ?>
				<?php endif; ?>
			<?php woocommerce_product_loop_end(); ?>

			<div class="sharetech-shop-footer">
				<?php do_action( 'woocommerce_after_shop_loop' ); ?>
			</div>
		<?php else : ?>
			<?php do_action( 'woocommerce_no_products_found' ); ?>
		<?php endif; ?>
	<?php endif; ?>
</div>

<?php
do_action( 'woocommerce_after_main_content' );
do_action( 'woocommerce_sidebar' );

get_footer( 'shop' );
