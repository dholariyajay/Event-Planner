# Start the Event Planner frontend with mock data

# Create mock API directory if it doesn't exist
if (-not (Test-Path -Path "mock-api")) {
    New-Item -ItemType Directory -Path "mock-api"
}

# Install json-server if not already installed
Write-Host "Installing json-server..." -ForegroundColor Green
npm install -g json-server

# Start json-server with mock data
Write-Host "Starting mock API server..." -ForegroundColor Green
Start-Process -FilePath "json-server" -ArgumentList "--watch mock-api/db.json --port 5000 --routes mock-api/routes.json" -NoNewWindow

# Navigate to frontend directory
Set-Location -Path "frontend"

# Install dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Green
npm install

# Start the frontend application
Write-Host "Starting frontend application..." -ForegroundColor Green
npm start
