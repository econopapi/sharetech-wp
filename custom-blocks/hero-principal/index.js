( function ( blocks, blockEditor, components, i18n ) {
	const { registerBlockType } = blocks;
	const { useBlockProps, RichText, URLInputButton, InspectorControls, MediaUpload, MediaUploadCheck } = blockEditor;
	const { PanelBody, TextControl, Button } = components;
	const { __ } = i18n;

	registerBlockType( 'sharetech/hero-principal', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const blockProps = useBlockProps( {
				className: 'sharetech-hero alignfull'
			} );

			return [
				wp.element.createElement(
					InspectorControls,
					{},
					wp.element.createElement(
						PanelBody,
						{ title: __( 'Enlaces y ajustes', 'sharetech' ), initialOpen: true },
						wp.element.createElement( TextControl, {
							label: __( 'URL botón principal', 'sharetech' ),
							value: attributes.primaryButtonUrl,
							onChange: function ( value ) {
								setAttributes( { primaryButtonUrl: value } );
							}
						} ),
						wp.element.createElement( URLInputButton, {
							url: attributes.primaryButtonUrl,
							onChange: function ( value ) {
								setAttributes( { primaryButtonUrl: value } );
							}
						} ),
						wp.element.createElement( TextControl, {
							label: __( 'URL botón secundario', 'sharetech' ),
							value: attributes.secondaryButtonUrl,
							onChange: function ( value ) {
								setAttributes( { secondaryButtonUrl: value } );
							}
						} ),
						wp.element.createElement( URLInputButton, {
							url: attributes.secondaryButtonUrl,
							onChange: function ( value ) {
								setAttributes( { secondaryButtonUrl: value } );
							}
						} )
					),
					wp.element.createElement(
						PanelBody,
						{ title: __( 'Imagen de producto', 'sharetech' ), initialOpen: false },
						wp.element.createElement(
							MediaUploadCheck,
							{},
							wp.element.createElement( MediaUpload, {
								onSelect: function ( media ) {
									setAttributes( {
										productImageId: media.id,
										productImageUrl: media.url,
										productImageAlt: media.alt || ''
									} );
								},
								allowedTypes: [ 'image' ],
								value: attributes.productImageId,
								render: function ( mediaUploadProps ) {
									return wp.element.createElement(
										Button,
										{ variant: 'secondary', onClick: mediaUploadProps.open },
										attributes.productImageUrl ? __( 'Cambiar imagen', 'sharetech' ) : __( 'Seleccionar imagen', 'sharetech' )
									);
								}
							} )
						),
						attributes.productImageUrl && wp.element.createElement(
							'img',
							{
								src: attributes.productImageUrl,
								alt: attributes.productImageAlt || '',
								style: { width: '100%', height: 'auto', marginTop: '12px', borderRadius: '10px' }
							}
						),
						wp.element.createElement( TextControl, {
							label: __( 'Texto alternativo de imagen', 'sharetech' ),
							value: attributes.productImageAlt,
							onChange: function ( value ) {
								setAttributes( { productImageAlt: value } );
							}
						} ),
						attributes.productImageUrl && wp.element.createElement(
							Button,
							{
								variant: 'link',
								isDestructive: true,
								onClick: function () {
									setAttributes( {
										productImageId: 0,
										productImageUrl: '',
										productImageAlt: ''
									} );
								}
							},
							__( 'Quitar imagen', 'sharetech' )
						)
					)
				),
				wp.element.createElement(
					'section',
					blockProps,
					wp.element.createElement(
						'div',
						{ className: 'sharetech-hero__inner' },
						wp.element.createElement(
							'div',
							{ className: 'sharetech-hero__content' },
							wp.element.createElement( RichText, {
								tagName: 'p',
								className: 'sharetech-hero__kicker',
								value: attributes.kicker,
								onChange: function ( value ) {
									setAttributes( { kicker: value } );
								},
								placeholder: __( 'Texto superior', 'sharetech' )
							} ),
							wp.element.createElement( RichText, {
								tagName: 'p',
								className: 'sharetech-hero__percentage',
								value: attributes.percentage,
								onChange: function ( value ) {
									setAttributes( { percentage: value } );
								},
								placeholder: '80%'
							} ),
							wp.element.createElement(
								'h1',
								{ className: 'sharetech-hero__title' },
								wp.element.createElement( RichText, {
									tagName: 'span',
									value: attributes.headingLineOne,
									onChange: function ( value ) {
										setAttributes( { headingLineOne: value } );
									},
									placeholder: __( 'de tus', 'sharetech' )
								} ),
								wp.element.createElement( RichText, {
									tagName: 'span',
									value: attributes.headingLineTwo,
									onChange: function ( value ) {
										setAttributes( { headingLineTwo: value } );
									},
									placeholder: __( 'trabajadores.', 'sharetech' )
								} )
							),
							wp.element.createElement( RichText, {
								tagName: 'p',
								className: 'sharetech-hero__subtitle',
								value: attributes.subtitle,
								onChange: function ( value ) {
									setAttributes( { subtitle: value } );
								},
								placeholder: __( 'Subtítulo del hero', 'sharetech' )
							} ),
							wp.element.createElement( RichText, {
								tagName: 'p',
								className: 'sharetech-hero__description',
								value: attributes.description,
								onChange: function ( value ) {
									setAttributes( { description: value } );
								},
								placeholder: __( 'Descripción del hero', 'sharetech' )
							} ),
							wp.element.createElement(
								'div',
								{ className: 'sharetech-hero__actions' },
								wp.element.createElement( 'a', { className: 'sharetech-hero__button sharetech-hero__button--primary', href: '#' },
									wp.element.createElement( RichText, {
										tagName: 'span',
										value: attributes.primaryButtonText,
										onChange: function ( value ) {
											setAttributes( { primaryButtonText: value } );
										},
										placeholder: __( 'Ver productos', 'sharetech' )
									} )
								),
								wp.element.createElement( 'a', { className: 'sharetech-hero__button sharetech-hero__button--secondary', href: '#' },
									wp.element.createElement( RichText, {
										tagName: 'span',
										value: attributes.secondaryButtonText,
										onChange: function ( value ) {
											setAttributes( { secondaryButtonText: value } );
										},
										placeholder: __( 'Hablar con un asesor', 'sharetech' )
									} )
								)
							),
							wp.element.createElement(
								'div',
								{ className: 'sharetech-hero__features' },
								wp.element.createElement( RichText, {
									tagName: 'span',
									className: 'sharetech-hero__feature-chip',
									value: attributes.featureOne,
									onChange: function ( value ) {
										setAttributes( { featureOne: value } );
									}
								} ),
								wp.element.createElement( RichText, {
									tagName: 'span',
									className: 'sharetech-hero__feature-chip',
									value: attributes.featureTwo,
									onChange: function ( value ) {
										setAttributes( { featureTwo: value } );
									}
								} ),
								wp.element.createElement( RichText, {
									tagName: 'span',
									className: 'sharetech-hero__feature-chip',
									value: attributes.featureThree,
									onChange: function ( value ) {
										setAttributes( { featureThree: value } );
									}
								} ),
								wp.element.createElement( RichText, {
									tagName: 'span',
									className: 'sharetech-hero__feature-chip',
									value: attributes.featureFour,
									onChange: function ( value ) {
										setAttributes( { featureFour: value } );
									}
								} ),
								wp.element.createElement( RichText, {
									tagName: 'span',
									className: 'sharetech-hero__feature-chip',
									value: attributes.featureFive,
									onChange: function ( value ) {
										setAttributes( { featureFive: value } );
									}
								} )
							)
						),
						wp.element.createElement(
							'div',
							{ className: 'sharetech-hero__media' },
							wp.element.createElement( RichText, {
								tagName: 'span',
								className: 'sharetech-hero__chip sharetech-hero__chip--top',
								value: attributes.specTopRight,
								onChange: function ( value ) {
									setAttributes( { specTopRight: value } );
								}
							} ),
							wp.element.createElement( RichText, {
								tagName: 'span',
								className: 'sharetech-hero__chip sharetech-hero__chip--middle',
								value: attributes.specMiddleRight,
								onChange: function ( value ) {
									setAttributes( { specMiddleRight: value } );
								}
							} ),
							wp.element.createElement( RichText, {
								tagName: 'span',
								className: 'sharetech-hero__chip sharetech-hero__chip--bottom',
								value: attributes.specBottomLeft,
								onChange: function ( value ) {
									setAttributes( { specBottomLeft: value } );
								}
							} ),
							wp.element.createElement(
								'div',
								{ className: 'sharetech-hero__device' },
								wp.element.createElement( RichText, {
									tagName: 'p',
									className: 'sharetech-hero__device-label',
									value: attributes.productLabel,
									onChange: function ( value ) {
										setAttributes( { productLabel: value } );
									}
								} ),
								attributes.productImageUrl ? wp.element.createElement( 'img', {
									className: 'sharetech-hero__device-image',
									src: attributes.productImageUrl,
									alt: attributes.productImageAlt || ''
								} ) : wp.element.createElement( RichText, {
									tagName: 'p',
									className: 'sharetech-hero__device-placeholder',
									value: attributes.productPlaceholder,
									onChange: function ( value ) {
										setAttributes( { productPlaceholder: value } );
									}
								} )
							)
						)
					)
				)
			];
		},

		save: function ( props ) {
			const { attributes } = props;
			const blockProps = useBlockProps.save( {
				className: 'sharetech-hero alignfull'
			} );

			return wp.element.createElement(
				'section',
				blockProps,
				wp.element.createElement(
					'div',
					{ className: 'sharetech-hero__inner' },
					wp.element.createElement(
						'div',
						{ className: 'sharetech-hero__content' },
						wp.element.createElement( RichText.Content, {
							tagName: 'p',
							className: 'sharetech-hero__kicker',
							value: attributes.kicker
						} ),
						wp.element.createElement( RichText.Content, {
							tagName: 'p',
							className: 'sharetech-hero__percentage',
							value: attributes.percentage
						} ),
						wp.element.createElement(
							'h1',
							{ className: 'sharetech-hero__title' },
							wp.element.createElement( RichText.Content, {
								tagName: 'span',
								value: attributes.headingLineOne
							} ),
							wp.element.createElement( RichText.Content, {
								tagName: 'span',
								value: attributes.headingLineTwo
							} )
						),
						wp.element.createElement( RichText.Content, {
							tagName: 'p',
							className: 'sharetech-hero__subtitle',
							value: attributes.subtitle
						} ),
						wp.element.createElement( RichText.Content, {
							tagName: 'p',
							className: 'sharetech-hero__description',
							value: attributes.description
						} ),
						wp.element.createElement(
							'div',
							{ className: 'sharetech-hero__actions' },
							wp.element.createElement(
								'a',
								{ className: 'sharetech-hero__button sharetech-hero__button--primary', href: attributes.primaryButtonUrl || '#', rel: 'noopener' },
								wp.element.createElement( RichText.Content, {
									tagName: 'span',
									value: attributes.primaryButtonText
								} )
							),
							wp.element.createElement(
								'a',
								{ className: 'sharetech-hero__button sharetech-hero__button--secondary', href: attributes.secondaryButtonUrl || '#', rel: 'noopener' },
								wp.element.createElement( RichText.Content, {
									tagName: 'span',
									value: attributes.secondaryButtonText
								} )
							)
						),
						wp.element.createElement(
							'div',
							{ className: 'sharetech-hero__features' },
							wp.element.createElement( RichText.Content, {
								tagName: 'span',
								className: 'sharetech-hero__feature-chip',
								value: attributes.featureOne
							} ),
							wp.element.createElement( RichText.Content, {
								tagName: 'span',
								className: 'sharetech-hero__feature-chip',
								value: attributes.featureTwo
							} ),
							wp.element.createElement( RichText.Content, {
								tagName: 'span',
								className: 'sharetech-hero__feature-chip',
								value: attributes.featureThree
							} ),
							wp.element.createElement( RichText.Content, {
								tagName: 'span',
								className: 'sharetech-hero__feature-chip',
								value: attributes.featureFour
							} ),
							wp.element.createElement( RichText.Content, {
								tagName: 'span',
								className: 'sharetech-hero__feature-chip',
								value: attributes.featureFive
							} )
						)
					),
					wp.element.createElement(
						'div',
						{ className: 'sharetech-hero__media' },
						wp.element.createElement( RichText.Content, {
							tagName: 'span',
							className: 'sharetech-hero__chip sharetech-hero__chip--top',
							value: attributes.specTopRight
						} ),
						wp.element.createElement( RichText.Content, {
							tagName: 'span',
							className: 'sharetech-hero__chip sharetech-hero__chip--middle',
							value: attributes.specMiddleRight
						} ),
						wp.element.createElement( RichText.Content, {
							tagName: 'span',
							className: 'sharetech-hero__chip sharetech-hero__chip--bottom',
							value: attributes.specBottomLeft
						} ),
						wp.element.createElement(
							'div',
							{ className: 'sharetech-hero__device' },
							wp.element.createElement( RichText.Content, {
								tagName: 'p',
								className: 'sharetech-hero__device-label',
								value: attributes.productLabel
							} ),
							attributes.productImageUrl ? wp.element.createElement( 'img', {
								className: 'sharetech-hero__device-image',
								src: attributes.productImageUrl,
								alt: attributes.productImageAlt || ''
							} ) : wp.element.createElement( RichText.Content, {
								tagName: 'p',
								className: 'sharetech-hero__device-placeholder',
								value: attributes.productPlaceholder
							} )
						)
					)
				)
			);
		}
	} );
} )( window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.i18n );