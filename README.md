# sendspoods

A fun, whimsical place for people to share photos of their glorious spiders ("spoods"). This is the preview version of **sendspoods.com**: a single page (`index.html`) with no build step.

## How it works

The page is a single file, `index.html`, with no build step. Submissions, photos and boops are stored in the **Urban Exposed** Supabase project, kept separate from Urban Exposed's own data:

- Photos go in the private **`spoods`** storage bucket (Urban Exposed uses `locations` and `Favorites for Showcase`).
- Submissions live in the **`spood_submissions`** table, and boops in **`spood_boops`**.
- The public can only submit spoods, see approved spoods and their photos, and boop them. The rules are in `supabase/migrations/`.

Until at least one spood is approved, the gallery shows the cartoon example spoods.

## Approving spoods

New submissions are hidden until you approve them.

1. Open the [Supabase dashboard](https://supabase.com/dashboard) → the **Urban Exposed** project → **Table Editor** → **spood_submissions**.
2. To see the photo, go to **Storage** → **spoods** → **uploads** and open the file named in the row's `photo_path`.
3. Change the row's `status` from `pending` to `approved` (or `rejected`) and save. It appears on the site on the next page load.
4. Optional: fill in `featured_story` with a fun line. It's shown if that spood becomes Spood of the Day.

## Sender collections

Senders can add an optional name (like `@mothqueen`) when they send a spood. It's saved in the `sender_handle` column, and each approved spood's card links to that sender's page at `collection.html?by=<name>`. `collection.html` on its own lists every named sender. There are no accounts, so anyone can type any name; check it when approving, and edit or clear `sender_handle` in the Table Editor if needed.

## Identifying spiders

When checking a submission's species before approving it:

- [BugGuide](https://bugguide.net/node/view/1954) (Iowa State University): photo guide for US and Canadian spiders.
- [iNaturalist](https://www.inaturalist.org/pages/arachnids): community IDs from a photo, worldwide. Many spiders can only be identified to genus or family from a photo.
- [World Spider Catalog](https://wsc.nmbe.ch/) (Natural History Museum of Bern): the reference for correct, current scientific names.

## Boops and Spood of the Day

- Each boop is saved. One visitor can give a spood at most 30 boops a day.
- Spood of the Day is the approved spood with the most boops in the last 24 hours (ties go to the most boops overall).

## Spood Mail

Email sign-ups land in the **`spood_subscribers`** table (Supabase → Table Editor). The public can only add their own email; nobody can read the list from the site. To send a newsletter, export the table as CSV and import it into an email service (for example Buttondown or Mailchimp), which also handles unsubscribes.

## Shop

The shop is still a preview: the cart only counts items and doesn't take payment.

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

- The shop can link to a print-on-demand service such as Printful or Shopify for real orders.
