const { IncomingWebhook } = require('@slack/client');
const CostExplorer = require('./lib/cost_explorer');

const url = process.env.SLACK_WEBHOOK_URL;

/**
 *
 * @param {Object} costs
 */
function formatMessage(costs) {
  const fields = [];
  const pow = 10 ** 2;
  Object.keys(costs).forEach((service) => {
    fields.push({
      title: service,
      valude: `${Math.floor(costs[service] * pow) / pow}USD`,
      short: true,
    });
  });
  const message = {
    channel: 'aws-general',
    userName: 'cost-watcher',
    iconEmoji: ':money_with_wings:',
    attachments: [
      {
        fallback: `The price of AWS this month is ${Math.floor(costs.Total * pow) / pow} USD`,
        pretext: 'The price of AWS this month is…',
        color: 'good',
        fields,
      },
    ],
  };
  return message;
}

exports.handler = async (event) => {
  const costExplorer = new CostExplorer();
  const webhook = new IncomingWebhook(url);

  let message;

  try {
    message = formatMessage(await costExplorer.getMonthlyCosts(event.time));
  } catch (error) {
    return error.message;
  }

  return webhook.send(message, (err, res) => {
    let response = '';
    if (err) {
      console.log('Error:', err);
      response = 'failed';
    } else {
      console.log('Message sent: ', res);
      response = 'post monthly cost successful';
    }
    console.log('response');
    console.log(response);
    return response;
  });
};
