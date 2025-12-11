# 🗄️ Database Setup Guide

## Quick Setup with Docker (Recommended)

### 1. Start PostgreSQL
```bash
cd backend/project_setup/database
docker-compose up -d
```

This will:
- Start PostgreSQL on port **5431**
- Create database: `volunteerhub`
- Username: `admin`
- Password: `admin123`
- Auto-run initialization scripts

### 2. Start Redis
```bash
cd backend/project_setup/redis
docker-compose up -d
```

This will:
- Start Redis on port **6379**
- No password required

### 3. Start MinIO (Object Storage - Optional)
```bash
cd backend/project_setup/object_store
docker-compose up -d
```

### Check Services Status
```bash
# Check running containers
docker ps

# Expected output:
# - volunteerhub-postgres
# - volunteerhub-redis
# - volunteerhub-minio (if started)
```

## Manual Setup (Without Docker)

### PostgreSQL Setup

#### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install and set password
3. Open pgAdmin or psql
4. Create database:
```sql
CREATE DATABASE volunteerhub;
CREATE USER admin WITH PASSWORD 'admin123';
GRANT ALL PRIVILEGES ON DATABASE volunteerhub TO admin;
```
5. Configure to run on port **5431** (default is 5432)
   - Edit `postgresql.conf`: `port = 5431`
   - Restart PostgreSQL service

#### Linux
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE volunteerhub;
CREATE USER admin WITH PASSWORD 'admin123';
GRANT ALL PRIVILEGES ON DATABASE volunteerhub TO admin;
\q

# Configure port (edit postgresql.conf)
sudo nano /etc/postgresql/*/main/postgresql.conf
# Change: port = 5431

# Restart
sudo systemctl restart postgresql
```

#### macOS
```bash
# Install via Homebrew
brew install postgresql

# Start service
brew services start postgresql

# Create database
psql postgres
CREATE DATABASE volunteerhub;
CREATE USER admin WITH PASSWORD 'admin123';
GRANT ALL PRIVILEGES ON DATABASE volunteerhub TO admin;
\q

# Configure port
# Edit: /usr/local/var/postgres/postgresql.conf
# Change: port = 5431

# Restart
brew services restart postgresql
```

### Redis Setup

#### Windows
1. Download Redis from https://github.com/microsoftarchive/redis/releases
2. Extract and run `redis-server.exe`
3. Default port 6379 is correct

Or use WSL:
```bash
sudo apt install redis-server
sudo service redis-server start
```

#### Linux
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis

# Test
redis-cli ping
# Should return: PONG
```

#### macOS
```bash
brew install redis
brew services start redis

# Test
redis-cli ping
# Should return: PONG
```

## Verify Connection

### PostgreSQL
```bash
# Using psql
psql -h localhost -p 5431 -U admin -d volunteerhub
# Password: admin123

# Using telnet
telnet localhost 5431
```

### Redis
```bash
redis-cli -h localhost -p 6379 ping
# Expected: PONG
```

## Connection Strings

### application.yml (Backend)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5431/volunteerhub
    username: admin
    password: admin123
  data:
    redis:
      host: localhost
      port: 6379
```

## Database Schema

The schema is automatically created by Spring Boot JPA when the application starts:
- `ddl-auto: update` in `application.yml`
- Entities are located in `backend/src/main/java/com/volunteerhub/*/model/`

### Manual Schema Setup (Optional)
SQL files are available in `backend/project_setup/database/`:
- `V1.sql` - Main schema
- `user_auth.sql`
- `user_profiles.sql`
- `events.sql`
- `event_registration.sql`
- `role_in_event.sql`
- `comments.sql`
- `likes.sql`

## Troubleshooting

### PostgreSQL Port Already in Use
```bash
# Find process using port 5431
# Windows
netstat -ano | findstr :5431

# Linux/Mac
lsof -i :5431

# Kill the process or change port in application.yml
```

### Redis Connection Refused
```bash
# Check if Redis is running
# Windows
Get-Service -Name *redis*

# Linux/Mac
sudo systemctl status redis

# Start if not running
sudo systemctl start redis
```

### Docker Issues
```bash
# Reset containers
cd backend/project_setup/database
docker-compose down
docker-compose up -d

# View logs
docker-compose logs -f

# Remove volumes and restart
docker-compose down -v
docker-compose up -d
```

## Backup & Restore

### PostgreSQL Backup
```bash
# Backup
pg_dump -h localhost -p 5431 -U admin volunteerhub > backup.sql

# Restore
psql -h localhost -p 5431 -U admin volunteerhub < backup.sql
```

### Redis Backup
```bash
# Redis auto-saves to dump.rdb
# Location: /var/lib/redis/dump.rdb (Linux)
#          C:\Program Files\Redis\dump.rdb (Windows)

# Manual save
redis-cli SAVE
```

## Stop Services

### Docker
```bash
# Stop all
cd backend/project_setup
docker-compose -f database/docker-compose.yaml down
docker-compose -f redis/docker-compose.yaml down

# Or stop all containers
docker stop $(docker ps -q)
```

### Manual
```bash
# PostgreSQL
# Windows
Stop-Service postgresql*

# Linux
sudo systemctl stop postgresql

# Redis
# Windows
Stop-Service redis*

# Linux
sudo systemctl stop redis
```

---

**Quick Reference:**
- PostgreSQL: `localhost:5431` / `admin` / `admin123`
- Redis: `localhost:6379` / no password
- Database: `volunteerhub`
