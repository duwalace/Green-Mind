# 🌿 Green Mind - Guia de Acesso via LAN

Guia simples para permitir que outras pessoas acessem o site Green Mind pela rede local (LAN) sem precisar baixar ou instalar nada - **apenas acessando pelo navegador**.

---

## 🎯 O Que Este Guia Faz

Este guia ensina como configurar o computador **servidor** (host) para que outras pessoas na **mesma rede WiFi** possam acessar o site digitando um endereço no navegador, sem precisar instalar nada nos dispositivos deles.

---

## ⚡ Configuração Rápida (3 Passos)

### 🖥️ No Computador Servidor (Host)

Este é o computador que vai "hospedar" o site para os outros acessarem.

#### **Passo 1: Executar o Script de Configuração**

1. Localize o arquivo `start-lan.bat` na pasta do projeto
2. **Duplo clique** no arquivo `start-lan.bat`
3. **📝 ANOTE O IP QUE APARECER** (exemplo: `192.168.1.100`)

**O que o script faz automaticamente:**
- ✅ Detecta o IP do seu computador
- ✅ Configura o sistema para aceitar conexões da rede
- ✅ Inicia os servidores

> 💡 **Tem múltiplos adaptadores de rede?** (Ethernet, Ethernet 2, WiFi)
> 
> Use o `start-lan-manual.bat` que permite **escolher manualmente** qual IP usar!
> - Ele mostra todos os IPs disponíveis
> - Você escolhe o correto
> - Evita conflitos de IP

#### **Passo 2: Liberar no Firewall**

1. Localize o arquivo `configure-firewall.bat`
2. **Clique com o botão direito** → **"Executar como administrador"**
3. Aguarde a mensagem de sucesso

**Isso permite que outros dispositivos se conectem ao seu computador.**

---

### 📱 Nos Outros Dispositivos (Celular, Tablet, Notebook)

As pessoas que vão acessar o site **não precisam instalar nada**!

#### **O que fazer:**

1. **Conecte-se à mesma rede WiFi** que o computador servidor
2. Abra o **navegador** (Chrome, Firefox, Safari, Edge, etc.)
3. Digite na barra de endereço:

```
http://192.168.1.100:3000
```

> ⚠️ **Substitua `192.168.1.100` pelo IP que você anotou no Passo 1!**

4. **Pronto!** O site vai abrir normalmente no navegador 🎉

---

## 📋 Requisitos

### No Computador Servidor:
- [x] Node.js instalado
- [x] MySQL instalado e rodando (WAMP/XAMPP)
- [x] Scripts executados (passos 1 e 2 acima)

### Nos Dispositivos Cliente:
- [x] Conectados à **mesma rede WiFi/Ethernet**
- [x] Navegador de internet (qualquer um)

**É só isso! Não precisa instalar Node.js, MySQL ou qualquer programa nos dispositivos clientes.**

---

## 🛠️ Solução de Problemas

### ❌ "Tenho múltiplos adaptadores de rede (Ethernet, Ethernet 2, WiFi)" 🆕

**Problema:** Se dois PCs têm o **mesmo IP** em algum adaptador, haverá conflito!

**Como identificar:**
```bash
ipconfig
```

Você verá algo como:
```
Adaptador Ethernet ethernet:
   IPv4: 192.168.1.100  ← IPs diferentes ✅

Adaptador Ethernet ethernet 2:
   IPv4: 192.168.1.50   ← MESMO IP em ambos PCs ❌
```

**Soluções:**

**Opção 1: Desabilitar adaptador não usado (Recomendado)**
1. Pressione `Win + R` → Digite `ncpa.cpl` → Enter
2. Clique com botão direito no adaptador não usado (ex: "Ethernet 2")
3. Selecione **"Desabilitar"**
4. Execute `start-lan.bat` novamente

**Opção 2: Usar o script manual**
1. Execute `start-lan-manual.bat` (criado especialmente para isso)
2. O script mostrará **todos os IPs** disponíveis
3. **Digite manualmente** o IP correto do adaptador que está na rede
4. Use o adaptador que tem IPs **diferentes** em cada PC!

**Opção 3: Configurar IPs únicos**
- Configure cada PC com um IP diferente em todos os adaptadores

