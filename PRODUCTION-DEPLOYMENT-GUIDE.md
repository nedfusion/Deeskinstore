# DeeSkinStore - Production Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying DeeSkinStore to cPanel with a production-ready Supabase database.

## Super Admin Credentials
- **Email**: admin@deeskinstore.com
- **Password**: admin123
- **Role**: Super Administrator

## Pre-Deployment Checklist

### 1. Database Configuration
The database is already configured with:
- ✅ User authentication tables
- ✅ Admin authentication tables
- ✅ Products catalog with 8 seeded products
- ✅ Orders and order items tables
- ✅ Reviews system with approval workflow
- ✅ Row Level Security (RLS) policies
- ✅ Super admin account created

### 2. Environment Variables
Ensure the following environment variables are set in your production environment:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment to cPanel

### Step 1: Upload Files
1. Download the `deeskinstore-deployment.tar.gz` file from the project root
2. Log in to your cPanel account
3. Navigate to File Manager
4. Go to the public_html directory (or your desired deployment directory)
5. Upload the `deeskinstore-deployment.tar.gz` file
6. Extract the archive using the "Extract" option in cPanel File Manager

### Step 2: Verify Files
After extraction, ensure the following structure exists:
```
public_html/
├── .htaccess
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
├── Banner.png
├── Deeskinstore Logo.png
└── Deeskinstore_Logo-removebg-preview.png
```

### Step 3: Configure Environment Variables
The environment variables are already embedded in the build. No additional configuration needed.

### Step 4: Test the Deployment
1. Visit your domain in a web browser
2. Verify the homepage loads correctly
3. Test product listing on the Products page
4. Test admin login at `/admin`:
   - Email: admin@deeskinstore.com
   - Password: admin123

## Features Verified

### Product Management
- ✅ Products are loaded from Supabase database
- ✅ Admin can add, edit, and delete products
- ✅ Changes reflect immediately on user-facing pages
- ✅ Product deletion is soft-delete (sets is_active to false)

### Price Filtering
- ✅ Price range filter works from ₦0 to the highest product price
- ✅ Dynamic price slider adjusts based on available products
- ✅ Filter updates automatically when products are added/removed

### User Authentication
- ✅ Supabase email/password authentication
- ✅ User registration and login
- ✅ Session persistence
- ✅ Secure password storage

### Admin Authentication
- ✅ Separate admin authentication system
- ✅ Role-based access control (super_admin, admin, moderator)
- ✅ Password hashing with bcrypt
- ✅ Admin sessions persist in localStorage

### Database Security
- ✅ Row Level Security enabled on all tables
- ✅ Admins can only access data based on their role
- ✅ Users can only access their own data
- ✅ Public can view active products only

## Admin Panel Features

### Dashboard
- View total revenue, orders, and statistics
- Quick access to all management sections

### Product Management
- Add new products with details
- Edit existing products
- Soft-delete products (hides from users)
- View product inventory and status

### Order Management
- View all customer orders
- Update order status
- Track shipping information

### Review Management
- Approve or reject product reviews
- Delete inappropriate reviews
- Monitor customer feedback

### User Management (Super Admin only)
- View all customers
- Manage admin accounts
- Assign roles and permissions

## Database Schema

### Users Table
- User accounts from Supabase Auth
- Profile information (name, phone)
- Created/updated timestamps

### Admins Table
- Admin accounts with hashed passwords
- Role-based permissions
- Last login tracking

### Products Table
- Product catalog with details
- Stock management
- Active/inactive status
- Pricing and images

### Orders Table
- Customer orders
- Payment references (Paystack)
- Shipping addresses
- Order status tracking

### Order Items Table
- Individual items in orders
- Quantity and pricing snapshot
- Product references

### Reviews Table
- Customer product reviews
- Rating system (1-5 stars)
- Approval workflow
- User attribution

## Security Best Practices

1. **Password Security**
   - All passwords are hashed using bcrypt
   - No plain-text password storage

2. **Data Access**
   - RLS policies enforce data isolation
   - Admins have scoped access based on role
   - Public access is read-only for active products

3. **Environment Variables**
   - Supabase keys are embedded in build
   - Anon key is safe for client-side use
   - Service role key should never be exposed

4. **Input Validation**
   - All user inputs are validated
   - SQL injection prevention via Supabase client
   - XSS protection through React's built-in escaping

## Troubleshooting

### Products Not Loading
- Check browser console for errors
- Verify Supabase environment variables
- Ensure database tables are created
- Check RLS policies are properly configured

### Admin Login Fails
- Verify credentials: admin@deeskinstore.com / admin123
- Check browser console for errors
- Ensure `authenticate_admin` function exists in database

### 404 Errors on Page Refresh
- Verify .htaccess file is present
- Check Apache mod_rewrite is enabled
- Confirm .htaccess rewrite rules are correct

### Images Not Loading
- Ensure image files are uploaded to public_html
- Check image paths in database
- Verify file permissions (644 for files, 755 for directories)

## Maintenance

### Adding Products
1. Log in to admin panel
2. Navigate to Product Management
3. Click "Add Product"
4. Fill in product details
5. Save - product appears immediately on user pages

### Managing Orders
1. Log in to admin panel
2. Navigate to Order Management
3. View order details
4. Update status as orders are processed

### Reviewing Feedback
1. Log in to admin panel
2. Navigate to Review Management
3. Approve or reject reviews
4. Approved reviews appear on product pages

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check Supabase dashboard for database issues
4. Verify all files were extracted correctly

## Version Information
- React: 18.3.1
- Vite: 5.4.2
- Supabase: 2.57.4
- Tailwind CSS: 3.4.1
