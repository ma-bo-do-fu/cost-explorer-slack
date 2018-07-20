const AWS = require('aws-sdk');
const moment = require('moment');

AWS.config.apiVersions = {
    costexplorer: '2017-10-25'
};
AWS.config.region = 'us-east-1';

class CostExplorer {
  fetchServicesCosts(){

  }
  fetchTotalCost(){

  }
  parseCost(){
    return 'message';
  }
}

module.exports = CostExplorer;
