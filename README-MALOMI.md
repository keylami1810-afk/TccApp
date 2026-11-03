# Malomi — versão visual revisada do TCC

Esta versão foi ajustada para aproximar o aplicativo da identidade visual do site Malomi: rosa suave, ameixa escura, lavanda discreta, cartões arredondados, sombras leves e maior consistência entre as telas.

## O que foi atualizado

- Tela de configurações redesenhada, com prévias dos sete temas, indicação clara do tema ativo e confirmação ao sair.
- Tema principal ajustado para rosa pastel, ameixa e rosa antigo, com cartões claros e bordas suaves.
- Telas financeiras principal, do aluno e Malomi for Schools refinadas com espaçamento, sombras, cantos arredondados e gráficos em tons coordenados.
- Tela de login e cadastro alinhadas à identidade do site e com o ícone de gatinho do Malomi.
- Seleção de tema concentrada nas Configurações; o login do aluno não troca o tema diretamente.
- Tema salvo continua usando AsyncStorage e é recarregado ao voltar às telas principais.
- Diretório de rotas normalizado para `app/` minúsculo, como espera o Expo Router em ambientes sensíveis a maiúsculas/minúsculas.
- A pasta `js/` antiga foi preservada como cópia de referência; o Expo Router usa os arquivos dentro de `app/`. Faça alterações em `app/`, não em `js/`.
- `package.json` alinhado às versões do Expo 57 e React Native que você informou.
- Inicialização do SQLite e funcionalidades de cadastro, login, movimentações e atividades foram mantidas.

## Como abrir no Windows

1. Extraia o ZIP para uma pasta nova, por exemplo `C:\Users\Home\Downloads\TccApp`.
2. Abra essa pasta no VS Code — a pasta aberta precisa conter `package.json`.
3. No terminal do VS Code, execute:

   ```bash
   npm install
   npx expo start -c
   ```

4. Leia o QR code com uma versão do Expo Go compatível com o SDK informado no terminal. Se o Expo mostrar um erro de dependências, envie a mensagem completa antes de executar comandos de atualização.

## Observações importantes

- O tema é salvo localmente neste dispositivo. Os dados não são sincronizados automaticamente entre aparelhos.
- As fontes decorativas dos temas foram mantidas porque o título do acesso escolar as utiliza; elas não são aplicadas aos textos comuns das telas financeiras.
- O código JavaScript/JSX foi verificado quanto à sintaxe e os imports relativos foram conferidos. Este ambiente não executou o aplicativo em um celular ou emulador, portanto ainda é importante testar login, cadastro, troca de tema, lançamentos e atividades no seu Expo.
- O cadastro atual guarda a senha no banco SQLite local em texto simples. Use apenas para protótipo escolar; antes de qualquer publicação ou uso com dados reais, isso precisa ser substituído por uma autenticação mais segura.
