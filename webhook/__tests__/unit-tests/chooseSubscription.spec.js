const sinon = require('sinon');
const { chooseSubscription, subscriptionObject } = require('../../server');

beforeEach(() => {
  sinon.restore();
});

const subscriptionPlans = ['ton', 'megaton', 'gigaton', 'ultraton'];

describe('Test chooseSubscription function', () => {
  it('Test if function runs when parameter is passed and context is empty', () => {
    subscriptionPlans.forEach((plan) => {
      const addStub = sinon.stub().resolves();
      const getStub = sinon.stub().returns();
      const agent = {
        context: {
          get: getStub,
        },
        parameters: {
          subscription: plan,
        },
        add: addStub,
      };
      chooseSubscription(agent);
      sinon.assert.calledWith(getStub, 'choosemachine-followup');
      sinon.assert.calledWith(addStub, 'As maquininhas disponíveis nesse plano são: '
        + `\nT1 ${subscriptionObject[plan]} - A mais barata;`
        + `\nT1 Chip ${subscriptionObject[plan]} - A que cabe no seu bolso com chip e Wi-Fi;`
        + `\nT2+ ${subscriptionObject[plan]} - Pra você não ficar sem sinal;`
        + `\nT3 ${subscriptionObject[plan]} - A mais completa. \nGostaria de conhecer melhor alguma delas?`);
    });
  });

  it('Test if function runs when parameter is empty and context is passed', () => {
    subscriptionPlans.forEach((plan) => {
      const addStub = sinon.stub().resolves();
      const getStub = sinon.stub().returns({
        parameters: {
          requestedMachine: {
            catalog: plan,
          },
        },
      });
      const agent = {
        context: {
          get: getStub,
        },
        parameters: {
          subscription: '',
        },
        add: addStub,
      };
      chooseSubscription(agent);
      sinon.assert.calledWith(getStub, 'choosemachine-followup');
      sinon.assert.calledWith(addStub, 'As maquininhas disponíveis nesse plano são: '
        + `\nT1 ${subscriptionObject[plan]} - A mais barata;`
        + `\nT1 Chip ${subscriptionObject[plan]} - A que cabe no seu bolso com chip e Wi-Fi;`
        + `\nT2+ ${subscriptionObject[plan]} - Pra você não ficar sem sinal;`
        + `\nT3 ${subscriptionObject[plan]} - A mais completa. \nGostaria de conhecer melhor alguma delas?`);
    });
  });
});
