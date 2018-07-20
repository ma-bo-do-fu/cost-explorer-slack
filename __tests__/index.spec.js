const { handler } = require('../../index');
const fs = require('fs');
const path = require('path');
const { IncomingWebhook } = require('@slack/client');
const CostExplorer = require('../src/lib/cost_explorer');
jest.mock('../src/lib/cost_explorer');
jest.mock('@slack/client');

describe('verifies successful response', () => {
    beforeEach(() => {
        //stub slack and costexplorer
        CostExplorer.mockClear();

    });

    afterEach(() => {
        //restore slack and costexplorer
    });

    test('verifies successful response', async () => {
        const event = fs.readFileSync(path.resolve(__dirname, './__tests__/__fixtures__/cloudwatch_scheduled_event.json'), 'utf8');
        const result = await handler(event);
        expect(result).toBe('post monthly cost successful');
    });
});

test('verifies failed response', async () => {
    const event = fs.readFileSync(path.resolve(__dirname, './__tests__/__fixtures__/cloudwatch_scheduled_event.json'), 'utf8');
    const result = await handler(event);
    expect(result).toBe('failed');
});
