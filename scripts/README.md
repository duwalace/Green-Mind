# 🚀 Scripts de Inicialização - Green Mind

Pasta contendo scripts para configuração e inicialização do sistema em rede local (LAN).

## 📝 Arquivos

### 🎯 Scripts Principais

#### `start-lan.bat`
Script automático para iniciar o servidor em modo LAN.
- ✅ Detecta automaticamente o IP local
- ✅ Configura ambos os servidores (backend e frontend)
- ✅ Abre automaticamente no navegador

**Como usar:**
```bash
# Duplo clique no arquivo ou execute:
start-lan.bat
```

#### `start-lan-manual.bat`
Script manual para escolher o IP manualmente (útil quando há múltiplos adaptadores de rede).
- ✅ Mostra todos os IPs disponíveis
- ✅ Permite escolher o IP correto
- ✅ Evita conflitos de IP

**Quando usar:**
- Quando você tem múltiplos adaptadores (Ethernet, Ethernet 2, WiFi)
- Quando dois PCs têm IPs conflitantes
- Quando o script automático não detecta o IP correto

**Como usar:**
```bash
# Duplo clique no arquivo ou execute:
start-lan-manual.bat
```

#### `start-lan.ps1`
Versão PowerShell do script de inicialização (mais recursos).
- ✅ Verificações avançadas
- ✅ Mensagens de erro detalhadas
- ✅ Configuração automática

**Como usar:**
```powershell
# No PowerShell:
.\start-lan.ps1
```

### 🔒 Scripts de Configuração

#### `configure-firewall.bat`
Configura o Firewall do Windows para permitir conexões na rede local.
- ✅ Libera portas 3000 e 3001
- ✅ Permite acesso de outros dispositivos
- ⚠️ **Precisa ser executado como Administrador**

**Como usar:**
```bash
# Clique com botão direito → "Executar como administrador"
```

#### `test-connection.bat`
Testa a conexão e configuração da rede.
- ✅ Verifica se os servidores estão rodando
- ✅ Testa conectividade
- ✅ Mostra informações de rede

**Como usar:**
```bash
# Duplo clique no arquivo
test-connection.bat
```

## 🎯 Ordem Recomendada de Execução

### Primeira Vez (Configuração Inicial)

1. **Configure o Firewall** (apenas uma vez)
   ```bash
   configure-firewall.bat (como Administrador)
   ```

2. **Inicie o servidor**
   ```bash
   start-lan.bat
   ```
   ou se tiver problemas:
   ```bash
   start-lan-manual.bat
   ```

3. **Anote o IP** que aparecer (ex: `192.168.1.100`)

4. **Compartilhe com outros**
   - No celular/tablet: acesse `http://192.168.1.100:3000`

### Próximas Vezes

1. **Apenas inicie o servidor**
   ```bash
   start-lan.bat
   ```

## 🛠️ Solução de Problemas

### ❌ "Erro: Múltiplos adaptadores de rede"
**Solução:** Use `start-lan-manual.bat` e escolha o IP correto

### ❌ "Não consigo acessar de outro dispositivo"
**Solução:** 
1. Execute `configure-firewall.bat` como administrador
2. Verifique se estão na mesma rede WiFi
3. Teste com `test-connection.bat`

### ❌ "Connection refused"
**Solução:**
1. Verifique se o servidor está rodando
2. Confirme o IP com `ipconfig`
3. Reinicie o servidor

## 📚 Documentação

Para mais detalhes, consulte: `docs/GUIA_LAN_COMPLETO.md`

---

**Green Mind Educational Platform**  
🌿 Scripts de inicialização para rede local (LAN)

