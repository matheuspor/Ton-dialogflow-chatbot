const { assert, stub, restore } = require('sinon');
const { Image } = require('dialogflow-fulfillment');
const axios = require('axios');
const { chooseMachine, subscriptionObject } = require('../../server');

const mockAPIResponse = {
  data: {
    products: [{
      modifiers: {}, created_at: '2020-01-16T13:35:17.549Z', cashback_amount: '0.00', status: 'ACTIVE', workfinity: { equipment: 'BLUETOOTH', model: 'D180C BLUETOOTH' }, name: 'T1', max_quantity: 10, highlights: ['Conexão Bluetooth', 'Gestão e vendas no aplicativo', 'Comprovante via aplicativo e SMS'], updated_at: '2021-12-15T02:10:56.901Z', catalog: 'ton', amount: '34.80', img_url: 'https://assets.lojastonemais.com.br/images/products/TON_D150/medium.png', id: 'TON_D150', shipping_time: { max: 7, min: 3 }, title: 'A mais barata', quantity: 1, total_amount: '34.80', total_amount_without_offers: '34.80', amount_without_offers: '34.80',
    }, {
      modifiers: { simcards: ['vivo', 'tim', 'claro'] }, created_at: '2021-11-26T17:13:38.906Z', cashback_amount: '0.00', status: 'ACTIVE', workfinity: { equipment: 'BLUETOOTH-GPRS', model: 'D188' }, name: 'T1 Chip', max_quantity: 10, highlights: ['Conexão Wi-Fi e chip', 'Aceita pagamento por aproximação (NFC)'], updated_at: '2022-04-18T11:55:57.548Z', catalog: 'ton', amount: '94.80', img_url: 'https://assets.lojastonemais.com.br/images/products/TON_T1_CHIP/medium.png', id: 'TON_T1_CHIP', shipping_time: { max: 7, min: 3 }, title: 'A que cabe no seu bolso com chip e Wi-Fi', quantity: 1, total_amount: '94.80', total_amount_without_offers: '94.80', amount_without_offers: '94.80',
    }, {
      modifiers: {}, created_at: '2020-01-16T13:35:17.576Z', cashback_amount: '0', status: 'ACTIVE', name: 'Cartão pré-pago', max_quantity: 1, highlights: ['Bandeira Mastercard', 'Válido até para compras internacionais', 'Jeito fácil de usar o seu dinheiro', 'Disponivel apenas para CPF (CNPJ em breve)'], updated_at: '2021-08-13T01:25:04.090Z', catalog: 'ton', amount: '0', img_url: 'https://assets.lojastonemais.com.br/images/products/TON_PREPAID_CARD/medium.png', id: 'TON_PREPAID_CARD', shipping_time: { max: 20, min: 20 }, title: 'Para agilizar seu dia a dia', quantity: 1, total_amount: '0.00', total_amount_without_offers: '0.00', amount_without_offers: '0.00',
    }, {
      modifiers: { simcards: ['tim', 'vivo', 'microchip claro'] }, created_at: '2020-03-17T20:58:57.215Z', cashback_amount: '0.00', status: 'ACTIVE', workfinity: { equipment: 'MPOS', model: 'MP35' }, name: 'T2+', max_quantity: 10, highlights: ['Bateria com mais de 12 horas de duração', 'Conexão Wi-Fi e chip de dados', 'Aceita pagamento por aproximação (NFC)'], updated_at: '2022-06-24T01:47:00.475Z', catalog: 'ton', amount: '142.80', img_url: 'https://assets.lojastonemais.com.br/images/products/TON_D195/medium.png', id: 'TON_D195', shipping_time: { max: 10, min: 3 }, title: 'A mais prática', quantity: 1, total_amount: '142.80', total_amount_without_offers: '142.80', amount_without_offers: '142.80',
    }, {
      modifiers: { simcards: ['claro', 'tim', 'vivo'] }, created_at: '2020-01-16T13:35:17.251Z', cashback_amount: '0.00', status: 'ACTIVE', workfinity: { equipment: 'GPRS-WIFI', model: 'S920' }, name: 'T3', max_quantity: 10, highlights: ['Conexão Wi-Fi e Chip 3G', 'Gestão de vendas no aplicativo', 'Comprovante impresso'], updated_at: '2022-01-10T12:31:44.446Z', catalog: 'ton', amount: '238.80', img_url: 'https://assets.lojastonemais.com.br/images/products/TON_S920/medium.png', id: 'TON_S920', shipping_time: { max: 10, min: 3 }, title: 'A mais funcional', quantity: 1, total_amount: '238.80', total_amount_without_offers: '238.80', amount_without_offers: '238.80',
    }],
  },
};

describe('Test chooseMachine function', () => {
  beforeEach(() => {
    restore();
  });

  it('Test if function runs correctly in "chooseplan-followup" context', async () => {
    const addStub = stub().resolves();
    const axiosStub = stub(axios, 'get').resolves(mockAPIResponse);
    const getStub = stub().returns({
      parameters: {
        subscription: 'ton',
      },
    });
    const setStub = stub().returns();
    const agent = {
      parameters: {
        machine: 'T1',
      },
      context: {
        get: getStub,
        set: setStub,
      },
      add: addStub,
    };

    await chooseMachine(agent);

    assert.calledOnceWithMatch(getStub, 'chooseplan-followup');
    assert.calledWith(axiosStub, 'https://api.lojastonemais.com.br/products?catalog=ton');
    assert.calledWith(setStub, 'choosemachine-followup', 2, { requestedMachine: mockAPIResponse.data.products[0] });
    assert.calledWith(addStub, `Essa é a ${agent.parameters.machine} ${subscriptionObject.ton}`);
    assert.calledWith(addStub, new Image(mockAPIResponse.data.products[0].img_url));
    assert.calledWith(addStub, `As principais características dela são: ${mockAPIResponse.data.products[0].highlights.join(', ')}.`
      + '\nGostaria de saber o valor de adesão, prazo de entrega ou conhecer outras maquininhas?');
  });

  it('Test if function runs correctly in "choosemachine-followup" context', async () => {
    const addStub = stub().resolves();
    const axiosStub = stub(axios, 'get').resolves(mockAPIResponse);
    const getStub = stub().returns({
      parameters: {
        requestedMachine: {
          catalog: 'ton',
        },
      },
    });
    const setStub = stub().returns();
    const agent = {
      parameters: {
        machine: 'T1',
      },
      context: {
        get: getStub,
        set: setStub,
      },
      add: addStub,
    };

    await chooseMachine(agent);

    assert.calledWith(getStub, 'chooseplan-followup');
    assert.calledWith(getStub, 'choosemachine-followup');
    assert.calledWith(axiosStub, 'https://api.lojastonemais.com.br/products?catalog=ton');
    assert.calledWith(setStub, 'choosemachine-followup', 2, { requestedMachine: mockAPIResponse.data.products[0] });
    assert.calledWith(addStub, `Essa é a ${agent.parameters.machine} ${subscriptionObject.ton}`);
    assert.calledWith(addStub, new Image(mockAPIResponse.data.products[0].img_url));
    assert.calledWith(addStub, `As principais características dela são: ${mockAPIResponse.data.products[0].highlights.join(', ')}.`
      + '\nGostaria de saber o valor de adesão, prazo de entrega ou conhecer outras maquininhas?');
  });
});
