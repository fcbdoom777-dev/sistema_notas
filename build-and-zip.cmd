@echo off
REM build-and-zip.cmd - Builds the project and creates dist.zip for Netlify drag-and-drop

echo Checking for .env.local...
if not exist .env.local (
  echo ERROR: .env.local not found. Create it with the following variables:
  echo VITE_SUPABASE_URL=https://your-project.supabase.co
  echo VITE_SUPABASE_ANON_KEY=your_anon_key_here
  echo SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here (optional, only for local function tests)
  exit /b 1
)

echo Installing dependencies (this may take a while)...
npm install || (echo npm install failed & exit /b 1)

echo Running build...
npm run build || (echo build failed & exit /b 1)

echo Creating dist.zip...
powershell -Command "Compress-Archive -Path dist -DestinationPath dist.zip -Force" || (echo Compress-Archive failed & exit /b 1)

echo Done. Generated %CD%\dist.zip
exit /b 0
