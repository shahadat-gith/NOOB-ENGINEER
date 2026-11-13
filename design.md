# Noob Engineer — Design Guide

Rules only. Follow this for every UI change.

## Brand and copy

- Motif: noob → skilled engineer. Copy is simple, encouraging, and about fundamentals and practice.
- No fabricated testimonials, pricing, mentors, placements, counts or social proof.
- A headline and its description must agree. Quote only the brand name.

## Theme

- Light is the default; dark is set on `[data-theme="dark"]` and persisted as `ne-theme`.
- Use the tokens defined in `@theme` in `Client/src/index.css` — brand `#EA5B2A`, background `#F7F7F5`, surface `#FFFFFF`, dark brand `#FF6B3D`. Never hardcode colours, shadows or radii.
- Text is softened (`#2F2F2F` in light), never pure black.

## Typography

- Body and UI: Plus Jakarta Sans (`font-sans`).
- Display headlines only: Space Grotesk (`font-heading`), tight leading and negative tracking.
- No third font family.

## Styling

- Tailwind CSS v4 only. No `App.css`, no Vite proxy.
- Boxicons only (`bx bx-*`); no inline SVG icons.
- Buttons are rectangular with `rounded-button`, never pill-shaped. Pointer cursor globally.
- Focus uses the 4px `brand-soft` ring; icon-only controls need an `aria-label`.

## Cards

- `bg-surface` + `rounded-card` + `shadow-card`, no border.
- No gradients or inset edge highlights in either theme.
- Hover lifts 4px and deepens to `shadow-card-hover`, without adding a border.
- Inner visuals may use a faint `border-border-secondary`.

## UI components

Use the primitives in `Client/src/components/ui/` directly. Do not add wrapper components around them.

- `Card`, `Button`, `IconButton`, `Input`, `Switch`, `Alert`, `Avatar`, `Toast`, `Divider`, `CodeBlock`.
- Code samples use `CodeBlock`; its syntax colours come from the theme tokens, so never add a third-party highlighter theme stylesheet.
- Toast state lives in `context/ToastContext.jsx` and `context/toastContext.js` (`useToast`); the provider is mounted at the app root.
- Form errors are inline `Alert`s, never toasts.
