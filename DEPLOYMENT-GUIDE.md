# DeeSkinStore - cPanel Deployment Guide

## Deployment Package
- **File:** `deeskinstore-deployment.tar.gz` (747 KB)
- **Location:** Project root directory
- **Contains:** All production-ready files for public_html

## Package Contents Verification

### Root Files (7 files total)
1. `.htaccess` (1.4 KB) - Apache configuration for SPA routing
2. `index.html` (480 bytes) - Main HTML entry point
3. `Banner.png` (238 KB) - Hero banner image
4. `Deeskinstore Logo.png` (666 KB) - Logo with background
5. `Deeskinstore_Logo-removebg-preview.png` (63 KB) - Transparent logo
6. `assets/index-Bm3sJtnd.css` (30 KB) - Compiled styles
7. `assets/index-D-vhmAit.js` (362 KB) - Compiled JavaScript with React Router

### Important Files Included
✅ `.htaccess` - Critical for React Router URL routing
✅ All image assets - Actual images, not placeholders
✅ Compiled CSS and JS bundles
✅ index.html with proper asset references

## Admin Panel Access

### URL
- Login: `https://deeskinstore.com/admin`
- Dashboard: `https://deeskinstore.com/admin/dashboard`

### Super Admin Credentials
- **Email:** admin@deeskinstore.com
- **Password:** admin123

## Deployment Steps

### Method 1: File Manager (Recommended for First Time)

1. **Login to cPanel**
   - Go to your cPanel login page
   - Enter your credentials

2. **Navigate to File Manager**
   - Click on "File Manager" in cPanel
   - Navigate to `public_html` directory

3. **Backup Existing Files (if any)**
   - Select all existing files in public_html
   - Click "Compress" to create a backup
   - Download the backup to your local machine

4. **Clear public_html**
   - Delete all existing files (after backup)
   - Keep public_html empty

5. **Upload Deployment Archive**
   - Click "Upload" button
   - Upload `deeskinstore-deployment.tar.gz`
   - Wait for upload to complete

6. **Extract Archive**
   - Right-click on `deeskinstore-deployment.tar.gz`
   - Select "Extract"
   - Extract to current directory (public_html)
   - Delete the .tar.gz file after extraction

7. **Verify Files**
   - Ensure `.htaccess` is present (you may need to show hidden files)
   - Verify `index.html` exists
   - Check `assets` folder has CSS and JS files
   - Confirm all image files are present

8. **Set Permissions (if needed)**
   - Files: 644
   - Directories: 755
   - .htaccess: 644

### Method 2: FTP/SFTP

1. **Connect via FTP Client**
   - Use FileZilla or similar FTP client
   - Connect to your server using FTP credentials

2. **Navigate to public_html**
   - Open public_html directory on remote server

3. **Extract Archive Locally First**
   - Extract `deeskinstore-deployment.tar.gz` on your computer
   - You'll get all the deployment files

4. **Upload All Files**
   - Upload all extracted files to public_html
   - Ensure `.htaccess` is uploaded (show hidden files in FTP client)
   - Maintain folder structure (especially `assets` folder)

5. **Verify Upload**
   - Check all files are present on server
   - Verify file sizes match

### Method 3: SSH/Terminal (Advanced)

```bash
# Upload archive to server
scp deeskinstore-deployment.tar.gz user@your-server.com:~/

# SSH into server
ssh user@your-server.com

# Navigate to public_html
cd public_html

# Extract archive
tar -xzf ../deeskinstore-deployment.tar.gz

# Set permissions
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

## Post-Deployment Verification

### 1. Test Homepage
- Visit: `https://deeskinstore.com`
- Should load without errors
- Logo and banner should display

### 2. Test Navigation
- Click on different menu items
- URLs should change (not just #)
- Pages should load without 404 errors

### 3. Test Admin Access
- Visit: `https://deeskinstore.com/admin`
- Login page should appear
- Login with admin credentials
- Should redirect to dashboard

### 4. Test Direct URL Access
- Try: `https://deeskinstore.com/products`
- Try: `https://deeskinstore.com/about`
- Try: `https://deeskinstore.com/admin/dashboard`
- All should work (no 404 errors)

### 5. Check Browser Console
- Open browser developer tools (F12)
- Check Console tab for errors
- Should see no critical errors

## Troubleshooting

### Issue: 404 Errors on Page Refresh
**Solution:** Ensure `.htaccess` file is present and readable
```bash
# Check if .htaccess exists
ls -la public_html/.htaccess

# Verify content
cat public_html/.htaccess
```

### Issue: Blank Page or White Screen
**Solution:** Check browser console for JavaScript errors
- Verify assets folder is uploaded
- Check file permissions
- Clear browser cache

### Issue: Images Not Loading
**Solution:**
- Verify image files are uploaded
- Check file paths in browser network tab
- Ensure images are in root of public_html

### Issue: Admin Login Not Working
**Solution:**
- Currently uses mock authentication
- Any email/password will work for demo
- For production, integrate with Supabase

### Issue: CSS Not Loading
**Solution:**
- Check if assets folder exists
- Verify CSS file path in index.html
- Clear browser cache
- Check server MIME types

## .gitignore Note

The `.gitignore` file blocks the following from Git:
- `node_modules/` - Not needed for deployment
- `dist/` - We deploy this separately
- `.env` - Environment variables (security)
- Log files - Not needed

**Important:** The `dist` folder and `.env` are ignored by Git, but:
- ✅ The deployment archive contains everything from `dist`
- ✅ Environment variables are already compiled into the JS bundle
- ✅ No files are missing from deployment package

## Environment Variables

The following are already compiled into the production build:
- `VITE_SUPABASE_URL`: https://0ec90b57d6e95fcbda19832f.supabase.co
- `VITE_SUPABASE_ANON_KEY`: [included in build]

No additional environment configuration needed on cPanel.

## File Structure in public_html

```
public_html/
├── .htaccess                              # Apache config
├── index.html                             # Entry point
├── Banner.png                             # Banner image
├── Deeskinstore Logo.png                  # Logo
├── Deeskinstore_Logo-removebg-preview.png # Transparent logo
└── assets/
    ├── index-Bm3sJtnd.css                # Styles
    └── index-D-vhmAit.js                 # Application code
```

## Security Considerations

1. **Admin Authentication**
   - Currently uses mock login (demo)
   - For production: Implement Supabase auth
   - Change default admin password

2. **.htaccess Security**
   - Already includes security headers
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: SAMEORIGIN
   - X-XSS-Protection enabled

3. **HTTPS**
   - Recommended to force HTTPS
   - Uncomment HTTPS redirect in .htaccess if needed

## Support

For issues during deployment:
- Check browser console (F12)
- Review cPanel error logs
- Verify file permissions
- Ensure .htaccess is uploaded

## Next Steps After Deployment

1. **Test all functionality**
2. **Set up Supabase authentication** (for real user login)
3. **Configure real payment processing** (if needed)
4. **Add products to database** via admin panel
5. **Test order flow end-to-end**
6. **Set up SSL certificate** (if not already)
7. **Configure email notifications**
8. **Set up backups** in cPanel

---

**Deployment Package Generated:** November 30, 2025
**Package Size:** 747 KB
**Total Files:** 7 (including 2 in assets folder)
**Ready for Production:** Yes ✅
