---
name: Matcha

colors:
  # Background layers
  bg: "#1e1e22"
  bg1: "#242429"
  bg2: "#2b2b31"
  
  # Borders
  b0: "#333339"
  b1: "#3c3c43"
  b2: "#4a4a52"
  
  # Text
  t1: "#f4efe6"
  t2: "#b5ad9e"
  t3: "#7d7770"
  cream: "#f4efe6"
  
  # Accent
  green: "#11B67A"
  green-dark: "#027a35"
  green-subtle: "rgba(17, 182, 122, 0.10)"
  
  # Semantic
  red: "#E5534B"
  yellow: "#D4A72C"
  
  # macOS window chrome
  dot-red: "#ff5f57"
  dot-yellow: "#febc2e"
  dot-green: "#28c840"

typography:
  display-hero:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  
  display-section:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  
  display-cta:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  
  display-stat:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  
  display-pricing:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "2.4rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.03em"
  
  display-proof-stat:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.02em"
  
  body-lg:
    fontFamily: "DM Sans, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.7
  
  body-md:
    fontFamily: "DM Sans, -apple-system, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  
  body-sm:
    fontFamily: "DM Sans, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
  
  label-eyebrow:
    fontFamily: "DM Sans, -apple-system, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.1em"
    textTransform: "uppercase"
  
  label-section:
    fontFamily: "DM Sans, -apple-system, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
    textTransform: "uppercase"
  
  label-tag:
    fontFamily: "DM Sans, -apple-system, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.07em"
    textTransform: "uppercase"
  
  label-button:
    fontFamily: "DM Sans, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1
  
  mono-md:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1
  
  mono-sm:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.08em"

rounded:
  DEFAULT: "12px"
  lg: "16px"

spacing:
  base: "8px"
  xs: "4px"
  sm: "12px"
  md: "14px"
  lg: "24px"
  xl: "28px"
  xxl: "32px"
  section: "72px"
  hero: "130px"
  container-padding: "24px"
  card-gap: "14px"

shadows:
  card-subtle:
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.15)"
  card-hover:
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)"
  tooltip:
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
  button-hover:
    boxShadow: "0 0 28px rgba(17, 182, 122, 0.2)"

motion:
  duration-fast: "180ms"
  duration-standard: "300ms"
  duration-slow: "550ms"
  easing: "ease-in-out"

components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "#ffffff"
    typography: "{typography.label-button}"
    rounded: "8px"
    padding: "10px 20px"
    transition: "background 180ms, box-shadow 180ms, transform 180ms"
  
  button-primary-hover:
    backgroundColor: "{colors.green-dark}"
    boxShadow: "{shadows.button-hover}"
    transform: "translateY(-1px)"
  
  button-primary-lg:
    fontSize: "14px"
    padding: "13px 28px"
    rounded: "10px"
  
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.t2}"
    border: "1px solid {colors.b2}"
    rounded: "8px"
    padding: "10px 20px"
  
  button-outline-hover:
    backgroundColor: "{colors.bg2}"
    textColor: "{colors.cream}"
    transform: "translateY(-1px)"
  
  card-standard:
    backgroundColor: "{colors.bg1}"
    border: "1px solid {colors.b1}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    transition: "border-color 300ms, transform 300ms, box-shadow 300ms"
  
  card-standard-hover:
    borderColor: "{colors.b2}"
    transform: "translateY(-2px)"
    boxShadow: "{shadows.card-hover}"
  
  nav-fixed:
    height: "56px"
    backgroundColor: "transparent"
    borderBottom: "1px solid transparent"
    transition: "background 300ms, border-color 300ms"
  
  nav-scrolled:
    backgroundColor: "rgba(30, 30, 34, 0.92)"
    backdropFilter: "blur(18px)"
    borderColor: "{colors.b0}"
  
  engine-window:
    backgroundColor: "{colors.bg1}"
    border: "1px solid {colors.b1}"
    rounded: "{rounded.lg}"
    boxShadow: "{shadows.card-subtle}"
  
  engine-chrome:
    height: "44px"
    backgroundColor: "{colors.bg2}"
    borderBottom: "1px solid {colors.b0}"
  
  table-header:
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.06em"
    textTransform: "uppercase"
    textColor: "{colors.t3}"
    padding: "9px 16px"
  
  table-cell:
    fontSize: "13px"
    textColor: "{colors.t2}"
    padding: "12px 16px"
  
  status-pill:
    backgroundColor: "rgba(244, 239, 230, 0.04)"
    border: "1px solid {colors.b1}"
    textColor: "{colors.t2}"
    rounded: "999px"
    padding: "3px 9px"
    fontSize: "12px"
  
  icon-container:
    width: "36px"
    height: "36px"
    backgroundColor: "{colors.green-subtle}"
    textColor: "{colors.green}"
    rounded: "10px"
  
  chart-badge:
    backgroundColor: "{colors.green-subtle}"
    textColor: "{colors.green}"
    border: "1px solid rgba(17, 182, 122, 0.15)"
    rounded: "999px"
    padding: "4px 10px"
    fontSize: "11px"
    fontWeight: 500
  
  pricing-card:
    backgroundColor: "{colors.bg1}"
    border: "1px solid {colors.b1}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
