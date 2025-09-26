Design Tokens and Theming
=========================

Overview
--------
This project uses CSS custom properties as design tokens, organized as:
- styles/tokens/tokens-base.css: Base, semantic fallbacks for colors, spacing, radii, shadows, typography.
- styles/tokens/theme-*.css: Area-scoped themes that override base tokens.
  - theme-frontpage.css: Homepage and generic marketing pages.
  - theme-admin.css: Admin dashboard (dark shell).
  - theme-teacher.css: Teacher dashboard (gunmetal + almond).
  - theme-client.css: Client account area (light neutral).

How it works
------------
1) Base tokens define semantic variables like `--color-text-primary`, `--color-surface-primary` and bridge tokens used by Tailwind in `tailwind.config.ts` (e.g. `--background`, `--primary`).
2) Theme files override those tokens within a scoping class: `.frontpage-theme`, `.admin-theme`, `.teacher-theme`, `.client-theme`.
3) Layout components wrap their children with the appropriate theme class:
   - app/layout.tsx -> applies `frontpage-theme` on `<body>`
   - app/(admin)/layout.tsx -> wraps `AdminLayout` in a div with `admin-theme`
   - app/(teacher)/TeacherLayout.tsx -> container includes `teacher-theme`
   - app/(client)/layout.tsx -> wraps children in `client-theme`

Where tokens map to Tailwind
----------------------------
`tailwind.config.ts` maps Tailwind color keys to CSS variables, e.g.:
- colors.background -> `var(--background)`
- colors.primary.DEFAULT -> `var(--primary)`
Ensure theme files set these bridge tokens to keep Tailwind utilities in sync.

Adding a new theme
------------------
1) Create `styles/tokens/theme-NEW.css` with a `.new-theme` class overriding the semantic tokens and bridge tokens.
2) Import that file in `app/globals.css` under the token imports.
3) Wrap the target layout/container with `<div className="new-theme">` or add that class to the body.

Token completeness checklist
----------------------------
- Background: `--color-background-primary`, `--color-background-secondary`
- Surfaces: `--color-surface-primary`, `--color-surface-secondary`, `--color-surface-tertiary`
- Text: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-inverse`
- Primary: `--color-primary-500`, `--color-primary-600`, `--color-primary-700`
- Accent: `--color-accent-500`, `--color-accent-600`
- Border: `--color-border-500`, `--color-border-400`
- Status: `--color-status-success`, `--color-status-warning`, `--color-status-error`, `--color-status-info`
- Bridge tokens: `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`, `--radius`

Frontpage palette
-----------------
- Background beige: `#f4eeed`
- Text gray: `#383838`
- Primary green: `#6ea058`
- Accent orange: `#f4a556`

Admin palette
-------------
- Dark backgrounds: `#0a0a0a`, `#111827`, `#1f2937`
- Text: `#ffffff`, `#9ca3af`, `#6b7280`
- Primary action: `#6ea058`
- Gold accents: `#f59e0b`

Teacher palette
---------------
- Almond backgrounds: `#eae0d5`, `#e2d6c6`
- Text: black `#0a0908`, gunmetal `#22333b`, walnut `#5e503f`
- Primary: gunmetal `#22333b`
- Accent: khaki `#c6ac8f`

Client palette
--------------
- Light neutral surfaces: white, `#f8fafc`, `#f3f4f6`
- Text: slate family
- Primary: `#6ea058`
- Accent: purple `#8b5cf6`

Usage guidelines
----------------
- Favor Tailwind utilities that rely on the mapped variables (e.g., `bg-background`, `text-foreground`, `text-primary`, etc.).
- For custom CSS, reference the semantic variables: `color: var(--color-text-primary)`.
- Avoid hard-coded hex values in components; put them in theme files.

Troubleshooting
---------------
- If a color looks wrong in a themed area, verify the container has the correct theme class and that the theme file overrides the needed tokens.
- Ensure `app/globals.css` imports token files.


