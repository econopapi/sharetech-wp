( function ( blocks, blockEditor, components, i18n ) {
	const { registerBlockType } = blocks;
	const { useBlockProps, RichText } = blockEditor;
	const { Button } = components;
	const { __ } = i18n;

	const defaultItem = {
		icon: '⭐',
		title: 'Nuevo beneficio',
		description: 'Describe aquí el beneficio de esta sección.'
	};

	registerBlockType( 'sharetech/feature-strip', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const items = Array.isArray( attributes.items ) ? attributes.items : [];

			const blockProps = useBlockProps( {
				className: 'sharetech-feature-strip alignfull'
			} );

			const updateItemField = function ( index, field, value ) {
				const nextItems = items.map( function ( item, itemIndex ) {
					if ( itemIndex !== index ) {
						return item;
					}

					return {
						...item,
						[field]: value
					};
				} );

				setAttributes( { items: nextItems } );
			};

			const addItem = function () {
				setAttributes( { items: [ ...items, { ...defaultItem } ] } );
			};

			const removeItem = function ( index ) {
				const nextItems = items.filter( function ( item, itemIndex ) {
					return itemIndex !== index;
				} );

				setAttributes( { items: nextItems } );
			};

			return wp.element.createElement(
				'section',
				blockProps,
				wp.element.createElement(
					'div',
					{ className: 'sharetech-feature-strip__grid' },
					items.length ? items.map( function ( item, index ) {
						return wp.element.createElement(
							'article',
							{ className: 'sharetech-feature-strip__item', key: 'feature-item-' + index },
							wp.element.createElement(
								'div',
								{ className: 'sharetech-feature-strip__item-top' },
								wp.element.createElement( RichText, {
									tagName: 'span',
									className: 'sharetech-feature-strip__icon',
									value: item.icon,
									onChange: function ( value ) {
										updateItemField( index, 'icon', value );
									},
									placeholder: __( 'Ícono', 'sharetech' )
								} ),
								wp.element.createElement( RichText, {
									tagName: 'h3',
									className: 'sharetech-feature-strip__title',
									value: item.title,
									onChange: function ( value ) {
										updateItemField( index, 'title', value );
									},
									placeholder: __( 'Título', 'sharetech' )
								} )
							),
							wp.element.createElement( RichText, {
								tagName: 'p',
								className: 'sharetech-feature-strip__description',
								value: item.description,
								onChange: function ( value ) {
									updateItemField( index, 'description', value );
								},
								placeholder: __( 'Descripción', 'sharetech' )
							} ),
							wp.element.createElement(
								'div',
								{ className: 'sharetech-feature-strip__controls' },
								wp.element.createElement(
									Button,
									{ variant: 'secondary', onClick: addItem },
									__( 'Agregar sección', 'sharetech' )
								),
								wp.element.createElement(
									Button,
									{ variant: 'link', isDestructive: true, onClick: function () { removeItem( index ); } },
									__( 'Quitar', 'sharetech' )
								)
							)
						);
					} ) : wp.element.createElement(
						'div',
						{ className: 'sharetech-feature-strip__empty' },
						wp.element.createElement( 'p', {}, __( 'No hay secciones. Agrega la primera.', 'sharetech' ) ),
						wp.element.createElement(
							Button,
							{ variant: 'primary', onClick: addItem },
							__( 'Agregar sección', 'sharetech' )
						)
					)
				)
			);
		},

		save: function ( props ) {
			const { attributes } = props;
			const items = Array.isArray( attributes.items ) ? attributes.items : [];
			const blockProps = useBlockProps.save( {
				className: 'sharetech-feature-strip alignfull'
			} );

			return wp.element.createElement(
				'section',
				blockProps,
				wp.element.createElement(
					'div',
					{ className: 'sharetech-feature-strip__grid' },
					items.map( function ( item, index ) {
						return wp.element.createElement(
							'article',
							{ className: 'sharetech-feature-strip__item', key: 'feature-item-' + index },
							wp.element.createElement(
								'div',
								{ className: 'sharetech-feature-strip__item-top' },
								wp.element.createElement( RichText.Content, {
									tagName: 'span',
									className: 'sharetech-feature-strip__icon',
									value: item.icon
								} ),
								wp.element.createElement( RichText.Content, {
									tagName: 'h3',
									className: 'sharetech-feature-strip__title',
									value: item.title
								} )
							),
							wp.element.createElement( RichText.Content, {
								tagName: 'p',
								className: 'sharetech-feature-strip__description',
								value: item.description
							} )
						);
					} )
				)
			);
		}
	} );
} )( window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.i18n );