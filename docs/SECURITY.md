# LOGIFORGE Security & Isolation Architecture

## 1. Overview

LOGIFORGE is engineered with a defensive security posture. As an interactive design studio hosting sandboxed website templates and simulated logistics tracking engines, the platform enforces isolation between the host shell and template runtimes.

---

## 2. Content Security Policy (CSP) & HTTP Headers

LOGIFORGE configures security headers via `async headers()` in [`next.config.ts`](../next.config.ts):

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'
```

### Configured Controls
1. **Script Execution & `'unsafe-eval'` Policy:** In production builds, `'unsafe-eval'` is disabled (`process.env.NODE_ENV === 'development'` conditional check). Static chunk inspection confirms zero occurrences of `eval()` or `new Function()`. Note that `'unsafe-inline'` is retained in `script-src` and `style-src` to support Next.js framework hydration scripts and scoped CSS module runtime requirements.
2. **`frame-ancestors 'self'` & `X-Frame-Options: SAMEORIGIN`:** Configured to prevent unauthorized external websites from embedding LOGIFORGE pages in third-party iframes.
3. **`X-Content-Type-Options: nosniff`:** Prevents browser MIME-type sniffing.
4. **`Referrer-Policy: strict-origin-when-cross-origin`:** Restricts sensitive referrer information from escaping to external origins.
5. **`Permissions-Policy`:** Explicitly restricts browser hardware features: `camera=(), microphone=(), geolocation=(), interest-cohort=()`.
6. **Strict-Transport-Security (HSTS):** `max-age=63072000; includeSubDomains; preload` enforces HTTPS transport across all connections.

---

## 3. Bidirectional `postMessage` Origin Validation

The Demo Studio host shell (`/demo/[slug]`) communicates with embedded templates (`/demo/[slug]/embed`) via HTML5 `postMessage`.

### Host Shell Validation (`src/app/demo/[slug]/page.tsx`)
```typescript
const handleMessage = (e: MessageEvent) => {
  if (e.origin !== window.location.origin) return;
  if (!iframeRef.current || e.source !== iframeRef.current.contentWindow) return;
  // Handle typed event
};
```
- Messages from foreign origins are rejected immediately.
- Messages not originating from the active iframe's `contentWindow` are rejected.

### Embedded Template Validation (`src/components/templates/dispatcher/TemplateRenderer.tsx`)
```typescript
window.parent.postMessage(
  { type: 'TEMPLATE_MOUNTED', templateSlug: template.slug },
  window.location.origin // Explicitly targets own origin
);
```
- Runtime event dispatches explicitly target `window.location.origin`.

---

## 4. Recursive Frame-Busting Guard

To prevent recursive embedding of the Demo Studio shell inside another iframe, [`src/app/demo/[slug]/page.tsx`](../src/app/demo/[slug]/page.tsx) executes a top-window check:

```typescript
if (typeof window !== 'undefined' && window.top !== window.self) {
  window.location.replace(`/demo/${slug}/embed`);
}
```

If the parent shell is framed, it automatically redirects to the clean, isolated embed view.

---

## 5. Privacy, Telemetry & Dependencies

- **Local Simulated Operations:** All waybill tracking, telemetry visualizers, and route calculators operate locally using typed deterministic fixtures with no third-party API dependencies.
- **No Third-Party Trackers:** LOGIFORGE does not load external analytics, pixels, or telemetry scripts in the client bundle.
- **Zero Environment Secrets at Runtime:** The frontend deployment requires zero server-side environment secrets or API credentials.

---

## 6. Reporting a Vulnerability

If you discover a security issue or vulnerability within LOGIFORGE, please do not open a public GitHub issue. Instead, report it privately via GitHub Security Advisories on the repository:

- **Repository Security Advisories:** `https://github.com/Vijay07012006/LOGIFORGE/security/advisories`
