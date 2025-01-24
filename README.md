# 🌱 huerto_01234

Un catálogo de web apps y herramientas con un diseño brutalista moderno.

## 🎨 Características

- **Diseño Brutalista Moderno**: Interfaz minimalista con efectos visuales modernos
- **Efectos Visuales**:
  - Fondo con gradiente animado y efecto de ruido
  - Glassmorphism en tarjetas y botones
  - Efectos hover con animaciones suaves
  - Efectos glitch en textos
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Sistema de Rating**: Ordenamiento por rating y fecha
- **Scroll Suave**: Botón "volver arriba" con animación

## 🛠 Tecnologías

- HTML5
- CSS3 (Módulos CSS)
- JavaScript (Vanilla)
- Phosphor Icons
- Google Fonts (Montserrat)

## 📦 Estructura

```
huerto_01234/
├── css/
│   ├── main.css
│   └── modules/
│       ├── _colors.css
│       ├── _layout.css
│       ├── _links.css
│       ├── _typography.css
│       └── _variables.css
├── js/
│   ├── config.js
│   ├── rating.js
│   └── scroll.js
└── index.html
```

## 🚀 Características del Diseño

### Efectos Visuales
- **Fondo**: Gradiente animado con efecto de ruido y patrones
- **Cards**: Efecto glassmorphism con hover animado
- **Botones**: Diseño minimalista con efectos de hover y active
- **Textos**: Efectos glitch y animaciones sutiles

### Componentes
- **Hero Section**: Sección principal con efectos de resplandor
- **Grid**: Sistema de grid responsive con cards animadas
- **Botones**: Sistema de botones con efectos visuales
- **Footer**: Pie de página con enlaces y créditos

## 📱 Responsive

El diseño se adapta a diferentes tamaños de pantalla:
- Desktop: Grid de múltiples columnas
- Tablet: Grid de 2 columnas
- Mobile: Grid de 1 columna

## 🔧 Desarrollo

Para iniciar el servidor de desarrollo:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run serve
```

El servidor se iniciará en http://localhost:3000

## Scripts disponibles

- `npm run serve`: Inicia el servidor de desarrollo con control de caché optimizado
- `npm run build`: Construye los archivos CSS para producción
- `npm run dev`: Inicia el servidor de desarrollo alternativo (legacy)

## Estructura de archivos

```
.
├── css/
│   ├── bundle.css        # Archivo CSS principal (compilado)
│   └── modules/          # Módulos CSS individuales
├── js/
│   ├── config.js
│   ├── rating.js
│   └── scroll.js
└── server.js            # Servidor de desarrollo personalizado
```

## Características

- Diseño brutalista con efectos glitch
- Sistema de rating persistente
- Efectos de glassmorphism
- Control optimizado de caché
- Headers configurados para máxima estabilidad

## 📄 Licencia

MIT License - Sergio Forés
