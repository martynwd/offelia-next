# Offelia Store - Next.js E-commerce Application

A Next.js application for managing and displaying products and categories from a SQLite database.

## Features

- Browse products by category
- Dynamic category pages showing all products
- Full admin dashboard for managing:
  - Categories (Create, Read, Update, Delete)
  - Products (Create, Read, Update, Delete)
- Responsive design with Tailwind CSS
- SQLite database integration
- Docker support for easy deployment

## Database Schema

The application uses SQLite with the following tables:
- **categories**: Store product categories with menu display options
- **products**: Store products with price, description, availability, and category relationships
- **users**: User management (basic structure included)

## Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose (for containerized deployment)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Deployment

### Build and Run with Docker Compose

1. Build and start the container:
```bash
docker-compose up -d
```

2. The application will be available at [http://localhost:3000](http://localhost:3000)

3. To stop the container:
```bash
docker-compose down
```

### Build Docker Image Manually

```bash
docker build -t offelia-next .
docker run -p 3000:3000 -v $(pwd)/development.sqlite3:/app/data/development.sqlite3 offelia-next
```

## Application Structure

- `/` - Homepage with all categories
- `/categories/[id]` - Category page showing all products in that category
- `/admin` - Admin dashboard for managing categories and products
- `/admin/categories/new` - Add new category
- `/admin/categories/[id]/edit` - Edit existing category
- `/admin/categories/[id]/delete` - Delete category
- `/admin/products/new` - Add new product
- `/admin/products/[id]/edit` - Edit existing product
- `/admin/products/[id]/delete` - Delete product

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<generate using script below>

# Database
DATABASE_PATH=./development.sqlite3
NODE_ENV=production
```

### Admin Authentication Setup

This application uses bcrypt password hashing for secure authentication.

1. Generate a password hash:
   ```bash
   node scripts/generate-password-hash.js YourSecurePassword123
   ```

2. Copy the generated hash to your `.env` file as `ADMIN_PASSWORD_HASH`

3. Access admin panel at `/admin/login`

**Security Features:**
- Bcrypt password hashing (never store plain-text passwords)
- Rate limiting (5 attempts per IP, 1-hour lockout)
- 24-hour session expiration
- Secure cookie settings

For detailed security documentation, see [SECURITY.md](./SECURITY.md)

## Deployment Notes

### For Linux Server Deployment

1. Ensure Docker and Docker Compose are installed on your server
2. Clone the repository
3. Generate admin password hash:
   ```bash
   node scripts/generate-password-hash.js YourProductionPassword
   ```
4. Create `.env` file with generated hash
5. Place your `development.sqlite3` file in the project root
6. Run `docker-compose up -d --build`
7. Configure your reverse proxy (nginx/Apache) to forward traffic to port 3000

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Containerization**: Docker

## Security Notes

### Implemented Security Features ✅
- **Bcrypt password hashing** - Passwords are never stored in plain text
- **Rate limiting** - 5 failed login attempts trigger 1-hour IP lockout
- **Session management** - 24-hour automatic session expiration
- **Secure cookies** - HttpOnly, SameSite, and Secure (in production) flags
- **Generic error messages** - Prevents username enumeration attacks

### Recommendations for Production
- Use HTTPS (configure SSL/TLS on your reverse proxy)
- Set proper file permissions on `.env` file (`chmod 600 .env`)
- Change default admin username
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Regularly update dependencies
- Monitor server logs for suspicious activity
- Consider implementing:
  - Two-factor authentication (2FA)
  - CSRF token validation
  - Input validation and sanitization
  - Audit logging for admin actions

**Note:** The application uses a default user_id (1) for database operations. This is acceptable for single-admin deployments.

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## License

MIT