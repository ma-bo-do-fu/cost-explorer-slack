const { IncomingWebhook } = require('@slack/client');
const { CostExplorer } = require('./lib/cost_explorer');
const { Slack } = require('./lib/slack');

const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

exports.handler = async () => {
  const costExplorer = new CostExplorer();
  const slack = new Slack();
  const monthlyCost = costExplorer.getMonthlyCosts();
  const message = slack.formatMonthlyCost(monthlyCost);
  await webhook.send(message, (err, res) => {
    let lambdaResponse = '';
    if (err) {
      console.log('Error:', err);
      lambdaResponse = 'failed';
    } else {
      console.log('Message sent: ', res);
      lambdaResponse = 'post monthly cost successful';
    }
    return lambdaResponse;
  });
};
