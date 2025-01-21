# huerto_01234

Sistema de diseño minimalista basado en ritmo vertical y escala modular.

## Sistema de Espaciado

El sistema utiliza una unidad base de ritmo vertical (`--rhythm: 1.5rem`) que define toda la estructura espacial.

### Escala de Espaciado

```css
--space-xxs: calc(var(--rhythm) * 0.25)  /* 0.375rem */
--space-xs: calc(var(--rhythm) * 0.5)    /* 0.75rem */
--space-s: var(--rhythm)                 /* 1.5rem */
--space-m: calc(var(--rhythm) * 2)       /* 3rem */
--space-l: calc(var(--rhythm) * 3)       /* 4.5rem */
--space-xl: calc(var(--rhythm) * 4)      /* 6rem */
--space-xxl: calc(var(--rhythm) * 6)     /* 9rem */
```

## Sistema Tipográfico

La tipografía se basa en una escala modular de 1.25 y se alinea con el ritmo vertical.

### Escala Tipográfica

```css
--font-size-base: var(--rhythm)          /* 1.5rem */
--font-xs: calc(var(--font-size-base) / var(--scale))        /* 1.2rem */
--font-sm: var(--font-size-base)                             /* 1.5rem */
--font-md: calc(var(--font-size-base) * var(--scale))        /* 1.875rem */
--font-lg: calc(var(--font-size-base) * var(--scale) * 2)    /* 3.75rem */
```

## Grid System

El grid utiliza una estructura flexible basada en el ritmo vertical:

- Columnas: `minmax(calc(var(--rhythm) * 12), 1fr)`
- Filas: `minmax(calc(var(--rhythm) * 8), auto)`
- Gaps: `1px`

## Responsive Design

El sistema se adapta a diferentes tamaños de pantalla ajustando la unidad base de ritmo:

```css
/* Desktop */
--rhythm: 1.5rem

/* Tablet (≤768px) */
--rhythm: 1.25rem

/* Mobile (≤480px) */
--rhythm: 1rem
```

## Paleta de Color

### Escala de Grises
```css
--white: hsl(0, 0%, 100%)
--gray-100: hsl(0, 0%, 95%)
--gray-200: hsl(0, 0%, 85%)
--gray-300: hsl(0, 0%, 65%)
--gray-400: hsl(0, 0%, 45%)
--black: hsl(0, 0%, 0%)
```

### Colores Principales
El sistema utiliza HSL para una mayor flexibilidad:

```css
--primary-hue: 389
--primary-saturation: 10%
--primary-lightness: 44%

--color-primary: hsl(var(--primary-hue), var(--primary-saturation), var(--primary-lightness))
--color-accent: hwb(230 0% 0%)
```

## Principios de Diseño

1. **Ritmo Vertical**: Todo el espaciado se basa en una unidad de ritmo consistente
2. **Escala Modular**: La tipografía sigue una escala modular de 1.25
3. **Minimalismo**: Gaps de 1px y diseño limpio
4. **Flexibilidad**: Sistema adaptable mediante CSS Custom Properties
5. **Consistencia**: Todos los espacios y tamaños son múltiplos o divisiones del ritmo base

## Uso

1. El sistema utiliza CSS Custom Properties para máxima flexibilidad
2. Los espaciados se aplican mediante las variables `--space-*`
3. La tipografía se controla con las variables `--font-*`
4. Los colores y el tema se pueden ajustar modificando las variables HSL

## Dependencias

- No requiere frameworks externos
- Compatible con navegadores modernos que soporten CSS Grid y Custom Properties
