# 🚀 Quick Deploy Reference - Achhadam

## तुरंत Deploy करने के लिए (Quick Deploy)

### Windows:
```bash
cd frontend
deploy.bat
```

### Linux/Mac:
```bash
cd frontend
chmod +x deploy.sh
./deploy.sh
```

### Manual:
```bash
cd frontend
rm -rf dist
npm run build
git add .
git commit -m "feat: Updated with cache fix"
git push
```

---

## ✅ Deployment Checklist

हर deployment से पहले check करें:

- [ ] `frontend/dist` folder clean है?
- [ ] `npm run build` successfully complete हुआ?
- [ ] Console में देखा: "Service Worker updated with cache version"?
- [ ] `dist/sw.js` में `__BUILD_TIMESTAMP__` नहीं दिख रहा?
- [ ] `dist/_headers` file exist करती है?

---

## 🔍 Quick Verification

### Build के बाद:
```bash
# Check SW was updated
cat dist/sw.js | grep "BUILD_TIMESTAMP"
# Should return NOTHING (timestamp should be replaced)

# Check _headers exists
ls dist/_headers
# Should exist
```

### Production पर:
1. Open https://achhadam.com
2. Open Console (F12)
3. Check for: `SW v[NEW_NUMBER]: Installing...`
4. No errors should appear

---

## 🐛 Quick Fixes

### Cache issue:
```
1. Incognito mode में test करें
2. Ctrl+Shift+Delete → Clear cache
3. Ctrl+Shift+R (Hard refresh)
```

### Build issue:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Still old website:
```
1. Render dashboard → Clear build cache
2. Manual deploy trigger करें
3. Wait 2-3 minutes
4. Hard refresh browser
```

---

## 📊 Success Indicators

✅ Build logs:
```
🔧 Injecting build timestamp: [NUMBER]
✅ Service Worker updated with cache version: achhadam-v[NUMBER]
✅ _headers file copied to dist/
```

✅ Browser console:
```
✅ SW: Registered successfully
🔧 SW v[NUMBER]: Installing...
✅ SW v[NUMBER]: Activated...
```

✅ No errors:
- No "Failed to execute 'addAll'"
- No "deferred DOM Node" errors
- No 404s for cached files

---

## 🎯 Expected Timeline

- **Build time:** 2-3 minutes
- **Deploy time:** 3-5 minutes on Render
- **Cache propagation:** Immediate (on hard refresh)
- **Auto update for users:** 30 minutes max

---

## 📞 Emergency Actions

अगर production में serious issue है:

1. **Rollback:**
   ```bash
   git revert HEAD
   git push
   ```

2. **Force clear all caches (User side):**
   - Share this with users:
   ```
   1. Press Ctrl+Shift+Delete
   2. Select "All time"
   3. Check "Cached images and files"
   4. Click "Clear data"
   5. Hard refresh (Ctrl+Shift+R)
   ```

3. **Disable Service Worker temporarily:**
   ```javascript
   // Add to index.html temporarily
   navigator.serviceWorker.getRegistrations().then(r =>
     r.forEach(reg => reg.unregister())
   );
   ```

---

## ✨ One-Line Commands

```bash
# Full clean deploy
cd frontend && rm -rf dist node_modules && npm install && npm run build

# Quick rebuild
cd frontend && rm -rf dist && npm run build

# Check if SW updated in dist
cat frontend/dist/sw.js | head -20

# Force git commit and deploy
git add . && git commit -m "fix: cache update" && git push
```

---

**Remember:**
- हर deployment के बाद users को एक बार hard refresh (Ctrl+F5) करना होगा
- पहली बार में update notification आएगी
- Old caches automatically clean हो जाएंगी

**Status:** ✅ Ready to Deploy
