jest.mock('@slack/client');
jest.mock('../lib/cost_explorer');

const fs = require('fs');
const path = require('path');
const { IncomingWebhook } = require('@slack/client');
const CostExplorer = require('../lib/cost_explorer');
const { handler } = require('../index');

afterEach(() => {
  jest.clearAllMocks();
});


test('verifies successful response', async () => {
  IncomingWebhook.mockImplementation(() => ({
    send: async () => 'post monthly cost successful',
  }));

  const successfulResponse = fs.readFileSync(
    path.resolve(__dirname, './__fixtures__/getMonthlyCosts_successful.json'),
    'utf8',
  );
  CostExplorer.mockImplementation(() => ({
    getMonthlyCosts: async () => successfulResponse,
  }));

  const event = fs.readFileSync(
    path.resolve(__dirname, './__fixtures__/cloudwatch_scheduled_event.json'),
    'utf8',
  );

  const result = await handler(event);
  expect(result).toBe('post monthly cost successful');
});

test('verifies cost explorer failed', async () => {
  const event = fs.readFileSync(
    path.resolve(__dirname, './__fixtures__/cloudwatch_scheduled_event.json'),
    'utf8',
  );

  CostExplorer.mockImplementation(() => ({
    getMonthlyCosts: async () => {
      throw new Error('can not parse several services costs');
    },
  }));

  const result = await handler(event);
  expect(result).toBe('can not parse several services costs');
});
