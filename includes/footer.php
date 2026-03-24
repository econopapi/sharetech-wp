<?php
/**
 * Custom footer setup and rendering.
 *
 * @package ShareTech
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register footer menu locations.
 *
 * @return void
 */
function sharetech_register_footer_menus() {
	register_nav_menus(
		array(
			'sharetech-footer-navigation' => __( 'ShareTech Footer - Navegación', 'sharetech' ),
			'sharetech-footer-support'    => __( 'ShareTech Footer - Soporte', 'sharetech' ),
			'sharetech-footer-company'    => __( 'ShareTech Footer - Empresa', 'sharetech' ),
			'sharetech-footer-legal'      => __( 'ShareTech Footer - Legal (fila inferior)', 'sharetech' ),
		)
	);
}

add_action( 'after_setup_theme', 'sharetech_register_footer_menus' );

/**
 * Register footer customizer settings.
 *
 * @param WP_Customize_Manager $wp_customize Customizer manager.
 *
 * @return void
 */
function sharetech_footer_customizer_settings( $wp_customize ) {
	$wp_customize->add_section(
		'sharetech_footer_settings',
		array(
			'title'       => __( 'ShareTech Footer', 'sharetech' ),
			'description' => __( 'Configuración del footer personalizado.', 'sharetech' ),
			'priority'    => 165,
		)
	);

	$settings = array(
		'brand_title'         => array(
			'label'   => __( 'Título de marca', 'sharetech' ),
			'default' => 'SHAREVDI',
		),
		'brand_description'   => array(
			'label'   => __( 'Descripción de marca', 'sharetech' ),
			'default' => 'Especialistas en soluciones informáticas compactas para empresas. Productos certificados con soporte en México.',
		),
		'navigation_title'    => array(
			'label'   => __( 'Título columna Navegación', 'sharetech' ),
			'default' => 'Navegación',
		),
		'support_title'       => array(
			'label'   => __( 'Título columna Soporte', 'sharetech' ),
			'default' => 'Soporte',
		),
		'company_title'       => array(
			'label'   => __( 'Título columna Empresa', 'sharetech' ),
			'default' => 'Empresa',
		),
		'contact_title'       => array(
			'label'   => __( 'Título columna Contacto', 'sharetech' ),
			'default' => 'Contacto',
		),
		'contact_phone'       => array(
			'label'   => __( 'Teléfono', 'sharetech' ),
			'default' => '01 (55) 6385-6097',
		),
		'contact_email'       => array(
			'label'   => __( 'Correo', 'sharetech' ),
			'default' => 'ventas@sharetech.com.mx',
		),
		'contact_schedule'    => array(
			'label'   => __( 'Horario', 'sharetech' ),
			'default' => 'Lun–Vie, 9:00-18:00 hrs',
		),
		'copyright_text'      => array(
			'label'   => __( 'Texto de copyright', 'sharetech' ),
			'default' => '© {year} ShareTech. Todos los derechos reservados.',
		),
		'social_facebook'     => array(
			'label'   => __( 'URL Facebook', 'sharetech' ),
			'default' => '',
		),
		'social_twitter'      => array(
			'label'   => __( 'URL X/Twitter', 'sharetech' ),
			'default' => '',
		),
		'social_linkedin'     => array(
			'label'   => __( 'URL LinkedIn', 'sharetech' ),
			'default' => '',
		),
		'social_instagram'    => array(
			'label'   => __( 'URL Instagram', 'sharetech' ),
			'default' => '',
		),
	);

	foreach ( $settings as $key => $config ) {
		$is_url = false !== strpos( $key, 'social_' );

		$wp_customize->add_setting(
			'sharetech_footer_' . $key,
			array(
				'default'           => $config['default'],
				'sanitize_callback' => $is_url ? 'esc_url_raw' : 'sanitize_text_field',
			)
		);

		$wp_customize->add_control(
			'sharetech_footer_' . $key,
			array(
				'label'   => $config['label'],
				'section' => 'sharetech_footer_settings',
				'type'    => 'text',
			)
		);
	}
}

add_action( 'customize_register', 'sharetech_footer_customizer_settings' );

/**
 * Override Astra footer output.
 *
 * @return void
 */
function sharetech_override_astra_footer() {
	if ( 'astra' !== get_template() ) {
		return;
	}

	remove_all_actions( 'astra_footer' );
	remove_all_actions( 'astra_footer_content' );
	remove_all_actions( 'astra_footer_content_top' );
	remove_all_actions( 'astra_footer_content_bottom' );

	add_action( 'astra_footer', 'sharetech_render_custom_footer', 5 );
}

add_action( 'wp', 'sharetech_override_astra_footer', 20 );

/**
 * Render one footer menu column.
 *
 * @param string $location      Menu location slug.
 * @param string $section_title Section title.
 *
 * @return void
 */
function sharetech_render_footer_menu_column( $location, $section_title ) {
	?>
	<div class="sharetech-footer__column">
		<h3 class="sharetech-footer__title"><?php echo esc_html( $section_title ); ?></h3>
		<?php
		if ( has_nav_menu( $location ) ) {
			wp_nav_menu(
				array(
					'theme_location' => $location,
					'container'      => false,
					'menu_class'     => 'sharetech-footer__menu',
					'fallback_cb'    => false,
				)
			);
		}
		?>
	</div>
	<?php
}

/**
 * Render social links.
 *
 * @return void
 */
function sharetech_render_footer_social_links() {
	$social_links = array(
		'f'  => get_theme_mod( 'sharetech_footer_social_facebook', '' ),
		'x'  => get_theme_mod( 'sharetech_footer_social_twitter', '' ),
		'in' => get_theme_mod( 'sharetech_footer_social_linkedin', '' ),
		'ig' => get_theme_mod( 'sharetech_footer_social_instagram', '' ),
	);

	$has_social_links = array_filter( $social_links );

	if ( empty( $has_social_links ) ) {
		return;
	}
	?>
	<ul class="sharetech-footer__social" aria-label="<?php esc_attr_e( 'Redes sociales', 'sharetech' ); ?>">
		<?php foreach ( $social_links as $label => $url ) : ?>
			<?php if ( empty( $url ) ) : ?>
				<?php continue; ?>
			<?php endif; ?>
			<li>
				<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( strtoupper( $label ) ); ?>">
					<?php echo esc_html( $label ); ?>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
	<?php
}

/**
 * Render custom footer.
 *
 * @return void
 */
function sharetech_render_custom_footer() {
	$brand_title       = get_theme_mod( 'sharetech_footer_brand_title', 'SHAREVDI' );
	$brand_description = get_theme_mod( 'sharetech_footer_brand_description', 'Especialistas en soluciones informáticas compactas para empresas. Productos certificados con soporte en México.' );
	$navigation_title  = get_theme_mod( 'sharetech_footer_navigation_title', 'Navegación' );
	$support_title     = get_theme_mod( 'sharetech_footer_support_title', 'Soporte' );
	$company_title     = get_theme_mod( 'sharetech_footer_company_title', 'Empresa' );
	$contact_title     = get_theme_mod( 'sharetech_footer_contact_title', 'Contacto' );
	$contact_phone     = get_theme_mod( 'sharetech_footer_contact_phone', '01 (55) 6385-6097' );
	$contact_email     = get_theme_mod( 'sharetech_footer_contact_email', 'ventas@sharetech.com.mx' );
	$contact_schedule  = get_theme_mod( 'sharetech_footer_contact_schedule', 'Lun–Vie, 9:00-18:00 hrs' );
	$copyright_text    = get_theme_mod( 'sharetech_footer_copyright_text', '© {year} ShareVDI. Todos los derechos reservados.' );
	$copyright_text    = str_replace( '{year}', gmdate( 'Y' ), $copyright_text );
	?>
	<div class="sharetech-footer" aria-label="<?php esc_attr_e( 'Pie de página', 'sharetech' ); ?>">
		<div class="sharetech-footer__inner">
			<div class="sharetech-footer__grid">
				<div class="sharetech-footer__column sharetech-footer__brand">
					<h3 class="sharetech-footer__brand-title"><?php echo esc_html( $brand_title ); ?></h3>
					<p class="sharetech-footer__brand-text"><?php echo esc_html( $brand_description ); ?></p>
					<?php sharetech_render_footer_social_links(); ?>
				</div>

				<?php sharetech_render_footer_menu_column( 'sharetech-footer-navigation', $navigation_title ); ?>
				<?php sharetech_render_footer_menu_column( 'sharetech-footer-support', $support_title ); ?>
				<?php sharetech_render_footer_menu_column( 'sharetech-footer-company', $company_title ); ?>

				<div class="sharetech-footer__column">
					<h3 class="sharetech-footer__title"><?php echo esc_html( $contact_title ); ?></h3>
					<ul class="sharetech-footer__contact-list">
						<?php if ( ! empty( $contact_phone ) ) : ?>
							<li><?php echo esc_html( $contact_phone ); ?></li>
						<?php endif; ?>
						<?php if ( ! empty( $contact_email ) ) : ?>
							<li><a href="mailto:<?php echo antispambot( esc_attr( $contact_email ) ); ?>"><?php echo esc_html( antispambot( $contact_email ) ); ?></a></li>
						<?php endif; ?>
						<?php if ( ! empty( $contact_schedule ) ) : ?>
							<li><?php echo esc_html( $contact_schedule ); ?></li>
						<?php endif; ?>
					</ul>
				</div>
			</div>

			<div class="sharetech-footer__bottom">
				<p class="sharetech-footer__copyright"><?php echo esc_html( $copyright_text ); ?></p>
				<?php
				if ( has_nav_menu( 'sharetech-footer-legal' ) ) {
					wp_nav_menu(
						array(
							'theme_location' => 'sharetech-footer-legal',
							'container'      => false,
							'menu_class'     => 'sharetech-footer__legal-menu',
							'fallback_cb'    => false,
						)
					);
				}
				?>
			</div>
		</div>
	</div>
	<?php
}