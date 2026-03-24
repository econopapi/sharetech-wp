( function ( blocks, blockEditor, components, i18n ) {
	const { registerBlockType } = blocks;
	const { useBlockProps, RichText, URLInputButton, InspectorControls, MediaUpload, MediaUploadCheck } = blockEditor;
	const { PanelBody, TextControl, Button } = components;
	const { __ } = i18n;

	registerBlockType( 'sharetech/series-card', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const items = Array.isArray( attributes.items ) ? attributes.items : [];

			const blockProps = useBlockProps( {
				className: 'sharetech-series-card'
			} );

			const updateFeatureItem = function ( index, value ) {
				const nextItems = items.map( function ( item, itemIndex ) {
					if ( itemIndex !== index ) {
						return item;
					}

					return value;
				} );

				setAttributes( { items: nextItems } );
			};

			const addFeatureItem = function () {
				setAttributes( {
					items: [ ...items, __( 'Nuevo punto de valor', 'sharetech' ) ]
				} );
			};

			const removeFeatureItem = function ( index ) {
				if ( items.length <= 1 ) {
					return;
				}

				setAttributes( {
					items: items.filter( function ( item, itemIndex ) {
						return itemIndex !== index;
					} )
				} );
			};

			return [
				wp.element.createElement(
					InspectorControls,
					{},
					wp.element.createElement(
						PanelBody,
						{ title: __( 'Botón', 'sharetech' ), initialOpen: true },
						wp.element.createElement( TextControl, {
							label: __( 'URL botón', 'sharetech' ),
							value: attributes.buttonUrl,
							onChange: function ( value ) {
								setAttributes( { buttonUrl: value } );
							}
						} ),
						wp.element.createElement( URLInputButton, {
							url: attributes.buttonUrl,
							onChange: function ( value ) {
								setAttributes( { buttonUrl: value } );
							}
						} )
					),
					wp.element.createElement(
						PanelBody,
						{ title: __( 'Imagen', 'sharetech' ), initialOpen: false },
						wp.element.createElement(
							MediaUploadCheck,
							{},
							wp.element.createElement( MediaUpload, {
								onSelect: function ( media ) {
									setAttributes( {
										imageId: media.id,
										imageUrl: media.url,
										imageAlt: media.alt || ''
									} );
								},
								allowedTypes: [ 'image' ],
								value: attributes.imageId,
								render: function ( mediaUploadProps ) {
									return wp.element.createElement(
										Button,
										{ variant: 'secondary', onClick: mediaUploadProps.open },
										attributes.imageUrl ? __( 'Cambiar imagen', 'sharetech' ) : __( 'Seleccionar imagen', 'sharetech' )
									);
								}
							} )
						),
						attributes.imageUrl && wp.element.createElement( 'img', {
							src: attributes.imageUrl,
							alt: attributes.imageAlt || '',
							style: { width: '100%', height: 'auto', marginTop: '12px', borderRadius: '10px' }
						} ),
						wp.element.createElement( TextControl, {
							label: __( 'Texto alternativo de imagen', 'sharetech' ),
							value: attributes.imageAlt,
							onChange: function ( value ) {
								setAttributes( { imageAlt: value } );
							}
						} ),
						attributes.imageUrl && wp.element.createElement(
							Button,
							{
								variant: 'link',
								isDestructive: true,
								onClick: function () {
									setAttributes( {
										imageId: 0,
										imageUrl: '',
										imageAlt: ''
									} );
								}
							},
							__( 'Quitar imagen', 'sharetech' )
						)
					)
				),
				wp.element.createElement(
					'article',
					blockProps,
					wp.element.createElement(
						'div',
						{ className: 'sharetech-series-card__media' },
						attributes.imageUrl ? wp.element.createElement( 'img', {
							className: 'sharetech-series-card__image',
							src: attributes.imageUrl,
							alt: attributes.imageAlt || ''
						} ) : wp.element.createElement( 'div', { className: 'sharetech-series-card__image-placeholder' } )
					),
					wp.element.createElement(
						'div',
						{ className: 'sharetech-series-card__content' },
						wp.element.createElement( RichText, {
							tagName: 'p',
							className: 'sharetech-series-card__kicker',
							value: attributes.kicker,
							onChange: function ( value ) {
								setAttributes( { kicker: value } );
							},
							placeholder: __( 'Kicker', 'sharetech' )
						} ),
						wp.element.createElement( RichText, {
							tagName: 'h3',
							className: 'sharetech-series-card__title',
							value: attributes.title,
							onChange: function ( value ) {
								setAttributes( { title: value } );
							},
							placeholder: __( 'Título de serie', 'sharetech' )
						} ),
						wp.element.createElement( RichText, {
							tagName: 'p',
							className: 'sharetech-series-card__description',
							value: attributes.description,
							onChange: function ( value ) {
								setAttributes( { description: value } );
							},
							placeholder: __( 'Descripción de serie', 'sharetech' )
						} ),
						wp.element.createElement(
							'ul',
							{ className: 'sharetech-series-card__list' },
							items.map( function ( item, index ) {
								return wp.element.createElement(
									'li',
									{ className: 'sharetech-series-card__list-item', key: 'series-item-' + index },
									wp.element.createElement( RichText, {
										tagName: 'span',
										value: item,
										onChange: function ( value ) {
											updateFeatureItem( index, value );
										},
										placeholder: __( 'Punto de valor', 'sharetech' )
									} ),
									wp.element.createElement(
										Button,
										{
											variant: 'link',
											isDestructive: true,
											onClick: function () {
												removeFeatureItem( index );
											}
										},
										__( 'Quitar', 'sharetech' )
									)
								);
							} )
						),
						wp.element.createElement(
							'div',
							{ className: 'sharetech-series-card__list-controls' },
							wp.element.createElement(
								Button,
								{ variant: 'secondary', onClick: addFeatureItem },
								__( 'Agregar punto', 'sharetech' )
							)
						),
						wp.element.createElement(
							'button',
							{ className: 'sharetech-series-card__button', type: 'button' },
							wp.element.createElement( RichText, {
								tagName: 'span',
								value: attributes.buttonText,
								onChange: function ( value ) {
									setAttributes( { buttonText: value } );
								},
								placeholder: __( 'Texto de botón', 'sharetech' )
							} )
						)
					)
				)
			];
		},

		save: function ( props ) {
			const { attributes } = props;
			const items = Array.isArray( attributes.items ) ? attributes.items : [];
			const blockProps = useBlockProps.save( {
				className: 'sharetech-series-card'
			} );

			return wp.element.createElement(
				'article',
				blockProps,
				wp.element.createElement(
					'div',
					{ className: 'sharetech-series-card__media' },
					attributes.imageUrl ? wp.element.createElement( 'img', {
						className: 'sharetech-series-card__image',
						src: attributes.imageUrl,
						alt: attributes.imageAlt || ''
					} ) : wp.element.createElement( 'div', { className: 'sharetech-series-card__image-placeholder' } )
				),
				wp.element.createElement(
					'div',
					{ className: 'sharetech-series-card__content' },
					wp.element.createElement( RichText.Content, {
						tagName: 'p',
						className: 'sharetech-series-card__kicker',
						value: attributes.kicker
					} ),
					wp.element.createElement( RichText.Content, {
						tagName: 'h3',
						className: 'sharetech-series-card__title',
						value: attributes.title
					} ),
					wp.element.createElement( RichText.Content, {
						tagName: 'p',
						className: 'sharetech-series-card__description',
						value: attributes.description
					} ),
					wp.element.createElement(
						'ul',
						{ className: 'sharetech-series-card__list' },
						items.map( function ( item, index ) {
							return wp.element.createElement(
								'li',
								{ className: 'sharetech-series-card__list-item', key: 'series-item-' + index },
								wp.element.createElement( RichText.Content, {
									tagName: 'span',
									value: item
								} )
							);
						} )
					),
					wp.element.createElement(
						'a',
						{ className: 'sharetech-series-card__button', href: attributes.buttonUrl || '#', rel: 'noopener' },
						wp.element.createElement( RichText.Content, {
							tagName: 'span',
							value: attributes.buttonText
						} )
					)
				)
			);
		}
	} );
} )( window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.i18n );