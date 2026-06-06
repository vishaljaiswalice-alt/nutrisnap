# NutriSnap — Cal AI Killer 🔥

AI-powered calorie tracker. Snap food → get macros. Better than Cal AI in every way.

## Features vs Cal AI

| Feature | Cal AI | NutriSnap |
|---|---|---|
| AI photo scan | ✅ | ✅ |
| Onboarding + BMR calc | ✅ | ✅ Better |
| Dark mode | ✅ | ✅ Full OLED dark |
| Macro tracking | ✅ | ✅ + Fiber |
| Water tracker | ❌ | ✅ |
| AI Chat Coach | ❌ | ✅ Knows your log |
| Weekly insights | basic | ✅ Personalized |
| Indian food presets | ❌ | ✅ Dal, Roti, Idli... |
| Streak tracking | ✅ | ✅ |
| Photo in log | ❌ | ✅ |
| Paywall | 💰 | FREE |

## Deploy in 5 minutes

### 1. Get Anthropic API key
https://console.anthropic.com → API Keys → Create

### 2. Push to GitHub
```bash
git init && git add . && git commit -m "init"
# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_NAME/nutrisnap.git
git push -u origin main
```

### 3. Deploy to Vercel
- vercel.com → Add New Project → import repo → Deploy

### 4. Add environment variable
Vercel dashboard → Settings → Environment Variables:
- Name: `ANTHROPIC_API_KEY`
- Value: `sk-ant-...`
- Tick all environments → Save → Redeploy

## Files
```
nutritrack-pro/
├── public/index.html   ← Full app (onboarding + dashboard)
├── api/
│   ├── analyse.js      ← Food photo AI (secure)
│   └── coach.js        ← Chat coach AI (secure)
└── vercel.json
```