---

# Matcha Design System

## Brand & Style

Matcha's design system embodies **founder-direct clarity** — the visual language of someone who sat inside an accounting firm for a month and watched juniors do grunt work. The aesthetic is dark, technical, and unapologetically functional, positioning the product as AI junior staff that replaces headcount rather than generic automation tools.

The design philosophy is **"terminal meets serif"** — combining the precision of monospace code editors with the authority of classical typography. This creates a unique tension: warm enough to feel human-built, cold enough to signal serious infrastructure.

The brand personality is **confident, direct, and unsentimental**. No superlatives. No "cutting-edge" or "revolutionary." The interface says what it replaces, not what it enables. Every design decision reinforces the core positioning: this is what you use instead of hiring another junior accountant.

## Colors

The color strategy is built on **dark technical surfaces** with a single accent color that signals completion and correctness.

### Philosophy

- **Dark foundation**: The interface lives in near-black (`#1e1e22`) to signal technical depth and reduce eye strain during long reconciliation sessions
- **Layered surfaces**: Three levels of background (`bg`, `bg1`, `bg2`) create subtle depth without heavy shadows
- **Minimal borders**: Borders use dark grays (`#333339` to `#4a4a52`) that separate without shouting
- **Warm text**: Cream (`#f4efe6`) instead of pure white softens the technical aesthetic and reduces harshness
- **Single accent**: Green (`#11B67A`) is reserved exclusively for success states, CTAs, and the brand itself — never decorative

### Semantic Usage

- **Green**: Matched records, verified data, primary actions. The color of "this is correct."
- **Red** (`#E5534B`): Mismatches, discrepancies, errors. Used sparingly.
- **Yellow** (`#D4A72C`): Review states, pending items, warnings.
- **Text hierarchy**: `t1` (cream) for primary content, `t2` (warm gray) for secondary, `t3` (muted) for metadata

### Atmospheric Effects

The hero section uses a **subtle radial gradient** (`rgba(17, 182, 122, 0.05)`) to create a faint green glow at the top of the page — the only decorative element in the entire system. This "terminal glow" reinforces the technical aesthetic while drawing attention to the hero message.

## Typography

The type system uses **three distinct voices** to create hierarchy and signal intent:

### Playfair Display (Serif)

Used exclusively for **display text** — headlines, stats, pricing. The serif choice is deliberate: it signals authority and permanence in a space dominated by sans-serif SaaS products. The tight letter-spacing (`-0.02em` to `-0.03em`) and medium weight (500) keep it modern rather than traditional.

**Usage**: Hero headlines, section titles, large numbers (stats, pricing), CTA headlines

### DM Sans (Sans-serif)

The workhorse typeface for **all body content and UI elements**. Chosen for its neutral, slightly geometric feel and excellent legibility at small sizes. The light weight (300) for hero subheads creates contrast with the bold serif headlines.

**Usage**: Body copy, descriptions, labels, buttons, navigation

