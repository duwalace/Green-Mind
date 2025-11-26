@echo off
chcp 65001 >nul
title Green Mind - Iniciar em Rede LAN
color 0A

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║       🌿 GREEN MIND - CONFIGURAÇÃO PARA REDE LAN 🌿       ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: Obter o IP local da máquina
echo 🔍 Detectando IP da rede local...
echo.

:: Listar todos os IPs disponíveis
echo 📡 Adaptadores de rede encontrados:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr /v "127.0.0.1"') do (
    set "TEMP_IP=%%a"
    setlocal enabledelayedexpansion
    set "TEMP_IP=!TEMP_IP: =!"
    echo    - !TEMP_IP!
    if not defined IP set "IP=!TEMP_IP!"
    endlocal
)

:: Remover espaços em branco do IP selecionado
set IP=%IP: =%

if "%IP%"=="" (
    echo.
    echo ❌ Não foi possível detectar o IP da rede local.
    echo    Certifique-se de estar conectado a uma rede WiFi ou Ethernet.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ IP selecionado automaticamente: %IP%
echo.
echo ⚠️  ATENÇÃO: Se você tem múltiplos adaptadores de rede, use o script
echo    'start-lan-manual.bat' para escolher manualmente o IP correto!
echo.

:: Backup das configurações existentes
echo 💾 Fazendo backup das configurações...
if exist "backend\.env" (
    copy /Y "backend\.env" "backend\.env.backup" >nul
    echo ✅ Backup: backend\.env.backup criado
)
if exist "frontend\.env" (
    copy /Y "frontend\.env" "frontend\.env.backup" >nul
    echo ✅ Backup: frontend\.env.backup criado
)
echo.

:: Criar arquivo .env para o backend (se não existir)
if not exist "backend\.env" (
    echo 📝 Criando arquivo de configuração do backend...
    (
        echo # Configuração do Servidor
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
    echo ✅ Arquivo backend\.env criado
)

:: Criar arquivo .env para o frontend
echo 📝 Configurando frontend para usar IP: %IP%...
(
    echo # API Configuration - Gerado automaticamente para LAN
    echo # Backup salvo em frontend\.env.backup
    echo REACT_APP_API_URL=http://%IP%:3001/api
    echo REACT_APP_SOCKET_URL=http://%IP%:3001
) > "frontend\.env"
echo ✅ Arquivo frontend\.env atualizado
echo.

:: Verificar se o Node está instalado
echo 🔍 Verificando Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado! Por favor, instale o Node.js primeiro.
    echo    Download: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
node --version
echo ✅ Node.js instalado
echo.

:: Verificar se o MySQL está rodando (WAMP/XAMPP)
echo 🔍 Verificando MySQL...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if %errorlevel% neq 0 (
    echo ❌ MySQL não está rodando!
    echo    Por favor, inicie o WAMP ou XAMPP antes de continuar.
    echo.
    echo 💡 Passos:
    echo    1. Abra o WAMP ou XAMPP
    echo    2. Inicie o MySQL
    echo    3. Execute este script novamente
    echo.
    pause
    exit /b 1
)
echo ✅ MySQL está rodando
echo.

:: Verificar se as dependências estão instaladas
echo 📦 Verificando dependências...

if not exist "backend\node_modules" (
    echo 🔄 Instalando dependências do backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo 🔄 Instalando dependências do frontend...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                    ✅ CONFIGURAÇÃO CONCLUÍDA!             ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 📱 Para acessar de outros dispositivos na mesma rede:
echo    👉 Abra o navegador e acesse: http://%IP%:3000
echo.
echo 🔥 Configuração do Firewall:
echo    Se houver problemas de conexão, adicione exceção para as portas:
echo    - Porta 3000 (Frontend)
echo    - Porta 3001 (Backend/API)
echo.
echo 🚀 Iniciando servidores...
echo.

:: Abrir dois terminais: um para backend e outro para frontend
start "Green Mind - Backend (Porta 3001)" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul
start "Green Mind - Frontend (Porta 3000)" cmd /k "cd frontend && npm start"

echo.
echo ✅ Servidores iniciados!
echo    - Backend rodando em: http://%IP%:3001
echo    - Frontend rodando em: http://%IP%:3000
echo.
echo 💡 Mantenha esta janela aberta enquanto usa a aplicação.
echo    Para parar os servidores, feche as janelas do backend e frontend.
echo.
pause

