const AWS = require('aws-sdk');
const moment = require('moment');

AWS.config.apiVersions = {
  costexplorer: '2017-10-25',
};
AWS.config.region = 'us-east-1';

class CostExplorer {
  constructor() {
    this.costExplorer = new AWS.CostExplorer();
  }

  /**
   * fetch total cost
   * @param {String} start
   * @param {String} end
   * @returns {Object}
   */
  async fetchTotalCost(start, end) {
    const params = {
      TimePeriod: {
        End: end,
        Start: start,
      },
      Metrics: ['UnblendedCost'],
      Granularity: 'MONTHLY',
    };
    const response = this.costExplorer.getCostAndUsage(params).promise();
    const totalCost = {};
    try {
      totalCost.Total = response.ResultsByTime[0].Total.UnblendedCost.Amount;
    } catch (error) {
      throw new Error('can not parse total cost');
    }
    return totalCost;
  }

  /**
   * fetch serveral services costs
   * @param {String} start
   * @param {String} end
   * @returns {Object}
   */
  async fetchServicesCosts(start, end) {
    const params = {
      TimePeriod: {
        End: end,
        Start: start,
      },
      Metrics: ['UnblendedCost'],
      Granularity: 'MONTHLY',
      GroupBy: [
        {
          Key: 'SERVICE',
          Type: 'DIMENSION',
        },
      ],
    };

    const response = await this.costExplorer.getCostAndUsage(params).promise();
    console.log('response');
    console.log(response);
    const servisesCosts = {};
    try {
      response.ResultsByTime[0].Groups.forEach((element) => {
        servisesCosts[element.Keys[0]] = element.Metrics.UnblendedCost.Amount;
      });
    } catch (error) {
      throw new Error(`Cannot parse several services costs\n${error.message}`);
    }
    return servisesCosts;
  }

  /**
   * get current monthly cost
   * @param {String} eventTime
   */
  async getMonthlyCosts(eventTime) {
    const startOfCurrentMonth = moment(eventTime)
      .startOf('month')
      .format('YYYY-MM-DD');
    const endOfCurrentMonth = moment(eventTime)
      .endOf('month')
      .format('YYYY-MM-DD');
    const monthlySeveralCosts = this.parseSeveralCosts(
      await this.fetchServicesCosts(startOfCurrentMonth, endOfCurrentMonth),
    );
    const monthlyTotalCost = this.parseTotalCost(
      await this.fetchTotalCost(startOfCurrentMonth, endOfCurrentMonth),
    );
    return Object.assign(monthlySeveralCosts, monthlyTotalCost);
  }
}

module.exports = CostExplorer;
