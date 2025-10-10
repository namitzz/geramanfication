# Deployment Guide

## GitHub Pages Setup

To enable GitHub Pages deployment for this project:

1. **Enable GitHub Pages in Repository Settings**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Build and deployment":
     - Source: Select "GitHub Actions"

2. **Trigger Deployment**
   - The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`
   - Push to the `main` branch or merge this PR to trigger deployment
   - The workflow will:
     - Install dependencies
     - Run linter
     - Run tests
     - Build the application
     - Deploy to GitHub Pages

3. **Access Your App**
   - After successful deployment, your app will be available at:
   - `https://namitzz.github.io/geramanfication/`

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# The output will be in the 'dist' folder
# Deploy the 'dist' folder to any static hosting service
```

### Supported Hosting Platforms
- GitHub Pages (recommended, configured)
- Vercel
- Netlify
- Cloudflare Pages
- Any static file hosting

## Environment Configuration

The app is configured with:
- Base URL: `/geramanfication/` (for GitHub Pages)
- This is set in `vite.config.ts`

If deploying to a different platform or root domain:
1. Update `base` in `vite.config.ts`
2. Update `basename` in `src/App.tsx`

## PWA Considerations

After deployment:
- Users can install the app on their devices
- The service worker will cache assets for offline use
- Updates will be automatically detected and applied

## Troubleshooting

### If deployment fails:
1. Check GitHub Actions logs
2. Ensure all tests pass locally: `npm run test`
3. Ensure build succeeds locally: `npm run build`
4. Check that GitHub Pages is enabled in repository settings

### If app doesn't load:
1. Verify the base URL matches your deployment path
2. Check browser console for errors
3. Clear browser cache and service worker

## Post-Deployment Checklist

- [ ] App loads correctly at the GitHub Pages URL
- [ ] Navigation works between all pages
- [ ] Flashcards can be flipped
- [ ] Quiz modes work correctly
- [ ] Settings persist after page reload
- [ ] PWA can be installed on mobile/desktop
- [ ] Dark mode toggle works
- [ ] Text-to-speech works (requires HTTPS)
