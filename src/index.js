const { IncomingWebhook } = require('@slack/client');
const { CostExplorer } = require('./lib/cost_explorer');

const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

function formatMonthlyCost(){

}

exports.handler = async () => {
  const costExplorer = new CostExplorer();
  const monthlyCost = costExplorer.getMonthlyCosts();
  const message = formatMonthlyCost(monthlyCost);
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
