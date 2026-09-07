# BandStack — Project Lock File

## DEPLOY TARGET — NEVER CHANGE
- Vercel project: `bandstack-template`
- Project ID: `prj_GRTtfQcnPDkvTYZFBLptbczVRrH6`
- Production URL: `https://bandstack-template.vercel.app`
- Deploy command: `vercel --prod` (from this directory)
- NEVER use `git push` to trigger deploys — always `vercel --prod`

## GITHUB REPO
- Remote: `https://github.com/RayburnMediaGroup/rmg-sandbox.git`
- Branch: `main`
- Push after every session: `git add ... && git commit && git push origin main`

## SUPABASE
- URL: `https://uhxqxdwxwogkyrhvegqh.supabase.co`
- All band data, auth, waitlist lives here
- Anon key in `.env.local` and hardcoded in `app/bandstack/[slug]/page.tsx`

## SESSION START CHECKLIST — RUN BEFORE ANY WORK
1. `cat .vercel/project.json` → must show `prj_GRTtfQcnPDkvTYZFBLptbczVRrH6`
2. `git remote -v` → must show `RayburnMediaGroup/rmg-sandbox.git`
3. Test URL: `https://bandstack-template.vercel.app`

## WHAT NO LONGER EXISTS
- `bandstack` Vercel project (rmg-sandbox.vercel.app) — DELETED
- `components/band/PinUnlock.tsx` — DELETED (replaced by Supabase auth)
- `lib/artistAuth.ts` — DELETED (replaced by Supabase auth)
