<?php
/**
 * The template for displaying all pages.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Keep Astra native homepage rendering untouched to avoid layout regressions.
if ( is_front_page() ) {
	require get_template_directory() . '/page.php';
	return;
}

get_header();
?>

<main id="primary" class="site-main sharetech-page-template">
	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ) : the_post(); ?>
			<?php get_template_part( 'template-parts/page/hero' ); ?>

			<section class="sharetech-page-content" aria-label="<?php esc_attr_e( 'Contenido de la página', 'sharetech' ); ?>">
				<div class="sharetech-page-content__inner">
					<?php the_content(); ?>

					<?php
					wp_link_pages(
						array(
							'before' => '<div class="page-links">' . esc_html__( 'Páginas:', 'sharetech' ),
							'after'  => '</div>',
						)
					);
					?>
				</div>
			</section>
		<?php endwhile; ?>
	<?php endif; ?>
</main>

<?php
get_footer();
