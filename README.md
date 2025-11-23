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

- `DATABASE_PATH` - Path to the SQLite database file (default: `./development.sqlite3`)
- `NODE_ENV` - Environment mode (development/production)

## Deployment Notes

### For Linux Server Deployment

1. Ensure Docker and Docker Compose are installed on your server
2. Clone the repository
3. Place your `development.sqlite3` file in the project root
4. Run `docker-compose up -d`
5. Configure your reverse proxy (nginx/Apache) to forward traffic to port 3000

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

- The current implementation uses a default user_id (1) for all operations
- For production use, implement proper authentication and authorization
- Consider adding input validation and sanitization
- Add environment-based configuration for sensitive data

## License

MIT