### JetBrains Mono (Monospace)

Reserved for **data, references, and technical metadata** — anything that came from a spreadsheet or database. This reinforces the "we handle your data" positioning and creates instant visual distinction for system-generated content.

**Usage**: Table data, reference IDs, amounts, status labels, proof lines

### Hierarchy Rules

1. **Display sizes are fluid** using `clamp()` to scale gracefully from mobile to desktop
2. **Line heights are tight** (1.12–1.2) for display text to create density and impact
3. **Body text is generous** (1.55–1.7) to maintain readability in long descriptions
4. **Letter-spacing is negative** on large serif text to create a modern, tight feel
5. **Uppercase labels** use increased letter-spacing (0.07em–0.1em) for legibility

## Layout & Spacing

The layout follows a **centered, single-column model** with a maximum width of 1080px. This creates focus and prevents the dark background from feeling overwhelming on large screens.

### Spacing Philosophy

- **8px base grid**: All spacing derives from multiples of 8
- **Generous vertical rhythm**: Sections use 72px padding to create clear separation
- **Tight card gaps**: 14px between cards keeps related content grouped
- **Asymmetric padding**: Hero section uses 130px top padding to account for fixed nav

### Responsive Strategy

The design is **mobile-first but desktop-optimized**. Breakpoints collapse multi-column grids to single columns rather than trying to maintain complex layouts on small screens.

**Key breakpoints**:
- 1080px: Tighten horizontal spacing
- 860px: Collapse 2-column layouts, hide engine tabs
- 720px: All grids become single column
- 480px: Reduce padding, full-width buttons
- 360px: Smallest phone optimization

## Elevation & Depth

Depth is created through **layered surfaces and subtle borders** rather than heavy shadows. This maintains the dark, technical aesthetic while providing clear visual hierarchy.

### Surface Layers

1. **Base** (`bg`): The canvas — near-black with subtle texture from the radial gradient
2. **Elevated** (`bg1`): Cards, engine window, pricing cards — one step lighter
3. **Chrome** (`bg2`): Window chrome, nav on scroll — highest contrast against base

### Border Strategy

Every elevated surface has a **1px border** in a slightly lighter gray. This creates definition without the "floating card" look common in light-themed designs. Borders get progressively lighter on hover (`b0` → `b1` → `b2`) to signal interactivity.

### Shadow Usage

Shadows are **extremely subtle** and used only for:
- **Engine window**: Soft shadow to lift it from the page
- **Card hover**: Gentle shadow on transform to reinforce the lift
- **Tooltips**: Stronger shadow for true elevation above all content

## Shapes

The shape language is **minimal and functional** with two border radius values:

- **12px (DEFAULT)**: Buttons, smaller UI elements
- **16px (lg)**: Cards, engine window, all major containers

This creates a **soft but not playful** aesthetic — rounded enough to feel modern and approachable, sharp enough to signal professionalism.

### Icon Treatment

Icons use **rounded line caps** (from Lucide) at 20px for card icons and 12-15px for inline icons. The stroke weight matches the border weights (1-2px) to maintain visual consistency.

## Components

### Buttons

**Primary CTA**: Green background, white text, 8px radius. Hover state darkens the green, adds a green glow shadow, and lifts 1px. This is the only element that uses transform on hover.

**Outline variant**: Transparent background, gray border, muted text. Hover fills with `bg2` and brightens text. Used for secondary actions in pricing cards.

**Large variant**: 14px text, 13px vertical padding, 10px radius. Used for hero CTA and section CTAs.

### Cards

All cards follow the **elevated surface pattern**: `bg1` background, `b1` border, 16px radius, 28px padding. Hover state:
- Border color shifts to `b2`
- Transforms up 2px
- Adds soft shadow

**Variations**:
- **Suite/Step cards**: Standard pattern with icon container at top
- **Pricing cards**: Standard pattern with structured content hierarchy
- **Chart cards**: Standard pattern with 24px padding for denser content

### Engine Window

