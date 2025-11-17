# Green Mind - Script PowerShell para iniciar em Rede LAN
# Encoding: UTF-8

Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║       🌿 GREEN MIND - CONFIGURAÇÃO PARA REDE LAN 🌿       ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

# Obter o IP local da máquina
Write-Host "🔍 Detectando IP da rede local..." -ForegroundColor Yellow

$IP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.InterfaceAlias -notlike "*Loopback*" -and 
    $_.IPAddress -notlike "127.*" -and
    $_.InterfaceAlias -notlike "*VirtualBox*" -and
    $_.InterfaceAlias -notlike "*VMware*"
} | Select-Object -First 1).IPAddress

if (-not $IP) {
    Write-Host "❌ Não foi possível detectar o IP da rede local." -ForegroundColor Red
    Write-Host "   Certifique-se de estar conectado a uma rede WiFi ou Ethernet." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "✅ IP detectado: $IP`n" -ForegroundColor Green

# Criar arquivo .env para o backend (se não existir)
if (-not (Test-Path "backend\.env")) {
    Write-Host "📝 Criando arquivo de configuração do backend..." -ForegroundColor Yellow
    
    $backendEnv = @"
# Configuração do Servidor
PORT=3001
HOST=0.0.0.0

# JWT Secret
JWT_SECRET=seu_jwt_secret

# Ambiente
NODE_ENV=development

# URLs permitidas para CORS
ALLOWED_ORIGINS=*

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=green_mind
"@
    
    $backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8
    Write-Host "✅ Arquivo backend\.env criado" -ForegroundColor Green
}

# Criar arquivo .env para o frontend
Write-Host "📝 Configurando frontend para usar IP: $IP..." -ForegroundColor Yellow

$frontendEnv = @"
# API Configuration - Gerado automaticamente para LAN
REACT_APP_API_URL=http://${IP}:3001/api
REACT_APP_SOCKET_URL=http://${IP}:3001
"@

$frontendEnv | Out-File -FilePath "frontend\.env" -Encoding UTF8
Write-Host "✅ Arquivo frontend\.env atualizado`n" -ForegroundColor Green

# Verificar se o Node está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado! Por favor, instale o Node.js primeiro." -ForegroundColor Red
    Write-Host "   Download: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se as dependências estão instaladas
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "🔄 Instalando dependências do backend..." -ForegroundColor Yellow
    Push-Location backend
    npm install
    Pop-Location
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "🔄 Instalando dependências do frontend..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
}

Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    ✅ CONFIGURAÇÃO CONCLUÍDA!             ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📱 Para acessar de outros dispositivos na mesma rede:" -ForegroundColor Cyan
Write-Host "   👉 Abra o navegador e acesse: http://${IP}:3000`n" -ForegroundColor White

Write-Host "🔥 Configuração do Firewall:" -ForegroundColor Yellow
Write-Host "   Se houver problemas de conexão, adicione exceção para as portas:" -ForegroundColor White
Write-Host "   - Porta 3000 (Frontend)" -ForegroundColor White
Write-Host "   - Porta 3001 (Backend/API)`n" -ForegroundColor White

Write-Host "🚀 Iniciando servidores...`n" -ForegroundColor Yellow

# Iniciar backend em uma nova janela
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🔧 Backend - Porta 3001' -ForegroundColor Green; npm start"

# Aguardar 3 segundos
Start-Sleep -Seconds 3

# Iniciar frontend em uma nova janela
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '🎨 Frontend - Porta 3000' -ForegroundColor Cyan; npm start"

Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
Write-Host "   - Backend rodando em: http://${IP}:3001" -ForegroundColor White
Write-Host "   - Frontend rodando em: http://${IP}:3000`n" -ForegroundColor White

Write-Host "💡 Para parar os servidores, feche as janelas do backend e frontend.`n" -ForegroundColor Yellow

Read-Host "Pressione Enter para sair"

