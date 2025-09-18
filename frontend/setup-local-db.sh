#!/bin/bash

echo "🗄️ Setting up local PostgreSQL database for development..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first:"
    echo "   brew install postgresql"
    echo "   brew services start postgresql"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "🚀 Starting PostgreSQL service..."
    brew services start postgresql
    sleep 3
fi

# Create database
echo "📦 Creating wellness_db database..."
createdb wellness_db 2>/dev/null || echo "Database wellness_db already exists"

# Create user if it doesn't exist
echo "👤 Creating database user..."
psql -d wellness_db -c "CREATE USER IF NOT EXISTS user WITH PASSWORD 'password';" 2>/dev/null || echo "User already exists"

# Grant permissions
echo "🔑 Granting permissions..."
psql -d wellness_db -c "GRANT ALL PRIVILEGES ON DATABASE wellness_db TO user;"
psql -d wellness_db -c "ALTER USER user CREATEDB;"

echo "✅ Database setup complete!"
echo "📝 Database URL: postgresql://user:password@localhost:5432/wellness_db"
echo ""
echo "🌱 Next steps:"
echo "1. Run: npx prisma db push"
echo "2. Run: npx prisma db seed"
echo "3. Start the development server: npm run dev"
