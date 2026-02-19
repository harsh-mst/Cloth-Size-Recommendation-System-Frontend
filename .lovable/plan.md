
## Clothing Size Recommender — Bold UI Redesign

### Overall Look & Feel
- **Bold & Colorful** design with a vibrant gradient hero section (deep purple to hot pink or electric blue to coral)
- Strong typography, high contrast, modern card-based layout
- Fully responsive — works great on mobile and desktop

---

### Page Layout

**Header / Hero**
- App title with a punchy tagline like *"Find Your Perfect Fit"*
- A colorful gradient background strip with a subtle fashion-inspired pattern

---

### Main Form Card
A centered card with a two-column layout on desktop:

**Left side — Input Form:**
- **Unit Toggle** at the top: switch between `cm / kg` and `inches / lbs` — animated pill toggle
- **Height** input with a clear label and placeholder
- **Weight** input with a clear label and placeholder
- **Chest size** — clickable button group (XS / S / M / L / XL) instead of a plain dropdown
- **Waist size** — same button group style
- A bold, colorful **"Get My Size"** CTA button

**Right side — Body Silhouette Illustration:**
- A simple SVG body/clothing silhouette
- Measurement lines with labels pointing to height, chest, and waist areas to guide the user visually

---

### Animated Result Card
After submitting, a result card animates in (scale + fade) below the form showing:
- **Recommended size** displayed large and bold (e.g., "Your Size: **M**")
- A short explanation (e.g., "Based on your height and weight, Medium is your best fit")
- A colored badge/chip per size (green for exact match, yellow for between sizes)

---

### Visual Size Chart Section
Below the form, a styled table showing the full size chart (XS → XXL) with:
- Height range, Weight range, Chest, and Waist columns
- The user's recommended size row highlighted in the brand accent color
- Collapsible/expandable on mobile

---

### Footer
Simple, clean footer with a tagline and optional brand name placeholder.
