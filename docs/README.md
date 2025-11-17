# 📚 Documentação - Green Mind

Pasta contendo toda a documentação do projeto.

## 📝 Arquivos de Documentação

### `GUIA_LAN_COMPLETO.md`
Guia completo para configurar e usar o sistema em rede local (LAN).

**Conteúdo:**
- ✅ Como configurar o servidor
- ✅ Como permitir acesso de outros dispositivos
- ✅ Solução de problemas comuns
- ✅ Identificação de IPs em múltiplos adaptadores
- ✅ Configuração de firewall

**Quando usar:**
- Primeira vez configurando o sistema em LAN
- Precisa compartilhar o acesso com outros dispositivos
- Problemas de conexão na rede local

## 📖 Outras Documentações

### Documentação Técnica

Para informações técnicas sobre o código, consulte:

- **Backend:** `backend/README.md` (se existir)
- **Frontend:** `frontend/README.md`
- **Sistema de Filtro:** `backend/utils/contentValidator.js` (comentários no código)

### Guias Rápidos

#### 🚀 Iniciar o Sistema

```bash
# Na raiz do projeto:
scripts/start-lan.bat
```

#### 💾 Configurar Banco de Dados

```bash
# Execute o SQL no MySQL:
database/db.sql
```

#### 🔒 Configurar Firewall

```bash
# Execute como administrador:
scripts/configure-firewall.bat
```

## 🎯 Estrutura do Projeto

```
Green-Mind/
├── 📂 backend/              Sistema backend (Node.js + Express)
├── 📂 frontend/             Sistema frontend (React)
├── 📂 scripts/              Scripts de inicialização e configuração
├── 📂 database/             Script SQL do banco de dados
├── 📂 docs/                 📍 Você está aqui - Documentação
└── README.md               README principal do projeto
```

## 📚 Links Úteis

### Documentação do Sistema

- **Guia LAN:** `GUIA_LAN_COMPLETO.md`
- **Database:** `../database/README.md`
- **Scripts:** `../scripts/README.md`

### Recursos Externos

- **Node.js:** https://nodejs.org/
- **React:** https://react.dev/
- **Express:** https://expressjs.com/
- **MySQL:** https://www.mysql.com/

## 🆘 Precisa de Ajuda?

### Problemas Comuns

1. **Servidor não inicia**
   - Verifique se Node.js está instalado
   - Verifique se as dependências estão instaladas (`npm install`)
   - Consulte: `GUIA_LAN_COMPLETO.md`

2. **Não consegue acessar de outro dispositivo**
   - Execute o firewall: `scripts/configure-firewall.bat`
   - Verifique se estão na mesma rede
   - Consulte: `GUIA_LAN_COMPLETO.md`

3. **Banco de dados não funciona**
   - Certifique-se de que MySQL está rodando
   - Execute: `database/db.sql`
   - Consulte: `../database/README.md`

## 🔄 Atualizações

Esta documentação é atualizada conforme o projeto evolui. Sempre consulte a versão mais recente.

**Última atualização:** Novembro 2025

---

**Green Mind Educational Platform**  
📚 Documentação completa do sistema

