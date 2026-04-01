( function ( blocks, element, blockEditor, components, i18n ) {
	const { registerBlockType } = blocks;
	const { createElement: el, useEffect, useMemo, useState } = element;
	const { useBlockProps, InspectorControls } = blockEditor;
	const { TextControl, RangeControl, PanelBody, CheckboxControl, SelectControl, ToggleControl, Spinner } = components;
	const { __ } = i18n;
	const apiFetch = wp.apiFetch;

	const getProductPriceLabel = function ( product ) {
		if ( product && product.price ) {
			return '$' + product.price;
		}

		if ( product && product.prices && product.prices.price ) {
			const minorUnit = Number( product.prices.currency_minor_unit || 2 );
			const amount = Number( product.prices.price || 0 );
			const divisor = Math.pow( 10, minorUnit );
			return '$' + ( amount / divisor ).toFixed( minorUnit );
		}

		return '';
	};

	const getProductImage = function ( product ) {
		if ( product && Array.isArray( product.images ) && product.images[0] && product.images[0].src ) {
			return product.images[0].src;
		}

		return '';
	};

	registerBlockType( 'sharetech/featured-products', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const blockProps = useBlockProps( {
				className: 'sharetech-featured-products-editor'
			} );

			const [ products, setProducts ] = useState( [] );
			const [ tags, setTags ] = useState( [] );
			const [ isLoadingProducts, setIsLoadingProducts ] = useState( false );
			const [ isLoadingTags, setIsLoadingTags ] = useState( false );
			const [ searchTerm, setSearchTerm ] = useState( '' );

			useEffect( function () {
				let isMounted = true;
				const perPage = 100;

				const loadProducts = function () {
					setIsLoadingProducts( true );

					const baseParams = {
						per_page: perPage,
						page: 1
					};

					if ( attributes.filterType === 'sale' ) {
						baseParams.on_sale = true;
					}

					if ( attributes.filterType === 'featured' ) {
						baseParams.featured = true;
					}

					if ( attributes.filterType === 'tags' && attributes.selectedTags.length > 0 ) {
						baseParams.tag = attributes.selectedTags.join( ',' );
					}

					const allProducts = [];

					const fetchFromPath = function ( basePath, page ) {
						const params = Object.assign( {}, baseParams, { page: page } );

						return apiFetch( {
							path: wp.url.addQueryArgs( basePath, params )
						} );
					};

					const fetchProducts = function ( page ) {
						return fetchFromPath( '/wc/store/v1/products', page )
							.catch( function () {
								return fetchFromPath( '/wc/v3/products', page );
							} )
							.then( function ( data ) {
								if ( ! Array.isArray( data ) ) {
									throw new Error( 'Unexpected products response.' );
								}

								allProducts.push.apply( allProducts, data );

								if ( data.length === perPage ) {
									return fetchProducts( page + 1 );
								}
							} );
					};

					fetchProducts( 1 )
						.then( function () {
							if ( isMounted ) {
								setProducts( allProducts );
							}
						} )
						.catch( function () {
							if ( isMounted ) {
								setProducts( [] );
							}
						} )
						.finally( function () {
							if ( isMounted ) {
								setIsLoadingProducts( false );
							}
						} );
				};

				const loadTags = function () {
					setIsLoadingTags( true );
					apiFetch( { path: '/wc/store/v1/products/tags?per_page=100' } )
						.catch( function () {
							return apiFetch( { path: '/wc/v3/products/tags?per_page=100' } );
						} )
						.then( function ( data ) {
							if ( isMounted && Array.isArray( data ) ) {
								setTags( data );
							}
						} )
						.catch( function () {
							if ( isMounted ) {
								setTags( [] );
							}
						} )
						.finally( function () {
							if ( isMounted ) {
								setIsLoadingTags( false );
							}
						} );
				};

				loadProducts();
				loadTags();

				return function () {
					isMounted = false;
				};
			}, [ attributes.filterType, attributes.selectedTags, attributes.randomizeProducts ] );

			const filteredProducts = useMemo( function () {
				const term = searchTerm.toLowerCase();

				return products.filter( function ( product ) {
					const title = ( product.name || '' ).toLowerCase();
					const sku = ( product.sku || '' ).toLowerCase();
					const description = ( product.description || '' ).toLowerCase();

					return title.includes( term ) || sku.includes( term ) || description.includes( term );
				} );
			}, [ products, searchTerm ] );

			const toggleProductSelection = function ( productId ) {
				const currentProducts = Array.isArray( attributes.selectedProducts ) ? attributes.selectedProducts : [];
				const exists = currentProducts.includes( productId );

				if ( exists ) {
					setAttributes( {
						selectedProducts: currentProducts.filter( function ( id ) {
							return id !== productId;
						} )
					} );
					return;
				}

				if ( currentProducts.length < attributes.productsToShow ) {
					setAttributes( {
						selectedProducts: [ ...currentProducts, productId ]
					} );
				}
			};

			const toggleTagSelection = function ( tagId ) {
				const currentTags = Array.isArray( attributes.selectedTags ) ? attributes.selectedTags : [];
				const exists = currentTags.includes( tagId );

				setAttributes( {
					selectedTags: exists
						? currentTags.filter( function ( id ) {
							return id !== tagId;
						} )
						: [ ...currentTags, tagId ]
				} );
			};

			const selectedProductsData = ( attributes.selectedProducts || [] ).map( function ( productId ) {
				const found = products.find( function ( product ) {
					return product.id === productId;
				} );

				return {
					id: productId,
					name: found && found.name ? found.name : 'Producto #' + productId,
					price: found ? getProductPriceLabel( found ) : '',
					image: found ? getProductImage( found ) : ''
				};
			} );

			const displayProducts = attributes.filterType === 'manual'
				? products.filter( function ( product ) {
					return ( attributes.selectedProducts || [] ).includes( product.id );
				} )
				: filteredProducts.slice( 0, attributes.productsToShow );

			return el( 'div', blockProps, [
				el( InspectorControls, { key: 'controls' }, [
					el( PanelBody, { title: __( 'Configuracion general', 'sharetech' ), initialOpen: true, key: 'general' }, [
						el( TextControl, {
							key: 'title',
							label: __( 'Titulo', 'sharetech' ),
							value: attributes.title,
							onChange: function ( value ) {
								setAttributes( { title: value } );
							}
						} ),
						el( RangeControl, {
							key: 'count',
							label: __( 'Productos a mostrar', 'sharetech' ),
							value: attributes.productsToShow,
							onChange: function ( value ) {
								setAttributes( {
									productsToShow: value,
									selectedProducts: ( attributes.selectedProducts || [] ).slice( 0, value )
								} );
							},
							min: 1,
							max: 12
						} ),
						el( ToggleControl, {
							key: 'random',
							label: __( 'Mostrar productos aleatorios', 'sharetech' ),
							help: __( 'Reordena los productos en cada carga del sitio.', 'sharetech' ),
							checked: !! attributes.randomizeProducts,
							onChange: function ( value ) {
								setAttributes( { randomizeProducts: value } );
							}
						} )
					] ),
					el( PanelBody, { title: __( 'Filtros de producto', 'sharetech' ), initialOpen: true, key: 'filters' }, [
						el( SelectControl, {
							key: 'filterType',
							label: __( 'Tipo de filtro', 'sharetech' ),
							value: attributes.filterType,
							options: [
								{ label: __( 'Seleccion manual', 'sharetech' ), value: 'manual' },
								{ label: __( 'Por etiquetas', 'sharetech' ), value: 'tags' },
								{ label: __( 'Productos en oferta', 'sharetech' ), value: 'sale' },
								{ label: __( 'Productos destacados', 'sharetech' ), value: 'featured' }
							],
							onChange: function ( value ) {
								setAttributes( {
									filterType: value,
									selectedProducts: [],
									selectedTags: []
								} );
							}
						} ),
						attributes.filterType === 'manual' && el( 'div', { key: 'manual-settings' }, [
							el( 'p', { className: 'sharetech-featured-products-editor__counter', key: 'counter' },
								selectedProductsData.length + ' / ' + attributes.productsToShow + ' ' + __( 'seleccionados', 'sharetech' )
							),
							el( TextControl, {
								key: 'search',
								label: __( 'Buscar productos', 'sharetech' ),
								value: searchTerm,
								onChange: setSearchTerm,
								placeholder: __( 'Nombre, SKU o descripcion...', 'sharetech' ),
								disabled: isLoadingProducts
							} ),
							isLoadingProducts ? el( Spinner, { key: 'loading-products' } ) : null,
							el( 'div', { className: 'sharetech-featured-products-editor__products-grid', key: 'product-grid' },
								filteredProducts.map( function ( product ) {
									const isSelected = ( attributes.selectedProducts || [] ).includes( product.id );
									return el( 'button', {
										type: 'button',
										key: 'product-' + product.id,
										className: 'sharetech-featured-products-editor__product-item ' + ( isSelected ? 'is-selected' : '' ),
										onClick: function () {
											toggleProductSelection( product.id );
										}
									}, [
										getProductImage( product ) ? el( 'img', {
											key: 'img',
											src: getProductImage( product ),
											alt: product.name || ''
										} ) : null,
										el( 'span', { key: 'name', className: 'sharetech-featured-products-editor__product-name' }, product.name || '' ),
										el( 'span', { key: 'price', className: 'sharetech-featured-products-editor__product-price' }, getProductPriceLabel( product ) )
									] );
								} )
							),
							el( 'ul', { className: 'sharetech-featured-products-editor__selected', key: 'selected-products' },
								selectedProductsData.map( function ( product ) {
									return el( 'li', { key: 'selected-' + product.id }, [
										el( 'span', { key: 'name' }, product.name ),
										el( 'button', {
											type: 'button',
											key: 'remove',
											onClick: function () {
												toggleProductSelection( product.id );
											}
										}, __( 'Quitar', 'sharetech' ) )
									] );
								} )
							)
						] ),
						attributes.filterType === 'tags' && el( 'div', { key: 'tags-settings' }, [
							isLoadingTags ? el( Spinner, { key: 'loading-tags' } ) : null,
							tags.map( function ( tag ) {
								return el( CheckboxControl, {
									key: 'tag-' + tag.id,
									label: tag.name,
									checked: ( attributes.selectedTags || [] ).includes( tag.id ),
									onChange: function () {
										toggleTagSelection( tag.id );
									}
								} );
							} )
						] )
					] )
				] ),
				el( 'div', { className: 'sharetech-featured-products-editor__preview', key: 'preview' }, [
					el( 'h3', { key: 'preview-title' }, attributes.title ),
					isLoadingProducts ? el( 'p', { key: 'preview-loading' }, __( 'Cargando productos...', 'sharetech' ) ) : null,
					! isLoadingProducts && displayProducts.length === 0
						? el( 'p', { key: 'preview-empty' }, __( 'No hay productos para mostrar en la vista previa.', 'sharetech' ) )
						: null,
					! isLoadingProducts && displayProducts.length > 0
						? el( 'div', { className: 'sharetech-featured-products-editor__preview-grid', key: 'preview-grid' },
							displayProducts.slice( 0, attributes.productsToShow ).map( function ( product ) {
								return el( 'article', { className: 'sharetech-featured-products-editor__preview-item', key: 'preview-' + product.id }, [
									getProductImage( product ) ? el( 'img', {
										key: 'img',
										src: getProductImage( product ),
										alt: product.name || ''
									} ) : null,
									el( 'h4', { key: 'title' }, product.name || '' ),
									el( 'span', { key: 'price' }, getProductPriceLabel( product ) )
								] );
							} )
						)
						: null
				] )
			] );
		},

		save: function () {
			return null;
		}
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n );
