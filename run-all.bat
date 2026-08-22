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

echo Starting [XomTruyen.API] on port 5172...
start /B cmd /c "cd xomtruyen.API && dotnet run > ..\api.log 2>&1"

echo Starting [XomTruyen Client] on port 3000...
start /B cmd /c "cd xom-truyen && npm run dev -- --port 3000 > ..\client.log 2>&1"

echo Starting [XomTruyen Admin] on port 3001...
start /B cmd /c "cd xomtruyen-admin && npm run dev -- --port 3001 > ..\admin.log 2>&1"

set "LAST_STATE="

:dashboard_loop

:: ---------------- CHECK API ----------------
set "API_STATUS=STARTING "
netstat -ano | findstr "5172" | findstr "LISTENING" >nul
if !errorlevel! equ 0 (
    set "API_STATUS=RUNNING  "
) else (
    findstr /C:"Build FAILED" api.log >nul
    if !errorlevel! equ 0 set "API_STATUS=ERROR    "
    findstr /i /C:"Unhandled exception" api.log >nul
    if !errorlevel! equ 0 set "API_STATUS=ERROR    "
)

:: ---------------- CHECK CLIENT ----------------
set "CLIENT_STATUS=STARTING "
netstat -ano | findstr "3000" | findstr "LISTENING" >nul
if !errorlevel! equ 0 (
    set "CLIENT_STATUS=RUNNING  "
) else (
    findstr /i /C:"error" client.log >nul
    if !errorlevel! equ 0 (
        findstr /i /C:"failed to load config" client.log >nul
        if !errorlevel! equ 0 set "CLIENT_STATUS=ERROR    "
    )
)

:: ---------------- CHECK ADMIN ----------------
set "ADMIN_STATUS=STARTING "
netstat -ano | findstr "3001" | findstr "LISTENING" >nul
if !errorlevel! equ 0 (
    set "ADMIN_STATUS=RUNNING  "
) else (
    findstr /i /C:"error" admin.log >nul
    if !errorlevel! equ 0 (
        findstr /i /C:"failed to load config" admin.log >nul
        if !errorlevel! equ 0 set "ADMIN_STATUS=ERROR    "
    )
)

:: Kiem tra xem trang thai hien tai co gi thay doi so voi lan truoc khong
set "CURRENT_STATE=!API_STATUS!!CLIENT_STATUS!!ADMIN_STATUS!"

if "!CURRENT_STATE!" neq "!LAST_STATE!" (
    set "LAST_STATE=!CURRENT_STATE!"
    CLS
    echo =======================================================
    echo        XOMTRUYEN SYSTEM DASHBOARD ^(Live Sync^)
    echo =======================================================
    echo.
    echo =======================================================
    echo ^| Name                 ^| Port       ^| Status        ^|
    echo =======================================================
    echo ^| XomTruyen.API        ^| 5172       ^| !API_STATUS!   ^|
    echo ^| XomTruyen Client     ^| 3000       ^| !CLIENT_STATUS!   ^|
    echo ^| XomTruyen Admin      ^| 3001       ^| !ADMIN_STATUS!   ^|
    echo =======================================================
    echo.
    echo [LOGS] Log dang duoc ghi live vao file: api.log, client.log, admin.log
    echo [STOP] De DUNG tat ca cac services, chi can TAT CUA SO NAY ^(bam dau X^).
    echo.
    echo He thong dang theo doi ngam. Man hinh se CHi CAP NHAT khi co su thay doi trang thai...
)

timeout /t 2 /nobreak >nul
goto dashboard_loop
