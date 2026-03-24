( function ( blocks, blockEditor, components, i18n ) {
	const { registerBlockType } = blocks;
	const { useBlockProps, RichText, InspectorControls, MediaUpload, MediaUploadCheck } = blockEditor;
	const { PanelBody, ToggleControl, TextControl, Button } = components;
	const { __ } = i18n;

	registerBlockType( 'sharetech/benefit-card', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const blockProps = useBlockProps( {
				className: attributes.enableHover ? 'sharetech-benefit-card is-hover-enabled' : 'sharetech-benefit-card'
			} );

			return [
				wp.element.createElement(
					InspectorControls,
					{},
					wp.element.createElement(
						PanelBody,
						{ title: __( 'Opciones de tarjeta', 'sharetech' ), initialOpen: true },
						wp.element.createElement( ToggleControl, {
							label: __( 'Activar hover en esta tarjeta', 'sharetech' ),
							checked: attributes.enableHover,
							onChange: function ( value ) {
								setAttributes( { enableHover: value } );
							}
						} )
					),
					wp.element.createElement(
						PanelBody,
						{ title: __( 'Ícono', 'sharetech' ), initialOpen: false },
						wp.element.createElement(
							MediaUploadCheck,
							{},
							wp.element.createElement( MediaUpload, {
								onSelect: function ( media ) {
									setAttributes( {
										iconId: media.id,
										iconUrl: media.url,
										iconAlt: media.alt || ''
									} );
								},
								allowedTypes: [ 'image' ],
								value: attributes.iconId,
								render: function ( mediaUploadProps ) {
									return wp.element.createElement(
										Button,
										{ variant: 'secondary', onClick: mediaUploadProps.open },
										attributes.iconUrl ? __( 'Cambiar ícono', 'sharetech' ) : __( 'Seleccionar ícono', 'sharetech' )
									);
								}
							} )
						),
						attributes.iconUrl && wp.element.createElement( 'img', {
							src: attributes.iconUrl,
							alt: attributes.iconAlt || '',
							style: { width: '52px', height: '52px', marginTop: '12px', borderRadius: '8px', objectFit: 'cover' }
						} ),
						wp.element.createElement( TextControl, {
							label: __( 'Texto alternativo del ícono', 'sharetech' ),
							value: attributes.iconAlt,
							onChange: function ( value ) {
								setAttributes( { iconAlt: value } );
							}
						} ),
						attributes.iconUrl && wp.element.createElement(
							Button,
							{
								variant: 'link',
								isDestructive: true,
								onClick: function () {
									setAttributes( {
										iconId: 0,
										iconUrl: '',
										iconAlt: ''
									} );
								}
							},
							__( 'Quitar ícono', 'sharetech' )
						)
					)
				),
				wp.element.createElement(
					'article',
					blockProps,
					wp.element.createElement(
						'div',
						{ className: 'sharetech-benefit-card__icon-wrap', 'aria-hidden': true },
						attributes.iconUrl ? wp.element.createElement( 'img', {
							className: 'sharetech-benefit-card__icon',
							src: attributes.iconUrl,
							alt: attributes.iconAlt || ''
						} ) : wp.element.createElement( 'span', { className: 'sharetech-benefit-card__icon-placeholder' } )
					),
					wp.element.createElement( RichText, {
						tagName: 'h3',
						className: 'sharetech-benefit-card__title',
						value: attributes.title,
						onChange: function ( value ) {
							setAttributes( { title: value } );
						},
						placeholder: __( 'Título de beneficio', 'sharetech' )
					} ),
					wp.element.createElement( RichText, {
						tagName: 'p',
						className: 'sharetech-benefit-card__description',
						value: attributes.description,
						onChange: function ( value ) {
							setAttributes( { description: value } );
						},
						placeholder: __( 'Descripción de beneficio', 'sharetech' )
					} )
				)
			];
		},

		save: function ( props ) {
			const { attributes } = props;
			const blockProps = useBlockProps.save( {
				className: attributes.enableHover ? 'sharetech-benefit-card is-hover-enabled' : 'sharetech-benefit-card'
			} );

			return wp.element.createElement(
				'article',
				blockProps,
				wp.element.createElement(
					'div',
					{ className: 'sharetech-benefit-card__icon-wrap', 'aria-hidden': true },
					attributes.iconUrl ? wp.element.createElement( 'img', {
						className: 'sharetech-benefit-card__icon',
						src: attributes.iconUrl,
						alt: attributes.iconAlt || ''
					} ) : wp.element.createElement( 'span', { className: 'sharetech-benefit-card__icon-placeholder' } )
				),
				wp.element.createElement( RichText.Content, {
					tagName: 'h3',
					className: 'sharetech-benefit-card__title',
					value: attributes.title
				} ),
				wp.element.createElement( RichText.Content, {
					tagName: 'p',
					className: 'sharetech-benefit-card__description',
					value: attributes.description
				} )
			);
		}
	} );
} )( window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.i18n );