# Pupun Korvat - Artisan Jewelry Styling Guide

This skill defines the visual design language for Pupun Korvat, a Finnish handmade jewelry e-commerce shop. Use this guide when creating or styling any components for this project.

## Brand Identity

**Brand Voice:** Elegant, artisan, warm, personal, Finnish craftsmanship
**Target Feel:** Luxury boutique meets handmade authenticity

---

## Color Palette

### Primary Colors (defined in globals.css)

| Color | CSS Variable | Tailwind Class | Usage |
|-------|--------------|----------------|-------|
| Rose Gold | `--rose-gold: 15 45% 65%` | `rose-gold` | Primary accent, buttons, borders, highlights |
| Champagne | `--champagne: 38 45% 78%` | `champagne` | Secondary accent, hover states, warm highlights |
| Cream | `--cream: 35 40% 95%` | `cream` | Light backgrounds, cards |
| Warm White | `--warm-white: 30 33% 98%` | `warm-white` | Main background |
| Soft Blush | `--soft-blush: 350 35% 90%` | `soft-blush` | Subtle accents, icon backgrounds |
| Deep Burgundy | `--deep-burgundy: 350 45% 30%` | `deep-burgundy` | Sale badges, alerts, emphasis |
| Charcoal | `--charcoal: 20 15% 18%` | `charcoal` | Text, dark sections, CTAs |

### Color Usage Rules

1. **Backgrounds:** Use `warm-white` as primary, `cream` for section variation
2. **Text:** Use `charcoal` for headings, `charcoal/70` or `charcoal/60` for body text
3. **Accents:** Use `rose-gold` for interactive elements, borders, and highlights
4. **Sales/Emphasis:** Use `deep-burgundy` for sale badges and urgent CTAs
5. **Hover States:** Transition to `rose-gold` or `champagne` on hover

---

## Typography

### Font Families

- **Primary Font** (`font-primary`): Used for headings, titles, brand name, prices
- **Secondary Font** (`font-secondary`): Used for body text, descriptions, buttons, labels

### Text Styles

```css
/* Hero Title */
text-6xl sm:text-8xl lg:text-9xl font-primary tracking-tight

/* Section Titles */
text-4xl md:text-5xl lg:text-6xl font-primary tracking-tight text-charcoal

/* Subtitles/Labels */
text-xs tracking-[0.3em] uppercase font-secondary text-charcoal/70

/* Body Text */
text-base lg:text-lg font-secondary text-charcoal/70 leading-relaxed

/* Small Text */
text-xs text-charcoal/60 font-secondary
```

### Text Gradient Effect

