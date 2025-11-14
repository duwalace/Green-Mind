@echo off
chcp 65001 >nul
title Green Mind - Testar Conexão LAN
color 0B

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║         🧪 GREEN MIND - TESTE DE CONEXÃO LAN 🧪           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: Obter o IP local
echo 🔍 Detectando IP da rede local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr /v "127.0.0.1"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP: =%

if "%IP%"=="" (
    echo ❌ Não foi possível detectar o IP da rede local.
    pause
    exit /b 1
)

echo ✅ IP detectado: %IP%
echo.

:: Testar se as portas estão abertas
echo 🔌 Testando portas...
echo.

:: Testar porta 3001 (Backend)
netstat -an | find "3001" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ✅ Porta 3001 ^(Backend^): ABERTA
) else (
    echo ⚠️  Porta 3001 ^(Backend^): FECHADA - O servidor backend não está rodando
)

:: Testar porta 3000 (Frontend)
netstat -an | find "3000" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ✅ Porta 3000 ^(Frontend^): ABERTA
) else (
    echo ⚠️  Porta 3000 ^(Frontend^): FECHADA - O servidor frontend não está rodando
)

echo.
echo 📋 Informações de Conexão:
echo ═══════════════════════════════════════════════════════════
echo.
echo 🖥️  Servidor (esta máquina):
echo    - Backend:  http://localhost:3001
echo    - Frontend: http://localhost:3000
echo.
echo 📱 Outros dispositivos na rede:
echo    - Acesse:   http://%IP%:3000
echo.
echo 🌐 Configuração do Frontend (.env):
echo    REACT_APP_API_URL=http://%IP%:3001/api
echo    REACT_APP_SOCKET_URL=http://%IP%:3001
echo.
echo ═══════════════════════════════════════════════════════════
echo.

:: Verificar firewall
echo 🔥 Verificando regras do Firewall...
echo.
netsh advfirewall firewall show rule name="Green Mind - Backend (TCP 3001)" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Regra de firewall para Backend: CONFIGURADA
) else (
    echo ⚠️  Regra de firewall para Backend: NÃO CONFIGURADA
    echo    Execute: configure-firewall.bat ^(como administrador^)
)

netsh advfirewall firewall show rule name="Green Mind - Frontend (TCP 3000)" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Regra de firewall para Frontend: CONFIGURADA
) else (
    echo ⚠️  Regra de firewall para Frontend: NÃO CONFIGURADA
    echo    Execute: configure-firewall.bat ^(como administrador^)
)

echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🧪 TESTE RÁPIDO:
echo.
echo 1. Abra o navegador nesta máquina e acesse:
echo    http://localhost:3000
echo.
echo 2. Abra o navegador em outro dispositivo e acesse:
echo    http://%IP%:3000
echo.
echo 3. Se ambos carregarem, a configuração está correta! ✅
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause

