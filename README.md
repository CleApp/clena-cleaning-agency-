# CLENA Cleaning Agency: setup (about 15 minutes)

Files: index.html (site), admin.html (staff dashboard), schema.sql, supabase/functions/notify-booking/index.ts

## 1. Database
Supabase > SQL Editor > paste schema.sql > Run.

## 2. Staff logins
Authentication > Providers > Email: turn OFF "Allow new users to sign up".
Authentication > Users > Add user (create your staff accounts here, tick "Auto confirm").
This matters: any signed-in user can read bookings.

## 3. Keys
Settings > API: copy Project URL and the anon public key.
Paste both at the top of the script in index.html AND admin.html (never use the service_role key in these files).

## 4. Email alerts (optional)
1. Create a free account at resend.com and an API key.
2. Install the Supabase CLI, then in this folder:
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase secrets set RESEND_API_KEY=re_xxx NOTIFY_EMAIL=you@yourdomain.com
   supabase functions deploy notify-booking
3. Dashboard > Database > Webhooks > Create: table bookings, event Insert,
   type "Supabase Edge Functions", function notify-booking.
(With Resend's free test sender you can only email your own Resend account address. Verify a domain to send from CLENA.)

## 5. Go live
Drag this folder onto app.netlify.com/drop (or use Vercel / Cloudflare Pages).
Site: your-url/   Dashboard: your-url/admin.html
