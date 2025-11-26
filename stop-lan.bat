@echo off
chcp 65001 >nul
title Green Mind - Reverter para Modo Localhost
color 0E

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║       🌿 GREEN MIND - REVERTER PARA LOCALHOST 🌿         ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo Este script irá reverter as configurações de LAN para o modo
echo localhost, permitindo usar o sistema localmente.
echo.
pause

:: Verificar se há backups
set BACKEND_BACKUP_EXISTS=0
set FRONTEND_BACKUP_EXISTS=0

if exist "backend\.env.backup" set BACKEND_BACKUP_EXISTS=1
if exist "frontend\.env.backup" set FRONTEND_BACKUP_EXISTS=1

echo.
echo 🔍 Verificando backups...

if %BACKEND_BACKUP_EXISTS%==1 (
    echo ✅ Backup do backend encontrado
) else (
    echo ⚠️  Backup do backend não encontrado
)

if %FRONTEND_BACKUP_EXISTS%==1 (
    echo ✅ Backup do frontend encontrado
) else (
    echo ⚠️  Backup do frontend não encontrado
)

echo.
echo 📝 Escolha uma opção:
echo    [1] Restaurar backups (se existirem)
echo    [2] Criar configuração localhost padrão
echo    [3] Cancelar
echo.
choice /C 123 /N /M "Digite 1, 2 ou 3: "

if errorlevel 3 goto :cancel
if errorlevel 2 goto :create_default
if errorlevel 1 goto :restore_backup

:restore_backup
echo.
echo 🔄 Restaurando backups...

if %BACKEND_BACKUP_EXISTS%==1 (
    copy /Y "backend\.env.backup" "backend\.env" >nul
    echo ✅ Backend restaurado do backup
) else (
    echo ⚠️  Nenhum backup do backend para restaurar
)

if %FRONTEND_BACKUP_EXISTS%==1 (
    copy /Y "frontend\.env.backup" "frontend\.env" >nul
    echo ✅ Frontend restaurado do backup
) else (
    echo ⚠️  Nenhum backup do frontend para restaurar
)

goto :done

:create_default
echo.
echo 🔄 Criando configuração localhost padrão...

:: Criar arquivo .env padrão para o backend
(
    echo # Configuração do Servidor - Modo Localhost
    echo PORT=3001
    echo HOST=0.0.0.0
    echo.
    echo # JWT Secret
    echo JWT_SECRET=seu_jwt_secret_altere_em_producao
    echo.
    echo # Ambiente
    echo NODE_ENV=development
    echo.
    echo # URLs permitidas para CORS
    echo ALLOWED_ORIGINS=*
    echo.
    echo # Banco de Dados
    echo DB_HOST=localhost
    echo DB_USER=root
    echo DB_PASSWORD=
    echo DB_NAME=green_mind
) > "backend\.env"
echo ✅ backend\.env configurado para localhost

:: Criar arquivo .env padrão para o frontend
(
    echo # API Configuration - Modo Localhost
    echo REACT_APP_API_URL=http://localhost:3001/api
    echo REACT_APP_SOCKET_URL=http://localhost:3001
) > "frontend\.env"
echo ✅ frontend\.env configurado para localhost

goto :done

:cancel
echo.
echo ❌ Operação cancelada pelo usuário.
echo.
pause
exit /b 0

:done
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║              ✅ CONFIGURAÇÃO CONCLUÍDA!                   ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 🏠 Sistema configurado para modo localhost.
echo.
echo 💡 Para usar novamente:
echo    - Acesse: http://localhost:3000
echo    - Certifique-se de que o WAMP/XAMPP está rodando
echo.
echo 🔄 Para voltar ao modo LAN, execute 'start-lan.bat' novamente.
echo.
pause

