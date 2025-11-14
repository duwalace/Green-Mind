@echo off
chcp 65001 >nul
title Green Mind - Configurar Firewall
color 0C

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║         🔥 GREEN MIND - CONFIGURAÇÃO DE FIREWALL 🔥       ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo Este script irá adicionar regras ao Firewall do Windows para
echo permitir conexões nas portas 3000 e 3001.
echo.
echo ⚠️  ATENÇÃO: Este script requer permissões de Administrador!
echo.
pause

:: Verificar se está executando como Administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERRO: Este script precisa ser executado como Administrador!
    echo.
    echo 👉 Clique com botão direito no arquivo e selecione
    echo    "Executar como administrador"
    echo.
    pause
    exit /b 1
)

echo.
echo 🔄 Adicionando regras ao Firewall...
echo.

:: Remover regras antigas se existirem
netsh advfirewall firewall delete rule name="Green Mind - Backend (TCP 3001)" >nul 2>&1
netsh advfirewall firewall delete rule name="Green Mind - Frontend (TCP 3000)" >nul 2>&1

:: Adicionar regra para porta 3001 (Backend)
netsh advfirewall firewall add rule name="Green Mind - Backend (TCP 3001)" dir=in action=allow protocol=TCP localport=3001
if %errorlevel% equ 0 (
    echo ✅ Regra adicionada: Porta 3001 ^(Backend^)
) else (
    echo ❌ Erro ao adicionar regra para porta 3001
)

:: Adicionar regra para porta 3000 (Frontend)
netsh advfirewall firewall add rule name="Green Mind - Frontend (TCP 3000)" dir=in action=allow protocol=TCP localport=3000
if %errorlevel% equ 0 (
    echo ✅ Regra adicionada: Porta 3000 ^(Frontend^)
) else (
    echo ❌ Erro ao adicionar regra para porta 3000
)

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║              ✅ CONFIGURAÇÃO CONCLUÍDA!                   ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo O Firewall do Windows agora permite conexões nas portas 3000 e 3001.
echo Outros dispositivos na mesma rede poderão acessar a aplicação.
echo.
pause

