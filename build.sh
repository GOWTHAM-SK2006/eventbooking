#!/bin/bash
set -e

echo "=== 1. Building Next.js 15 Frontend ==="
cd frontend
npm install --legacy-peer-deps
npm run build

echo "=== 2. Preparing Spring Boot static assets directory ==="
mkdir -p ../src/main/resources/static
rm -rf ../src/main/resources/static/*

echo "=== 3. Copying static files to Spring Boot static resources ==="
cp -r out/* ../src/main/resources/static/

cd ..
echo "=== 4. Packaging fullstack Spring Boot Application ==="
mvn clean package -DskipTests

echo "=== BUILD COMPLETE! Unified Jar is ready in target/ ==="
