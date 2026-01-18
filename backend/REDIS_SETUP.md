# Redis Setup Guide for Windows

The Scalable Backend is designed to use **Redis** for caching, but it is **optionally resilient** (it runs even if Redis is missing).

To enable High-Performance Caching (50x faster auth), you need to install Redis manually.

## Option 1: Memurai (Recommended for Windows)
**Memurai** is the most compatible Redis alternative for Windows Developers.
1. Download Memurai Developer Edition: [https://www.memurai.com/get-memurai](https://www.memurai.com/get-memurai)
2. Install the `.msi` package.
3. It runs automatically as a Windows Service.
4. **Done!** The backend will auto-connect on next restart.

## Option 2: Docker (Best for Production)
If you install Docker Desktop:
```bash
docker run --name redis -p 6379:6379 -d redis
```

## Option 3: WSL2 (Linux Subsystem)
If you have WSL installed:
```bash
sudo apt-get install redis-server
sudo service redis-server start
```

## Configuring the Backend
Ensure your `backend/.env` has the correct settings (Defaults work for localhost):
```ini
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```
