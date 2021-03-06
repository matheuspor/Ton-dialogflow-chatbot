// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const axios = require('axios');
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Image } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const webhook = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  const subscriptionObject = {
    'ton': 'Básico',
    'megaton': 'Mega',
    'gigaton': 'Giga',
    'ultraton': 'Ultra',
  };

  function chooseMachine(agent) {
    const subscriptionContext = agent.context.get('chooseplan-followup');
    const subscription = subscriptionContext.parameters.subscription ? subscriptionContext.parameters.subscription : agent.context.get('choosemachine-followup').parameters.requestedMachine.catalog;
    return axios.get(`https://api.lojastonemais.com.br/products?catalog=${subscription}`).then(({ data: { products } }) => {
      const machine = products.find((item) => subscription !== 'ton' ? item.name === `${agent.parameters.machine} ${subscriptionObject[subscription]}` : item.name === agent.parameters.machine);
      agent.context.set('choosemachine-followup', 2, { requestedMachine: machine });
      agent.add(subscription === 'ton' ? `Essa é a ${machine.name} ${subscriptionObject[subscription]}` : `Essa é a ${machine.name}`);
      agent.add(new Image(machine.img_url));
      agent.add(`As principais características dela são: ${machine.highlights.join(', ')}.` +
        `\nGostaria de saber o valor de adesão, prazo de entrega ou conhecer outras maquininhas?`);
    });
  }

  function chooseSubscription(agent) {
    const machineContext = agent.context.get('choosemachine-followup');
    const { subscription } = agent.parameters;
    const subscriptionType = subscriptionObject[subscription] ? subscriptionObject[subscription] : subscriptionObject[machineContext.parameters.requestedMachine.catalog];
    agent.add(`As maquininhas disponíveis nesse plano são: ` +
      `\nT1 ${subscriptionType} - A mais barata;` +
      `\nT1 Chip ${subscriptionType} - A que cabe no seu bolso com chip e Wi-Fi;` +
      `\nT2+ ${subscriptionType} - Pra você não ficar sem sinal;` +
      `\nT3 ${subscriptionType} - A mais completa. \nGostaria de conhecer melhor alguma delas?`);
  }

  function chooseSpec(agent) {
    const { requestedMachine, machine, specification } = agent.context.get('choosemachine-followup').parameters;
    const { catalog } = requestedMachine;
    const subscriptionType = subscriptionObject[catalog];
    const spec = requestedMachine[specification];
    const responseCard = new Card({
      title: `Clique no link abaixo!`,
      buttonText: `Peça a sua ${machine} ${subscriptionType} agora!`,
      buttonUrl: `https://www.ton.com.br/maquininha/${machine === 'T1 Chip' ? 't1-chip' : machine.toLowerCase()}`
    });
    let responseText = '';
    if (specification === 'shipping_time') {
      responseCard.setTitle(`A ${machine} ${subscriptionType} é entregue a você entre ${spec.min} e ${spec.max} dias úteis.`);
      responseText = 'Gostaria de saber mais alguma coisa?';
    } else if (specification === 'total_amount') {
      responseCard.setTitle(`O valor de adesão da ${machine} ${subscriptionType} é de R$ ${spec} e você pode parcelar em até 12x sem juros!`);
      responseText = 'Te ajudo em algo mais?';
    }
    agent.add(responseCard);
    agent.add(responseText);
  }

  function defaultFallback(agent) {
    agent.add('Possuímos 4 planos de taxas, são eles: Básico, MegaTon, GigaTon e UltraTon. Gostaria de conhecer as maquininhas de algum dos nossos planos?');
  }

  let intentMap = new Map();
  intentMap.set('Choose Subscription', chooseSubscription);
  intentMap.set('Choose Machine', chooseMachine);
  intentMap.set('Choose Machine - Previous', chooseSubscription);
  intentMap.set('Choose Machine - Choose Specification', chooseSpec);
  intentMap.set('Choose Machine - Previous - Default Fallback', defaultFallback);
  intentMap.set('Default Fallback Intent', defaultFallback);
  webhook.handleRequest(intentMap);
});