```css
.text-gradient-gold {
  background: linear-gradient(135deg, hsl(38 50% 55%), hsl(15 45% 65%), hsl(38 50% 55%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Decorative Elements

### Diamond Shape

Used throughout as a brand motif:

```css
.diamond-shape {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
```

Usage:
```jsx
<div className="w-2 h-2 bg-rose-gold/60 diamond-shape" />
<div className="w-3 h-3 bg-champagne/40 diamond-shape" />
```

### Corner Accents

Signature framing element for cards and sections:

```jsx
{/* Top corners */}
<div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-rose-gold/40" />
<div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-rose-gold/40" />

{/* Bottom corners */}
<div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-rose-gold/40" />
<div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-rose-gold/40" />
```

Animate on hover:
```jsx
className="transition-all duration-500 group-hover:w-12 group-hover:h-12 group-hover:border-rose-gold/60"
```

### Gradient Lines

Decorative dividers:

```jsx
{/* Horizontal gradient line */}
<div className="h-[1px] bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent" />

{/* Short accent line */}
<div className="w-12 h-[1px] bg-gradient-to-r from-rose-gold/60 to-transparent" />
```

### Shimmer Effect

Gold shimmer overlay for hover states:

```css
.shimmer-gold {
  background: linear-gradient(
    110deg,
    transparent 20%,
    hsl(38 60% 80% / 0.4) 40%,
    hsl(38 60% 90% / 0.6) 50%,
    hsl(38 60% 80% / 0.4) 60%,
    transparent 80%
  );
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}
```

---

## Component Patterns

### Cards

```jsx
<div className="relative bg-warm-white overflow-hidden">
  {/* Border frame */}
  <div className="absolute inset-0 border border-rose-gold/10 z-10 pointer-events-none transition-colors duration-500 group-hover:border-rose-gold/30" />

  {/* Corner accents */}
  <div className="absolute top-0 left-0 w-6 h-6 border-l border-t border-rose-gold/30 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10" />
  {/* ... other corners */}

  {/* Content */}
</div>
```

### Buttons

**Primary CTA:**
```jsx
<button className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold">
  Button Text
  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
</button>
```

**Secondary/Outline:**
```jsx
<button className="inline-flex items-center gap-3 px-8 py-4 border border-charcoal/30 text-charcoal font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:border-rose-gold hover:text-rose-gold">
  Button Text
</button>
```

### Section Headers

```jsx
<div className="py-16 md:py-24 text-center">
  {/* Diamond decoration */}
  <div className="flex items-center justify-center gap-4 mb-6">
    <div className="w-2 h-2 bg-rose-gold/60 diamond-shape" />
    <div className="w-16 h-[1px] bg-gradient-to-r from-rose-gold/60 to-champagne/40" />
    <div className="w-1.5 h-1.5 bg-champagne/50 diamond-shape" />
    <div className="w-16 h-[1px] bg-gradient-to-l from-rose-gold/60 to-champagne/40" />
    <div className="w-2 h-2 bg-rose-gold/60 diamond-shape" />
  </div>

  <h2 className="text-4xl md:text-5xl font-primary text-charcoal">
    Section Title
  </h2>

  <p className="mt-4 text-base font-secondary text-charcoal/60 max-w-2xl mx-auto">
    Optional description text
  </p>

  {/* Bottom line */}
  <div className="mt-6 h-[1px] bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent max-w-xs mx-auto" />
</div>
```

---

## Animation Guidelines

### Framer Motion Patterns

**Scroll-triggered fade up:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
```

**Staggered children:**
```jsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};
```

**Floating animation:**
```jsx
animate={{
  y: [0, -15, 0],
  rotate: [0, 5, 0],
}}
transition={{
  duration: 6,
  repeat: Infinity,
  ease: "easeInOut",
}}
```

### CSS Transitions

Standard durations:
- Fast: `duration-300`
- Medium: `duration-500`
- Slow: `duration-700`

Common hover transitions:
```css
transition-all duration-500
transition-colors duration-300
transition-transform duration-300
```

---

## Image Treatment

### Aspect Ratios

- Hero: Full viewport (`min-h-screen`)
- Category cards: `aspect-[3/4]`
- Product cards: `aspect-square`
- About section: `aspect-[4/5]`

### Image Overlays

```jsx
{/* Gradient from bottom */}
<div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />

{/* Soft vignette */}
<div className="absolute inset-0 bg-gradient-to-b from-warm-white/40 via-transparent to-warm-white/90" />
```

### Hover Effects

```jsx
className="transition-transform duration-700 group-hover:scale-105"
className="transition-transform duration-700 group-hover:scale-110"
```

---

## Dark Section Pattern

For contrast sections (CTAs, footers):

```jsx
<section className="relative py-24 bg-charcoal overflow-hidden">
  {/* Top/bottom gradient lines */}
  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent" />

  {/* Corner accents */}
  <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-rose-gold/20" />

  {/* Floating diamonds */}
  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-rose-gold/20 diamond-shape" />

  {/* Content with light text */}
  <div className="text-warm-white">
    {/* ... */}
  </div>
</section>
```

---

## Responsive Patterns

### Breakpoints

- Mobile first approach
- `sm:` (640px) - Show desktop elements
- `md:` (768px) - Adjust spacing
- `lg:` (1024px) - Full desktop layout

### Common Patterns

```jsx
{/* Hide on mobile, show on desktop */}
className="hidden sm:block"
className="hidden lg:flex"

{/* Show on mobile, hide on desktop */}
className="sm:hidden"
className="lg:hidden"

{/* Responsive grid */}
className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
className="grid grid-cols-2 lg:grid-cols-3 gap-6"

{/* Responsive text */}
className="text-4xl md:text-5xl lg:text-6xl"
className="text-base lg:text-lg"

{/* Responsive spacing */}
className="py-16 md:py-24"
className="px-4 sm:px-8"
```

---

## Finnish Language Notes

Common UI text patterns:
- "Tutustu" = Explore
- "Näytä lisätietoja" = Show details
- "Saatavilla" = Available
- "Tuote loppu" = Out of stock
- "Vaihtoehtoja" = Options available
- "Käsintehty" = Handmade
- "Uusimmat" = Latest
