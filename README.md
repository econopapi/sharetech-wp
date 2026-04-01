# ShareTech Custom Astra
Implementación custom del tema Astra (Tema hijo) para la marca de cómputo ShareTech/ShareVDI/Share.

Autor: Daniel Limón  
Contacto: dani@dlimon.net  
Licencia: Pendiente

## Estructura de desarrollo

- `functions.php`: entry-point del tema hijo. Carga el bootstrap modular.
- `includes/`: lógica del tema desacoplada por responsabilidad.
	- `theme-setup.php`: carga de módulos internos.
	- `enqueue.php`: encolado de assets globales del tema.
	- `blocks.php`: registro de custom blocks de Gutenberg.
	- `footer.php`: override del footer de Astra + settings de Customizer + registro de menús de footer.
	- `page-hero.php`: helpers para resolver imagen Hero en páginas (`featured image` o fallback por defecto).
- `custom-blocks/`: bloques personalizados por feature.
- `template-parts/page/hero.php`: parcial de Hero para páginas individuales.
- `page.php`: override de template para páginas, con Hero + contenido.

## Hero para páginas (`page.php`)

Se implementó un Hero para páginas individuales que acompaña el título principal.

Comportamiento:

- El Hero NO se muestra cuando la página actual es la homepage (front page).
- La homepage mantiene su layout original (sin wrapper interno `sharetech-page-content__inner`) para no alterar el diseño full-width existente.
- Si la página tiene imagen destacada, se usa como fondo del Hero.
- Si no tiene imagen destacada, se usa fallback automático desde:
	- `assets/img/hero1.jpg`
	- `assets/img/hero2.jpg`
	- `assets/img/hero3.jpg`
- El fallback es determinístico por ID de página para mantener consistencia visual entre recargas.

Notas de implementación:

- Markup del Hero desacoplado en `template-parts/page/hero.php`.
- Lógica de selección de imagen en `includes/page-hero.php`.
- Estilos responsive y accesibles añadidos en `style.css` bajo la sección `Page template hero`.

### Cómo intercambiar entre Hero 1, 2 y 3

Ahora puedes cambiar el fallback global sin tocar código:

- Ir a `Apariencia > Personalizar > ShareTech Hero de Páginas`.
- En el campo `Hero fallback por defecto` elegir:
	- `Hero 1`
	- `Hero 2`
	- `Hero 3`
	- `Auto por ID de página`
	- `Aleatorio en cada carga`

## Bloques Gutenberg implementados

### `sharetech/hero-principal`

Primer bloque para maquetar el hero de la front page, basado en el mockup inicial.

Campos editables incluidos:

- Texto superior (kicker)
- Porcentaje principal
- Título en dos líneas
- Subtítulo y descripción
- Botón principal y secundario (texto + URL)
- Chips de especificaciones del lado derecho
- Etiqueta/placeholder de producto
- Chips de beneficios en la parte inferior

Notas de implementación:

- Diseño responsive para desktop/mobile.
- Estados de foco visibles para accesibilidad en botones.
- Paleta en tonos azules; no se usan los colores amarillos del marcador del mockup.
- Soporte de imagen del producto configurable desde opciones del bloque (Inspector).
- Configuración para ancho completo (`alignfull`) para usar el hero de borde a borde.

### `sharetech/benefit-card`

Bloque atómico para tarjetas de beneficios/características. Diseñado para insertar varias tarjetas independientes dentro de un contenedor Gutenberg (Columns, Group o Grid) mientras el resto de la sección se maqueta manualmente.

Campos editables incluidos:

- Ícono configurable (selector de imagen en opciones del bloque)
- Título de tarjeta
- Descripción de tarjeta
- Toggle por tarjeta para activar/desactivar efecto hover

Notas de implementación:

- El hover es opcional y se controla tarjeta por tarjeta.
- El bloque está pensado para que sólo desarrolles los cards como componentes atómicos.
- El registro de bloques ahora es automático para cualquier `custom-blocks/*/block.json`.

### `sharetech/feature-strip`

Bloque de sección completa para una franja de beneficios con layout horizontal, basado en icono + título + descripción por tarjeta.

Campos editables incluidos:

- Lista de secciones (repeater) editable dentro del bloque
- Icono por sección (texto libre para emoji o símbolo)
- Título por sección
- Descripción por sección

Comportamiento clave:

- Permite agregar y quitar secciones libremente (no está forzado a 4).
- Soporta `alignfull` para implementaciones de borde a borde.
- Responsive: en pantallas reducidas se apilan automáticamente.

### `sharetech/series-card`

Bloque atómico para representar cada serie de productos dentro de la sección de líneas de producto. Está pensado para insertar dos o más tarjetas de serie dentro de un contenedor Gutenberg.

Campos editables incluidos:

- Kicker superior
- Título de serie
- Descripción
- Lista editable de puntos de valor (agregar/quitar)
- Botón CTA (texto + URL)
- Imagen configurable desde opciones del bloque (selector multimedia + alt)

Notas de implementación:

- Layout dividido en dos paneles (media + contenido), inspirado en el mockup.
- Responsive para mobile con apilado vertical automático.

### `sharetech/featured-products`

Bloque dinámico para mostrar productos WooCommerce destacados con render en servidor (PHP), alineado a la identidad visual de ShareTech.

Campos editables incluidos:

- Título de sección
- Cantidad de productos a mostrar (1 a 12)
- Tipo de filtro:
	- Selección manual
	- Por etiquetas
	- Productos en oferta
	- Productos destacados
- Selección manual de productos (con buscador y lista de seleccionados)
- Selección de etiquetas para filtro por tags
- Toggle para aleatorizar el orden de productos

Notas de implementación:

- El bloque se registra de forma automática desde `custom-blocks/featured-products/block.json`.
- El render se resuelve en servidor mediante `custom-blocks/featured-products/render.php` y la lógica de negocio en `includes/featured-products.php`.
- Se valida stock y visibilidad de producto para evitar mostrar ítems no comprables.
- Incluye estilos de editor (`editor.css`) y frontend (`style.css`) con enfoque responsive.

## Personalizaciones de estilos globales

- Se agregó estilo scoped para formularios de newsletter de Forminator dentro de `.sharetech-newsletter-form`.
- Esta personalización aplica layout horizontal (input + botón), estados de foco accesibles, y comportamiento responsive.

## Footer personalizado (override Astra)

Se implementó un footer custom que reemplaza el footer por defecto de Astra y se gestiona desde WordPress, sin editar código.

Configuración desde WP Admin:

- Menús (`Apariencia > Menús > Ubicaciones`):
	- `ShareTech Footer - Navegación`
	- `ShareTech Footer - Soporte`
	- `ShareTech Footer - Empresa`
	- `ShareTech Footer - Legal (fila inferior)`
- Contenido y textos (`Apariencia > Personalizar > ShareTech Footer`):
	- Marca (título + descripción)
	- Títulos de columnas
	- Datos de contacto (teléfono, email, horario)
	- Copyright (soporta placeholder `{year}`)
	- URLs de redes sociales (Facebook, X/Twitter, LinkedIn, Instagram)

Archivo principal de lógica del footer:

- `includes/footer.php`