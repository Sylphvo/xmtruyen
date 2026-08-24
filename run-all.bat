@echo off
setlocal EnableDelayedExpansion
TITLE XomTruyen System Manager

echo =======================================================
echo        STARTING XOMTRUYEN SYSTEM SERVICES
echo =======================================================
echo.

:: Xóa nội dung file log cũ (nếu có) để chuẩn bị cho lần chạy mới
break > api.log
break > client.log
break > admin.log
break > history.log

echo [1/4] Building XomTruyen.API (chi build 1 lan, khong compile lai moi lan start)...
cd xomtruyen.API
dotnet build -c Release --nologo -v q > ..\api.log 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Build that bai! Xem api.log de biet chi tiet.
    pause
    exit /b 1
)
echo [1/4] Build thanh cong!
cd ..
echo Starting [XomTruyen.API] on port 5172...
start /B cmd /c "cd xomtruyen.API && dotnet run -c Release --no-build >> ..\api.log 2>&1"

echo Starting [XomTruyen Client] on port 3000...
start /B cmd /c "cd xom-truyen && npm run dev -- --port 3000 > ..\client.log 2>&1"

echo Starting [XomTruyen Admin] on port 3001...
start /B cmd /c "cd xomtruyen-admin && npm run dev -- --port 3001 > ..\admin.log 2>&1"

echo Starting [XomTruyen History] on port 5555...
start /B cmd /c "cd xomtruyen-overview && node server.js > ..\history.log 2>&1"

set "LAST_STATE="

:dashboard_loop

:: ================================================================
:: CHECK API  --  parse log de tinh phan tram startup
:: ================================================================
set "API_STATUS=STARTING "
set "API_PID="
set "API_CPU=  -  "
set "API_PCT=  0%%"

for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5172 " ^| findstr "LISTENING"') do set "API_PID=%%a"
if defined API_PID (
    set "API_STATUS=RUNNING  "
    set "API_PCT=100%%"
    for /f "tokens=2" %%c in ('wmic process where "ProcessId=!API_PID!" get PercentProcessorTime /value 2^>nul ^| findstr "="') do set "API_CPU=%%c%%"
) else (
    :: Milestone 1 - dotnet restore / build bat dau
    findstr /i /C:"Determining projects to restore" api.log >nul 2>&1
    if !errorlevel! equ 0 set "API_PCT= 10%%"

    :: Milestone 2 - restore xong
    findstr /i /C:"Restored " api.log >nul 2>&1
    if !errorlevel! equ 0 set "API_PCT= 25%%"

    :: Milestone 3 - build thanh cong
    findstr /i /C:"Build succeeded" api.log >nul 2>&1
    if !errorlevel! equ 0 set "API_PCT= 50%%"

    :: Milestone 4 - app dang khoi dong
    findstr /i /C:"Application starting" api.log >nul 2>&1
    if !errorlevel! equ 0 set "API_PCT= 65%%"

    :: Milestone 5 - EF / DB migration
    findstr /i /C:"Applying pending" api.log >nul 2>&1
    if !errorlevel! equ 0 set "API_PCT= 75%%"

    :: Milestone 6 - Hosting environment
    findstr /i /C:"Hosting environment" api.log >nul 2>&1
    if !errorlevel! equ 0 set "API_PCT= 85%%"

    :: Milestone 7 - Now listening (sap xong)
    findstr /i /C:"Now listening on" api.log >nul 2>&1
    if !errorlevel! equ 0 set "API_PCT= 95%%"

    :: Kiem tra loi
    findstr /C:"Build FAILED" api.log >nul 2>&1
    if !errorlevel! equ 0 (
        set "API_STATUS=ERROR    "
        set "API_PCT=FAIL"
    )
    findstr /i /C:"Unhandled exception" api.log >nul 2>&1
    if !errorlevel! equ 0 (
        set "API_STATUS=ERROR    "
        set "API_PCT=FAIL"
    )
)

:: ================================================================
:: CHECK CLIENT
:: ================================================================
set "CLIENT_STATUS=STARTING "
set "CLIENT_PID="
set "CLIENT_CPU=  -  "
set "CLIENT_PCT=  0%%"

for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') do set "CLIENT_PID=%%a"
if defined CLIENT_PID (
    set "CLIENT_STATUS=RUNNING  "
    set "CLIENT_PCT=100%%"
    for /f "tokens=2" %%c in ('wmic process where "ProcessId=!CLIENT_PID!" get PercentProcessorTime /value 2^>nul ^| findstr "="') do set "CLIENT_CPU=%%c%%"
) else (
    findstr /i /C:"vite" client.log >nul 2>&1
    if !errorlevel! equ 0 set "CLIENT_PCT= 50%%"
    findstr /i /C:"ready in" client.log >nul 2>&1
    if !errorlevel! equ 0 set "CLIENT_PCT= 90%%"
    findstr /i /C:"failed to load config" client.log >nul 2>&1
    if !errorlevel! equ 0 (
        set "CLIENT_STATUS=ERROR    "
        set "CLIENT_PCT=FAIL"
    )
)

