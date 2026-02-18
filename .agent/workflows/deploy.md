---
description: How to deploy SubScouter to Cloudflare Pages
---

# Deploying SubScouter

Follow these steps to deploy the Sovereign Titan architecture.

1. Ensure `wrangler.toml` has the correct `database_id`.
2. Push your latest changes to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deploy"
   git push origin main
   ```
3. In Cloudflare Pages, set the Build Command to `npx @cloudflare/next-on-pages@1`.
4. Set the Compatibility Flag to `nodejs_compat`.
5. Add your Secrets (Stripe, Gemini, Auth) in the Pages Dashboard.
6. Initialize the D1 database:
   ```bash
   npx wrangler d1 execute subscouter-db --remote --file=./migrations/0000_initial.sql
   ```
