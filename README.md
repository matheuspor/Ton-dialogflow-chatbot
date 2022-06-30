<div>

# Ton Chatbot
![GitHub workflow status](https://img.shields.io/github/workflow/status/matheuspor/Ton-dialogflow-chatbot/Webhook%20Server%20Tests)
![Repository top language](https://img.shields.io/github/languages/top/matheuspor/ton-dialogflow-chatbot)

</div>
Responde informações sobre os planos de taxas e as maquininhas disponíveis no Ton.
<br>
Integrado ao <a href="https://t.me/TonPlanosChatbot">Telegram :speech_balloon:</a>

## Setup DialogFlow e Fulfillments

1. Clone o repositório: `git clone https://github.com/matheuspor/Ton-dialogflow-chatbot`
2. No DialogFlow > Settings ⚙ > Export and Import > Restore from zip com o arquivo `TonBot.zip`

### Fulfillments
O projeto está no ar utilizando o próprio Inline Editor do DialogFlow, porém é possível utilizar um webhook em NodeJs/Express já configurado.

### Opção 1: Inline Editor
3. No DialogFlow > ⚡ Fulfillments > Utilize os arquivos `index.js` e `package.json` do diretório raiz desse repositório para o preenchimento do inline editor.

### Opção 2: Webhook
*Para o webhook é necessário que a url do servidor seja `https`, utilizei o Ngrok para essa finalidade.

3. Instale as Dependências:
```
$ cd webhook/
$ npm install 
```
4. Inicia o Servidor na porta 3000: `$ npm start`
5. Inicia o Ngrok expondo a porta 3000: `ngrok http 3000`
6. No DialogFlow > ⚡ Fulfillments > Webhook > Utilize a url https gerada pelo ngrok na rota `/webhook`

### Testes unitários

As funções dos fulfillments são cobertas por testes-unitários. Para rodar os testes:
```
$ cd webhook/
$ npm test
```

Test coverage:
```
$ cd webhook/
$ npm run test:coverage
```

## Tech Used
- DialogFlow ES
- NodeJS
- Express
- Mocha
- Sinon
