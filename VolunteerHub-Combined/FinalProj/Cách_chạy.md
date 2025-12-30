# HUONG DAN CHAY DU AN VOLUNTEER HUB

## BUOC 1: CAI DAT MOI TRUONG

### 1.1 Cai dat Docker Desktop
- Tai va cai dat Docker Desktop tu https://www.docker.com/products/docker-desktop
- Khoi dong Docker Desktop va dam bao dang chay

### 1.2 Cai dat Node.js
- Tai va cai dat Node.js phien ban 18 hoac cao hon tu https://nodejs.org
- Kiem tra cai dat thanh cong bang lenh:
```
node --version
npm --version
```

### 1.3 Cai dat Java
- Cai dat Java JDK 21 tu https://www.oracle.com/java/technologies/downloads/
- Kiem tra cai dat thanh cong bang lenh:
```
java --version
```

## BUOC 2: CHAY DOCKER CONTAINERS

### 2.1 Khoi dong PostgreSQL Database
```
cd project_setup/database
docker-compose up -d
```
Kiem tra container chay thanh cong:
```
docker ps
```

### 2.2 Khoi dong Redis
```
cd project_setup/redis
docker-compose up -d
```

### 2.3 Khoi dong MinIO Object Storage
```
cd project_setup/object_store
docker-compose up -d
```

## BUOC 3: KHOI TAO DATABASE

### 3.1 Ket noi vao PostgreSQL container
```
docker exec -it database-postgresql-1 psql -U admin -d volunteerhub
```

### 3.2 Chay file SQL khoi tao
Trong terminal PostgreSQL, chay cac lenh:
```sql
\i /docker-entrypoint-initdb.d/V1.sql
```

Hoac restore tu backup:
```
docker exec -i database-postgresql-1 psql -U admin -d volunteerhub < full_backup.sql
```

### 3.3 Kiem tra database
```sql
\dt
SELECT * FROM user_auth;
\q
```

## BUOC 4: CHAY BACKEND

### 4.1 Di chuyen vao thu muc backend
```
cd backend
```

### 4.2 Khoi dong Spring Boot application
Tren Windows:
```
.\gradlew.bat bootRun
```

Tren Linux/Mac:
```
./gradlew bootRun
```

Backend se chay tren cong 8080. Kiem tra:
- GraphQL endpoint: http://localhost:8080/graphql
- GraphiQL interface: http://localhost:8080/graphiql

## BUOC 5: CHAY FRONTEND

### 5.1 Mo terminal moi, di chuyen vao thu muc frontend
```
cd frontend
```

### 5.2 Cai dat dependencies
```
npm install
```

### 5.3 Khoi dong development server
```
npm run dev
```

Frontend se chay tren cong 5173.

## BUOC 6: TRUY CAP UNG DUNG

### 6.1 Mo trinh duyet va truy cap
```
http://localhost:5173
```

### 6.2 Tai khoan mac dinh

Admin:
- Email: admin@volunteerhub.com
- Password: password

Event Manager:
- Email: manager@charity.com
- Password: password

Volunteer User:
- Email: minh@volunteer.com
- Password: password

## BUOC 7: KIEM TRA SERVICES

### 7.1 Kiem tra tat ca containers
```
docker ps
```

Can thay 3 containers dang chay:
- database-postgresql-1 (port 5431)
- redis (port 6379)
- minio (port 9000, 9001)

### 7.2 Kiem tra logs
Xem logs cua backend:
```
cd backend
.\gradlew.bat bootRun
```

Xem logs cua frontend:
```
cd frontend
npm run dev
```

## BUOC 8: Dừng UNG DUNG

### 8.1 Dừng frontend
Nhan Ctrl+C trong terminal frontend

### 8.2 Dừng backend
Nhan Ctrl+C trong terminal backend

### 8.3 Dừng Docker containers
```
cd project_setup/database
docker-compose down

cd project_setup/redis
docker-compose down

cd project_setup/object_store
docker-compose down
```

## XU LY LOI THUONG GAP

### Loi 1: Port da bi su dung
Neu port 8080, 5173, 5431, 6379 hoac 9000 da duoc su dung:
- Tim va dung tien trinh dang su dung port
- Hoac thay doi port trong file config

### Loi 2: Docker khong chay
- Dam bao Docker Desktop dang chay
- Khoi dong lai Docker Desktop

### Loi 3: Ket noi database that bai
- Kiem tra container PostgreSQL dang chay
- Kiem tra thong tin ket noi trong application.yml
  - Host: localhost
  - Port: 5431
  - Database: volunteerhub
  - Username: admin
  - Password: admin123

### Loi 4: Frontend khong ket noi backend
- Dam bao backend dang chay tren port 8080
- Kiem tra file frontend/src/api/graphqlClient.js
- URL nen la: http://localhost:8080/graphql

### Loi 5: Loi 500 khi dang ky user moi
- Restart backend sau khi update code SignupService.java
- Dam bao UserProfileRepository duoc inject vao SignupService

## CAU TRUC DU AN

```
FinalProj/
├── backend/                  Spring Boot backend
│   ├── src/
│   ├── build.gradle
│   └── gradlew.bat
├── frontend/                 React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── project_setup/
│   ├── database/             PostgreSQL setup
│   ├── redis/                Redis setup
│   └── object_store/         MinIO setup
└── full_backup.sql           Database backup

```

## THONG TIN PORTS

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- GraphQL Endpoint: http://localhost:8080/graphql
- GraphiQL: http://localhost:8080/graphiql
- PostgreSQL: localhost:5431
- Redis: localhost:6379
- MinIO Console: http://localhost:9001
- MinIO API: http://localhost:9000

## LENH HUU ICH

### Backup database
```
docker exec -t database-postgresql-1 pg_dump -U admin -d volunteerhub --clean --if-exists > full_backup.sql
```

### Restore database
```
docker exec -i database-postgresql-1 psql -U admin -d volunteerhub < full_backup.sql
```

### Xem logs container
```
docker logs database-postgresql-1
docker logs redis
docker logs minio
```

### Xoa du lieu va bat dau lai
```
docker-compose down -v
docker-compose up -d
```

### Build backend
```
cd backend
.\gradlew.bat build
```

### Build frontend cho production
```
cd frontend
npm run build
```

## GHI CHU

- Luon chay backend truoc khi chay frontend
- Dam bao tat ca Docker containers dang chay truoc khi chay backend
- Sau khi thay doi code backend, restart backend
- Sau khi thay doi code frontend, Vite se tu dong reload
- GraphiQL co san tai http://localhost:8080/graphiql de test GraphQL queries
