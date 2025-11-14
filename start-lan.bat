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
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr /v "127.0.0.1"') do (
    set IP=%%a
    goto :found
)

:found
:: Remover espaços em branco
set IP=%IP: =%

if "%IP%"=="" (
    echo ❌ Não foi possível detectar o IP da rede local.
    echo    Certifique-se de estar conectado a uma rede WiFi ou Ethernet.
    pause
    exit /b 1
)

echo ✅ IP detectado: %IP%
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
        echo JWT_SECRET=seu_jwt_secret
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
    echo REACT_APP_API_URL=http://%IP%:3001/api
    echo REACT_APP_SOCKET_URL=http://%IP%:3001
) > "frontend\.env"
echo ✅ Arquivo frontend\.env atualizado
echo.

:: Verificar se o Node está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado! Por favor, instale o Node.js primeiro.
    echo    Download: https://nodejs.org/
    pause
    exit /b 1
)

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

