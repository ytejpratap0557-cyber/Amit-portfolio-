# Amit Nagvanshi portfolio + Supabase backend

## 1. Database
Supabase Dashboard > SQL Editor > paste `supabase/schema.sql` > Run.

## 2. First admin
1. Authentication > Users > Add user (email + password, auto-confirm).
2. Authentication > Sign In / Providers > turn **off** "Allow new users to sign up".
3. SQL Editor: `insert into public.admin_users (user_id) select id from auth.users where email = 'YOUR_EMAIL';`

## 3. Env vars (`.env.local`, already filled for this project; template in `.env.local.example`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the publishable key; safe in browser because RLS protects data)
- `NEXT_PUBLIC_SITE_URL`
No service-role key is used anywhere.

## 4. Run
    npm install && npm run dev
Public site: http://localhost:3000  ·  Admin: http://localhost:3000/admin

## 5. Deploy (Vercel)
Add the 3 env vars, deploy, then add your domain under Supabase > Authentication > URL Configuration.

## Admin panel (v2)
1. Run `supabase/schema.sql`, then `supabase/schema_v2.sql` (it also makes `amitportfolio@gmail.com` an admin).
2. Supabase > Authentication > URL Configuration: add `http://localhost:3000/admin/callback` and `https://YOUR-DOMAIN/admin/callback` to Redirect URLs (needed for "Forgot password").
3. Sign in at `/admin/login` → `/admin/dashboard`.
