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
- `custom-blocks/`: bloques personalizados por feature.

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