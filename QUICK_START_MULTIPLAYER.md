# 🚀 Guia Rápido - Multiplayer Quiz

## ⚡ Início Rápido (5 minutos)

### 1. Iniciar os Servidores

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

Aguarde até ver:
- Backend: `Servidor rodando na porta 3001` + `Socket.io habilitado para multiplayer`
- Frontend: `Compiled successfully!`

### 2. Criar uma Sala (Host)

1. Abra: http://localhost:3000/multiplayer/create
2. **Faça login** (necessário para criar sala)
3. Escolha um quiz
4. Clique em **"Criar Sala"**
5. **Anote o código** (ex: `ABC123`)

### 3. Entrar na Sala (Jogadores)

1. Abra em outra aba/navegador: http://localhost:3000/multiplayer/join
2. Digite o **código da sala**
3. Digite seu **nome**
4. Escolha um **avatar** (emoji)
5. Clique em **"Entrar na Sala"**

### 4. Jogar!

**Host:**
- Aguarde jogadores entrarem
- Clique em **"Iniciar Jogo"**
- Controle o fluxo:
  - Responda as questões
  - Clique em **"Mostrar Classificação"**
  - Clique em **"Próxima Questão"**
  - Repita até finalizar

**Jogadores:**
- Aguarde o host iniciar
- Responda as questões o mais rápido possível
- Acompanhe sua pontuação
- Veja o leaderboard entre questões

## 🎯 Testando Localmente

### Opção 1: Mesma Máquina

1. Abra múltiplas abas do navegador
2. Em uma aba: crie a sala (host)
3. Nas outras abas: entre na sala (jogadores)

### Opção 2: Múltiplas Máquinas (LAN)

1. **Descubra o IP do servidor:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
   Procure por algo como: `192.168.x.x`

2. **Atualize o frontend (temporário para teste):**
   
   Edite `frontend/src/services/socket.js` linha 3:
   ```javascript
   const SOCKET_URL = 'http://192.168.x.x:3001'; // Use o IP do servidor
   ```
   
   Edite `frontend/src/services/api.js` (se existir configuração de URL):
   ```javascript
   const API_URL = 'http://192.168.x.x:3001'; // Use o IP do servidor
   ```

3. **Reinicie o frontend** (Ctrl+C e npm start)

4. **Nos outros dispositivos:**
   - Abra: `http://192.168.x.x:3000/multiplayer/join`
   - Entre com o código da sala

## 🔍 Solução de Problemas

### ❌ "Socket desconectado"

**Solução:**
- Verifique se o backend está rodando
- Verifique se a porta 3001 não está bloqueada
- Confirme que está na mesma rede (LAN)

### ❌ "Sala não encontrada"

**Solução:**
- Verifique o código (case-sensitive)
- Confirme que o host criou a sala primeiro
- Verifique se o backend não foi reiniciado (salas são em memória)

### ❌ "Nome já em uso"

**Solução:**
- Escolha outro nome
- Cada jogador deve ter nome único na sala

### ❌ "Erro ao criar sala"

**Solução:**
- Confirme que está logado
- Verifique se o quiz existe e está publicado
- Verifique logs do backend no terminal

### ❌ Jogadores não aparecem no lobby

**Solução:**
- Recarregue a página do lobby
- Confirme que está conectado ao Socket.io (veja console do navegador)
- Verifique logs do servidor

## 📊 Verificar Estatísticas

Abra no navegador ou use curl:

```bash
curl http://localhost:3001/api/multiplayer/stats
```

Retorna:
```json
{
  "totalRooms": 2,
  "totalPlayers": 5,
  "activeRooms": 1
}
```

## 🎮 Fluxo Completo Exemplo

```
[Host - João]
1. Login → /multiplayer/create
2. Escolhe "Quiz de Sustentabilidade"
3. Sala criada: XYZ789
4. Aguarda jogadores...

[Jogador 1 - Maria]
1. /multiplayer/join
2. Código: XYZ789
3. Nome: Maria
4. Avatar: 😊
5. Entra no lobby

[Jogador 2 - Pedro]
1. /multiplayer/join
2. Código: XYZ789
3. Nome: Pedro
4. Avatar: 🤓
5. Entra no lobby

[Host - João]
6. Vê Maria e Pedro no lobby
7. Clica "Iniciar Jogo"

[Todos]
8. Questão 1 aparece simultaneamente
9. Timer de 30s começa
10. Cada um responde
11. Feedback imediato (certo/errado + pontos)

[Host - João]
12. Clica "Mostrar Classificação"

[Todos]
13. Veem leaderboard:
    1º Pedro - 1450 pts
    2º Maria - 1200 pts
    3º João - 1100 pts

[Host - João]
14. Clica "Próxima Questão"

[Todos]
15. Repete fluxo para questões 2, 3, 4...
16. No final: Leaderboard final com vencedor
```

## 📱 URLs Importantes

- **Home**: http://localhost:3000
- **Quizzes**: http://localhost:3000/quizzes
- **Criar Sala**: http://localhost:3000/multiplayer/create
- **Entrar na Sala**: http://localhost:3000/multiplayer/join
- **Estatísticas**: http://localhost:3001/api/multiplayer/stats

## 💡 Dicas

1. **Performance**: Quanto mais rápido responder, mais pontos ganha!
2. **Estratégia**: Não sacrifique precisão por velocidade
3. **Host**: Dê tempo para jogadores lerem o leaderboard
4. **Diversão**: Use emojis e nomes criativos!

## 🎉 Pronto!

Agora você pode criar suas próprias competições de quiz em tempo real!

**Divirta-se! 🚀**

