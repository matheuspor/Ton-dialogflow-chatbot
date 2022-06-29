const sinon = require('sinon');
const { Card } = require('dialogflow-fulfillment');
const { chooseSpec } = require('../../server');

beforeEach(() => {
  sinon.restore();
});

const mockMachine = {
  modifiers: {}, created_at: '2020-01-16T13:35:17.549Z', cashback_amount: '0.00', status: 'ACTIVE', workfinity: { equipment: 'BLUETOOTH', model: 'D180C BLUETOOTH' }, name: 'T1', max_quantity: 10, highlights: ['Conexão Bluetooth', 'Gestão e vendas no aplicativo', 'Comprovante via aplicativo e SMS'], updated_at: '2021-12-15T02:10:56.901Z', catalog: 'ton', amount: '34.80', img_url: 'https://assets.lojastonemais.com.br/images/products/TON_D150/medium.png', id: 'TON_D150', shipping_time: { max: 7, min: 3 }, title: 'A mais barata', quantity: 1, total_amount: '34.80', total_amount_without_offers: '34.80', amount_without_offers: '34.80',
};

describe('Test chooseSpec function', () => {
  it('Test if function runs correctly when specification is "shipping_time"', async () => {
    const addStub = sinon.stub().resolves();
    const getStub = sinon.stub().returns({
      parameters: {
        specification: 'shipping_time',
        machine: 'T1',
        requestedMachine: mockMachine,
      },
    });
    const agent = {
      context: {
        get: getStub,
      },
      add: addStub,
    };
    chooseSpec(agent);
    sinon.assert.calledOnceWithMatch(getStub, 'choosemachine-followup');
    sinon.assert.calledWith(addStub, new Card({
      title: `A T1 Básico é entregue a você entre ${mockMachine.shipping_time.min} e ${mockMachine.shipping_time.max} dias úteis.`,
      buttonText: 'Peça a sua T1 Básico agora!',
      buttonUrl: 'https://www.ton.com.br/maquininha/t1',
    }));
    sinon.assert.calledWith(addStub, 'Gostaria de saber mais alguma coisa?');
  });
  it('Test if function runs correctly when specification is "total_amount"', async () => {
    const addStub = sinon.stub().resolves();
    const getStub = sinon.stub().returns({
      parameters: {
        specification: 'total_amount',
        machine: 'T1',
        requestedMachine: mockMachine,
      },
    });
    const agent = {
      context: {
        get: getStub,
      },
      add: addStub,
    };
    chooseSpec(agent);
    sinon.assert.calledOnceWithMatch(getStub, 'choosemachine-followup');
    sinon.assert.calledWith(addStub, new Card({
      title: `O valor de adesão da T1 Básico é de R$ ${mockMachine.total_amount} e você pode parcelar em até 12x sem juros!`,
      buttonText: 'Peça a sua T1 Básico agora!',
      buttonUrl: 'https://www.ton.com.br/maquininha/t1',
    }));
    sinon.assert.calledWith(addStub, 'Te ajudo em algo mais?');
  });
});
