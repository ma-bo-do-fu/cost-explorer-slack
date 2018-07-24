const { IncomingWebhook } = require('@slack/client');

const url = 'hoge';
const webhook = new IncomingWebhook(url);
