const { handler } = require('../../index');

beforeEach(()=>{
//stub slack and costexplorer
});

afterEach(()=>{
//restore slack and costexplorer
});

test('verifies successful response', async () => {
  const event = testevent;
  const result = await handler(event);
  expect(result).toBe(expectedResponse);
});
