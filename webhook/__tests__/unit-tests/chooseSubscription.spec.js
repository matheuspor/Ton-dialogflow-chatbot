const { restore, assert, stub } = require('sinon');
const { chooseSubscription, subscriptionObject } = require('../../server');

const subscriptionPlans = ['ton', 'megaton', 'gigaton', 'ultraton'];

describe('Test chooseSubscription function', () => {
  beforeEach(() => {
    restore();
  });

  it('Test if function runs when parameter is passed and context is empty', () => {
    subscriptionPlans.forEach((plan) => {
      const addStub = stub().resolves();
      const getStub = stub().returns();
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

      assert.calledOnceWithMatch(getStub, 'choosemachine-followup');
      assert.calledOnceWithMatch(addStub, 'As maquininhas disponíveis nesse plano são: '
        + `\nT1 ${subscriptionObject[plan]} - A mais barata;`
        + `\nT1 Chip ${subscriptionObject[plan]} - A que cabe no seu bolso com chip e Wi-Fi;`
        + `\nT2+ ${subscriptionObject[plan]} - Pra você não ficar sem sinal;`
        + `\nT3 ${subscriptionObject[plan]} - A mais completa. \nGostaria de conhecer melhor alguma delas?`);
    });
  });

  it('Test if function runs when parameter is empty and context is passed', () => {
    subscriptionPlans.forEach((plan) => {
      const addStub = stub().resolves();
      const getStub = stub().returns({
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

      assert.calledOnceWithMatch(getStub, 'choosemachine-followup');
      assert.calledOnceWithMatch(addStub, 'As maquininhas disponíveis nesse plano são: '
        + `\nT1 ${subscriptionObject[plan]} - A mais barata;`
        + `\nT1 Chip ${subscriptionObject[plan]} - A que cabe no seu bolso com chip e Wi-Fi;`
        + `\nT2+ ${subscriptionObject[plan]} - Pra você não ficar sem sinal;`
        + `\nT3 ${subscriptionObject[plan]} - A mais completa. \nGostaria de conhecer melhor alguma delas?`);
    });
  });
});
