const AWS = require('aws-sdk-mock');
const fs = require('fs');
const path = require('path');
const CostExplorer = require('../lib/cost_explorer');

describe('fetchServicesCosts()', () => {});

beforeEach(() => {});

afterEach(() => {
  jest.clearAllMocks();
  AWS.restore();
});

test('fetchServicesCosts() success', async () => {
  const successfulResponse = fs.readFileSync(
    path.resolve(__dirname, './__fixtures__/getCostAndUsage_services_successful.json'),
    'utf8',
  );
  AWS.mock('CostExplorer', 'getCostAndUsage', async () => JSON.parse(successfulResponse));

  const fetchServicesCostsSuccess = fs.readFileSync(
    path.resolve(__dirname, './__fixtures__/fetchServicesCosts_successful.json'),
    'utf8',
  );
  const costExplorer = new CostExplorer();
  const time = '2018-07-12T03:44:44Z';
  const result = await costExplorer.fetchServicesCosts(time, time);
  expect(result).toEqual(JSON.parse(fetchServicesCostsSuccess));
});

test('fetchServicesCosts() failed', async () => {
  AWS.mock('CostExplorer', 'getCostAndUsage', async () => ({ test: 'test' }));

  const costExplorer = new CostExplorer();
  const time = '2018-07-12T03:44:44Z';
  // expect(async () => costExplorer.fetchServicesCosts(time, time)).toThrow();
});
