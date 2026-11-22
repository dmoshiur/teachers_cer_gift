# Teacher Tribute Studio

A tribute creator for Class VIII. The public gallery renders the four supplied A4 designs; organizers can manage teacher records, photos, message settings and browser-based print jobs.

> **Status: work in progress, not yet production-ready.** The full requested specification and acceptance checklist are not complete. See [Known gaps](#known-gaps) before deploying.

## Run locally

Requires Node.js 20.11 or later.

```sh
npm install
npm run dev
```

Open <http://localhost:3000>. The dev script creates `local.db`, applies the committed SQL migration, and seeds three sample teachers and role presets if the tables are empty. **For local development only**, if no password hash is configured, the login password is `tribute2026`. This fallback is disabled in production. `local.db` is ignored by Git.

```sh
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

The Playwright tests create and reset a separate ignored `playwright.db` and use the Chromium binary supplied by the test dependency. They include one-page PDF count checks for each design with short, long and Bangla names; page count alone does not establish that text is unclipped or visually faithful. On Linux the tests need `tar` and standard Chromium system libraries.

## Set up Turso

1. Install the [Turso CLI](https://docs.turso.tech/cli/installation), sign in, and create a database:

   ```sh
   turso auth login
   turso db create teacher-tribute
   turso db show teacher-tribute --url
   turso db tokens create teacher-tribute
   ```

2. Copy the example environment file and edit it:

   ```sh
   cp .env.example .env.local
   npm run hash-password -- 'choose-a-long-unique-password'
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

   Paste the database URL and token into `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`. Paste the generated hash into `ADMIN_PASSWORD_HASH` and the random string into `SESSION_SECRET` (at least 32 characters). Set `NEXT_PUBLIC_SITE_URL` to your site's URL. Keep all secrets private; never commit `.env.local`.

3. Apply the migration and optionally seed demo records. These scripts read `.env.local`:

   ```sh
   npm run db:migrate
   npm run db:seed
   ```

   Seeding adds three demo teachers only when there are no teachers, and preset roles only when there are no presets. Skip the seed if you don't want demo teachers; the app works with an empty database.

## Vercel deployment (after completing the known gaps)

1. Import this GitHub repository into Vercel as a Next.js project.
2. Add `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL` in the project's environment settings. Use the same values for the environment you deploy. Run `npm run db:migrate` against that Turso database before logging in.
3. Optionally create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN`. The upload route stores cropped WebP images there. Without a token it stores the compressed image as a data URL in the database. Blob images are public URLs; do not upload sensitive images without considering that visibility.
4. Choose a Vercel region close to the Turso database, then deploy. **Never use `file:local.db` on Vercel:** the serverless filesystem is not durable.

## Using the studio

- Sign in with the password used to generate the hash. You can change it under **Settings**; other sessions will be invalidated.
- Add a teacher, choose a design, and optionally upload a JPEG, PNG, or WebP under 5 MB. Crop, zoom and rotate before saving; the generated WebP is limited to 150 KB.
- Reorder teachers with the drag handle, or use the keyboard: focus the handle, press Space, use the arrow keys, then press Space again. Search and filter the list, select teachers for bulk template changes or deletion, or print selected/visible teachers.
- Edit tribute text, class details, organizers, role presets and template defaults under **Settings**. The settings are used in the admin previews and print output. Backup and restore are also available there; restore replaces teachers, roles and tribute settings but not passwords.
- In the print dialog select teachers, paper size, margins, copies and ink options. In the browser print window enable **Background graphics**, choose the same paper size, portrait, and no browser margins. Select **Save as PDF** as the destination to save a PDF.

## Template implementation

The attached HTML/SVG artwork was extracted into JSON files with scoped CSS in `src/templates`, and is rendered by the registry in `src/templates/registry.tsx`. The reference PNGs are in `public/previews`. The referenced font files were not present in the attachment, so Poppins, Lora and Hind Siliguri are installed from Fontsource. To add a design, extract its HTML and scoped CSS, add it under `src/templates`, and register it in `registry.tsx`. The extraction helper `scripts/convert-templates.mjs` references the original attachment location and is not required at runtime. The current fixed template ID union and settings validator must also be extended for another design.

## Known gaps

This is **not a complete implementation of the original production specification**. Among the remaining gaps:

- The full popup catalogue, command palette, onboarding, complete unsaved-change guard, admin EN/Bangla translation, dark mode, and dedicated admin URLs are not implemented. Some confirmations still use the browser's native dialog.
- Server-generated PDF and `/api/admin/pdf` are not implemented; saving a PDF uses the browser print dialog. Cross-browser print behavior, actual non-A4 paper rendering, and light-ink output still need physical verification. The automated PDF test checks page count, not clipping or screenshot fidelity.
- The template port uses original markup/SVG inside React components rather than a complete hand-converted JSX port. Not every piece of static template copy is editable, organizer count is fixed at eight, and default public gallery previews use sample defaults rather than database settings. Original font files were not supplied.
- Photo validation checks the compressed WebP header and size, but does not fully decode the file server-side or scan uploads. Orphaned Blob objects are not automatically removed.
- Security needs a production review and hardening, including a nonce-based CSP (the present policy permits inline styles and scripts), rate-limit/IP trust policy, sliding session renewal, and validation of all infrastructure configuration at boot. Audit coverage is partial. No formal accessibility, Lighthouse, or screenshot-regression audit has been completed.
- The optional public teacher gallery, Open Graph image generation, complete shadcn/Radix UI, Prettier setup, and some requested data-model and migration tooling are not implemented.

Do not use this for sensitive data or a public production deployment until these items have been completed and independently reviewed.
