<?php
/**
 * Page hero template part.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$post_id       = get_the_ID();
$hero_url      = sharetech_get_page_hero_url( $post_id );
$hero_title    = get_the_title( $post_id );
$hero_subtitle = get_post_meta( $post_id, '_sharetech_page_hero_subtitle', true );
$hero_id       = 'sharetech-page-hero-title-' . absint( $post_id );

?>
<section class="sharetech-page-hero" aria-labelledby="<?php echo esc_attr( $hero_id ); ?>">
	<div class="sharetech-page-hero__media" style="background-image: url('<?php echo esc_url( $hero_url ); ?>');"></div>
	<div class="sharetech-page-hero__overlay">
		<div class="sharetech-page-hero__inner">
			<div class="sharetech-page-hero__content">
				<p class="sharetech-page-hero__eyebrow"><?php esc_html_e( 'ShareTech', 'sharetech' ); ?></p>
				<h1 id="<?php echo esc_attr( $hero_id ); ?>" class="sharetech-page-hero__title"><?php echo esc_html( $hero_title ); ?></h1>
				<?php if ( ! empty( $hero_subtitle ) ) : ?>
					<p class="sharetech-page-hero__subtitle"><?php echo esc_html( $hero_subtitle ); ?></p>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>