### ❌ "Não consigo acessar de outro dispositivo"

**Solução 1: Verifique se estão na mesma rede**
- O celular/tablet está conectado ao mesmo WiFi que o servidor?
- No servidor, abra o CMD e digite `ipconfig` para confirmar o IP

**Solução 2: Verifique o Firewall**
- Execute novamente o `configure-firewall.bat` como administrador
- Ou desative temporariamente o Firewall do Windows para testar

**Solução 3: Verifique se o servidor está rodando**
- O terminal deve mostrar: `Servidor rodando em: http://192.168.1.100:3001`
- Se não estiver, execute o `start-lan.bat` novamente

**Solução 4: Teste do próprio servidor**
- No servidor, tente acessar `http://localhost:3000`
- Se funcionar no servidor mas não em outros dispositivos, é problema de firewall

### ❌ "A página não carrega / fica em branco"

**Soluções:**
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Tente em modo anônimo/privado
3. Verifique se digitou o IP correto
4. Certifique-se de incluir `:3000` no final do endereço

### ❌ "Connection refused" ou "Não foi possível conectar"

**Causas comuns:**
- Servidor não está rodando → Execute `start-lan.bat` novamente
- Firewall bloqueando → Execute `configure-firewall.bat` como admin
- IP errado → Confirme o IP com `ipconfig` no servidor

---

## 💡 Dicas Importantes

### ✅ Boas Práticas

1. **Mantenha o servidor ligado** enquanto outras pessoas estiverem usando
2. **Anote o IP em um papel** ou compartilhe por mensagem
3. **Teste antes** com um dispositivo para garantir que funciona
4. **Use uma rede WiFi estável** para evitar desconexões

### ⚠️ Importante Saber

- **Só funciona na mesma rede local** (WiFi da casa, escritório, escola)
- **Não funciona pela internet** (apenas dispositivos na mesma rede)
- **O IP pode mudar** se o servidor reiniciar ou mudar de rede
- **O computador servidor precisa ficar ligado** durante o uso

### 🔄 Como Parar o Servidor

Quando quiser parar de hospedar:
1. Vá no terminal/prompt que está rodando
2. Pressione **Ctrl+C**
3. Feche o terminal

---

## 📝 Resumo Visual

```
┌─────────────────────────────────┐
│  Computador Servidor (Host)     │
│  IP: 192.168.1.100              │
│  Executou: start-lan.bat        │
│  Executou: configure-firewall   │
│                                 │
│  ⚠️ Se tiver múltiplos           │
│  adaptadores, use:              │
│  start-lan-manual.bat           │
└────────────┬────────────────────┘
             │
        [WiFi Router]
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼────┐
│ Celular│      │ Tablet  │
│        │      │         │
│ Apenas │      │ Apenas  │
│ acessa:│      │ acessa: │
│        │      │         │
│ 192.   │      │ 192.    │
│ 168.1  │      │ 168.1   │
│ .100:  │      │ .100:   │
│ 3000   │      │ 3000    │
└────────┘      └─────────┘
```

### 🔍 Identificando o IP Correto

Se você tem múltiplos adaptadores, faça `ipconfig` e:
- ✅ Use o IP do adaptador que está **realmente conectado** à rede
- ✅ Cada PC deve ter um IP **diferente**
- ❌ Evite usar adaptadores com IPs iguais em ambos os PCs

---

## 🎯 Checklist de Acesso

### No Servidor (uma vez apenas):
- [ ] Executei `start-lan.bat`
- [ ] Anotei o IP mostrado
- [ ] Executei `configure-firewall.bat` como administrador
- [ ] Servidor está rodando (janela do terminal aberta)

### Nos Clientes (cada dispositivo):
- [ ] Conectado à mesma rede WiFi
- [ ] Digitei `http://IP_DO_SERVIDOR:3000` no navegador
- [ ] Site abriu corretamente

---

## 🎉 Pronto!

Agora você sabe como:

✅ Configurar seu computador como servidor  
✅ Permitir que outros acessem o site pela rede  
✅ Resolver problemas comuns de conexão  

**Não é necessário instalar nada nos dispositivos clientes - apenas um navegador! 🚀**

---

**Green Mind Educational Platform**  
🌿 Acesso simples e rápido pela rede local 🌿

