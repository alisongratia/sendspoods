# sendspoods

A fun, whimsical place for people to share photos of their glorious spiders ("spoods"). This is the preview version of **sendspoods.com**: a single page (`index.html`) with no build step.

## What works right now

- Gallery with filters and "boop" buttons
- Spood of the Day and Hall of Legs
- Merch shop preview (the cart only counts items and doesn't take payment)
- Adding a photo shows it in the gallery **on your own screen only**. Nothing is saved or sent anywhere yet.

## Putting it live (one-time setup)

1. On GitHub, open this repo → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**, pick **main** and **/ (root)**, then **Save**.
3. After a minute or two the site is live at `https://alisongratia.github.io/sendspoods/`.

Any change pushed to `main` goes live automatically.

## Using the sendspoods.com domain

After buying `sendspoods.com` from a domain seller:

1. In **Settings → Pages → Custom domain**, enter `sendspoods.com` and save.
2. At your domain seller, add these DNS records:
   - Four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing to `alisongratia.github.io`
3. Once GitHub confirms the domain, tick **Enforce HTTPS**.

## Later

- Saving submitted photos (and approving them before they appear) needs a storage service such as Supabase.
- The shop can link to a print-on-demand service such as Printful or Shopify for real orders.
