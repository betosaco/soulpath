# Database Seeding Scripts

This directory contains scripts for seeding the database with initial data.

## Available Scripts

### Admin User Seeding

#### `seed-admin-user.js`
Creates or updates the primary admin user for MatMax Yoga Studio.

**Usage:**
```bash
# Using npm script (recommended)
npm run db:seed:admin

# Or directly
node scripts/seed-admin-user.js
```

**Admin Credentials:**
- **Email:** `admin@matmax.store`
- **Password:** `matmax2025`
- **Role:** `admin`
- **Phone:** `+51987654321`

#### `update-admin-password.js`
Updates the password for an existing admin user.

**Usage:**
```bash
node scripts/update-admin-password.js
```

## Features

- **Upsert Logic:** Creates new admin user or updates existing one
- **Password Hashing:** Uses bcrypt with salt rounds of 12
- **Data Validation:** Ensures all required fields are present
- **Error Handling:** Comprehensive error logging and graceful failures
- **Database Safety:** Proper connection management and cleanup

## Database Schema

The admin user is created with the following fields:
- `email`: Unique identifier (admin@matmax.store)
- `password`: Hashed password (matmax2025)
- `fullName`: Display name (MatMax Admin)
- `role`: User role (admin)
- `phone`: Contact number (+51987654321)
- `status`: Account status (active)
- `language`: Preferred language (en)
- `adminNotes`: Administrative notes

## Security Notes

- Passwords are hashed using bcrypt with 12 salt rounds
- Email addresses are stored in lowercase
- Admin users have full system access
- Scripts include proper error handling and logging

## Troubleshooting

If you encounter issues:

1. **Database Connection:** Ensure your database is running and accessible
2. **Environment Variables:** Check that `DATABASE_URL` is properly set
3. **Permissions:** Ensure the database user has CREATE/UPDATE permissions
4. **Dependencies:** Run `npm install` to ensure all packages are installed

## Related Commands

```bash
# Check database connection
npm run db:studio

# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Run full database seed
npm run db:seed
```
