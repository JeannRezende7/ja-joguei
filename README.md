# 🎮 Já Joguei - Gerenciador de Jogos

Aplicativo web para organizar e gerenciar sua biblioteca de jogos pessoal.

## 🚀 Recursos

- ✅ Sistema de Login (Email/Senha ou Google Demo)
- ✅ Adicionar, editar e deletar jogos
- ✅ Avaliação com estrelas (1-5)
- ✅ Status (Completado, Jogando, Abandonado, Backlog)
- ✅ Múltiplas plataformas (PC, PlayStation, Xbox, Switch, Mobile)
- ✅ Tags/Gêneros personalizáveis
- ✅ Registro de horas jogadas e data de finalização
- ✅ Notas e comentários pessoais
- ✅ Filtros por status e plataforma
- ✅ Busca por nome
- ✅ Estatísticas (total, completados, média de notas, horas)
- ✅ Design moderno e responsivo
- ✅ Dados salvos localmente no navegador

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. **Crie uma pasta para o projeto:**
```bash
mkdir ja-joguei
cd ja-joguei
```

2. **Copie todos os arquivos:**
   - `package.json`
   - `public/index.html`
   - `src/index.js`
   - `src/index.css`
   - `src/App.js`

3. **Instale as dependências:**
```bash
npm install
```

4. **Inicie o projeto:**
```bash
npm start
```

5. **Abra no navegador:**
   - O app abrirá automaticamente em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
ja-joguei/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎯 Como Usar

1. **Login:**
   - Use o botão "Continuar com Google (Demo)" para acesso rápido
   - Ou registre-se com email e senha

2. **Adicionar Jogos:**
   - Clique em "Adicionar Jogo"
   - Preencha as informações
   - Selecione tags e adicione comentários

3. **Gerenciar Biblioteca:**
   - Use a busca para encontrar jogos
   - Filtre por status ou plataforma
   - Edite ou delete jogos pelos ícones nos cards

4. **Acompanhar Estatísticas:**
   - Veja total de jogos, completados, média de notas e horas jogadas

## 🔮 Próximos Passos (Opcional)

Para transformar em app real com dados na nuvem:

1. Configure um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Authentication e Firestore
3. Integre as credenciais no código
4. Substitua localStorage por Firestore

## 📝 Notas

- Os dados ficam salvos no navegador (localStorage)
- Cada usuário tem sua própria biblioteca local
- Limpar o cache do navegador apagará os dados

## 🤝 Contribuindo

Sinta-se livre para fazer fork, modificar e melhorar o projeto!

## 📄 Licença

Este projeto é livre para uso pessoal e educacional.

---

Feito com ❤️ para gamers organizados! 🎮✨