The **hero demo component** mimics a macOS window:
- **Chrome bar**: 44px height, `bg2` background, macOS traffic light dots
- **Live indicator**: 6px green dot with glow and pulse animation
- **Tabs**: Inline tabs with hover states, active tab uses `b1` background
- **Table**: Uppercase headers, monospace data, status pills
- **Footer**: Monospace metadata showing match counts

This component is the **visual anchor** of the page — it demonstrates the product in action and reinforces the technical positioning.

### Tables

Tables use **minimal styling** to feel like raw data:
- Headers: 11px uppercase, tracked out, muted color
- Cells: 13px, monospace for data columns, sans-serif for labels
- Borders: Only horizontal borders between rows
- Hover: Extremely subtle background tint

### Status Pills

Small rounded pills (999px radius) with:
- Subtle background tint
- 1px border
- 6px colored dot indicator
- 12px text

Colors map to semantic states (green = matched, red = mismatch, yellow = review).

### Stats Band

Large serif numbers (`2rem`) over small sans-serif labels, separated by vertical borders. The grid collapses to 2 columns on tablet and mobile, with the third stat spanning full width.

### Navigation

**Fixed nav** that starts transparent and gains a frosted glass effect on scroll:
- Transparent → `rgba(30, 30, 34, 0.92)` with 18px blur
- Border fades in on scroll
- 56px height maintains consistent spacing

## Motion

Motion is **minimal and purposeful** — only used to provide feedback, never decoration.

### Timing

- **Fast** (180ms): Button hovers, color changes
- **Standard** (300ms): Card hovers, border color shifts, nav scroll state
- **Slow** (550ms): Fade-on-scroll animations for content sections

### Easing

All transitions use **ease-in-out** for natural, non-mechanical movement.

### Animations

1. **Fade on scroll**: Content sections fade in with slight upward movement (14px) when entering viewport. Staggered delays (0.04s–0.09s) create a cascading effect.

2. **Engine demo**: Automated cycle through tabs with:
   - Row highlight on mismatch detection
   - Status change animation (scale + opacity)
   - Tab fade transition (220ms)

3. **Live pip**: Subtle pulse animation (2.4s) on the green indicator dot

4. **Button lift**: 1px transform on hover with shadow

### Principles

- **No spinners or loaders** — the product is instant
- **No page transitions** — single-page design
- **No decorative animations** — motion only for feedback
- **Respect reduced motion** — all animations should be optional

## Accessibility

### Color Contrast

All text meets **WCAG AA standards**:
- Primary text (`t1` on `bg`): 13.8:1
- Secondary text (`t2` on `bg`): 6.2:1
- Tertiary text (`t3` on `bg`): 4.1:1
- Green on dark: 4.8:1 (large text only)

### Typography

- **Minimum body size**: 13px (used sparingly for card descriptions)
- **Standard body size**: 15px
- **Line height**: Never below 1.4 for body text
- **Max line length**: 520-540px for optimal readability

### Interaction

- **Touch targets**: Minimum 44px height for all interactive elements
- **Focus states**: Should follow hover states (not explicitly styled in current implementation)
- **Keyboard navigation**: All interactive elements should be keyboard accessible

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- Semantic sectioning elements
- Alt text for all images (icon library handles this)

## Design Principles

1. **Say what you replace, not what you enable**: Every section frames features as "the work your juniors do today"

2. **No superlatives**: Avoid "cutting-edge," "revolutionary," "world-class" — let the product speak

3. **Founder-direct voice**: Write like someone who watched the problem firsthand, not someone who read a Gartner report

4. **Technical aesthetic**: Dark, precise, functional — this is infrastructure, not a consumer app

5. **Single accent color**: Green is earned, not decorative — it only appears for success states and primary actions

6. **Serif for authority**: Display text uses serif to signal permanence and seriousness in a sans-serif world

7. **Monospace for data**: Anything from a spreadsheet gets monospace treatment

8. **Generous whitespace**: Let the dark background breathe — never crowd elements

9. **Minimal motion**: Animation only for feedback, never decoration

10. **Mobile-first, desktop-optimized**: The product is used by accountants at desks, but the site should work everywhere