:: ================================================================
:: CHECK ADMIN
:: ================================================================
set "ADMIN_STATUS=STARTING "
set "ADMIN_PID="
set "ADMIN_CPU=  -  "
set "ADMIN_PCT=  0%%"

for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3001 " ^| findstr "LISTENING"') do set "ADMIN_PID=%%a"
if defined ADMIN_PID (
    set "ADMIN_STATUS=RUNNING  "
    set "ADMIN_PCT=100%%"
    for /f "tokens=2" %%c in ('wmic process where "ProcessId=!ADMIN_PID!" get PercentProcessorTime /value 2^>nul ^| findstr "="') do set "ADMIN_CPU=%%c%%"
) else (
    findstr /i /C:"vite" admin.log >nul 2>&1
    if !errorlevel! equ 0 set "ADMIN_PCT= 50%%"
    findstr /i /C:"ready in" admin.log >nul 2>&1
    if !errorlevel! equ 0 set "ADMIN_PCT= 90%%"
    findstr /i /C:"failed to load config" admin.log >nul 2>&1
    if !errorlevel! equ 0 (
        set "ADMIN_STATUS=ERROR    "
        set "ADMIN_PCT=FAIL"
    )
)

:: ================================================================
:: CHECK HISTORY
:: ================================================================
set "HISTORY_STATUS=STARTING "
set "HISTORY_PID="
set "HISTORY_CPU=  -  "
set "HISTORY_PCT=  0%%"

for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5555 " ^| findstr "LISTENING"') do set "HISTORY_PID=%%a"
if defined HISTORY_PID (
    set "HISTORY_STATUS=RUNNING  "
    set "HISTORY_PCT=100%%"
    for /f "tokens=2" %%c in ('wmic process where "ProcessId=!HISTORY_PID!" get PercentProcessorTime /value 2^>nul ^| findstr "="') do set "HISTORY_CPU=%%c%%"
) else (
    findstr /i /C:"listening" history.log >nul 2>&1
    if !errorlevel! equ 0 set "HISTORY_PCT= 80%%"
    findstr /i /C:"error" history.log >nul 2>&1
    if !errorlevel! equ 0 (
        set "HISTORY_STATUS=ERROR    "
        set "HISTORY_PCT=FAIL"
    )
)

:: ================================================================
:: Render dashboard - chi update khi co thay doi
:: ================================================================
set "CURRENT_STATE=!API_STATUS!!API_PCT!!CLIENT_STATUS!!CLIENT_PCT!!ADMIN_STATUS!!ADMIN_PCT!!HISTORY_STATUS!!HISTORY_PCT!"

if "!CURRENT_STATE!" neq "!LAST_STATE!" (
    set "LAST_STATE=!CURRENT_STATE!"
    CLS
    echo ================================================================
    echo         XOMTRUYEN SYSTEM DASHBOARD  ^(Live Sync^)
    echo ================================================================
    echo.
    echo +----------------------+-------+-----------+-------+----------+
    echo ^| Name                 ^| Port  ^| Status    ^| Start ^| CPU %%    ^|
    echo +----------------------+-------+-----------+-------+----------+
    echo ^| XomTruyen.API        ^| 5172  ^| !API_STATUS!^| !API_PCT!  ^| !API_CPU!    ^|
    echo ^| XomTruyen Client     ^| 3000  ^| !CLIENT_STATUS!^| !CLIENT_PCT!  ^| !CLIENT_CPU!    ^|
    echo ^| XomTruyen Admin      ^| 3001  ^| !ADMIN_STATUS!^| !ADMIN_PCT!  ^| !ADMIN_CPU!    ^|
    echo ^| XomTruyen History    ^| 5555  ^| !HISTORY_STATUS!^| !HISTORY_PCT!  ^| !HISTORY_CPU!    ^|
    echo +----------------------+-------+-----------+-------+----------+
    echo.
    echo  Milestone API: 0%% Bat dau ^> 10%% Restore ^> 25%% Nuget ^> 50%% Build
    echo                ^> 65%% App init ^> 75%% DB ^> 85%% Host ^> 95%% Listen ^> 100%% RUNNING
    echo.
    echo [LOGS] Log dang duoc ghi live vao: api.log, client.log, admin.log, history.log
    echo [STOP] De DUNG tat ca cac services, chi can TAT CUA SO NAY ^(bam dau X^).
    echo.
    echo He thong dang theo doi ngam. Man hinh se CHi CAP NHAT khi co thay doi...
)

timeout /t 2 /nobreak >nul
goto dashboard_loop
