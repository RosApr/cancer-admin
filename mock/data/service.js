const mockjs = require('mockjs');
const Random = mockjs.Random;
const _ = require('lodash');

const { items } = mockjs.mock({
  'items|5-10': [
    {
      'id|+1': 1,
      'name|1': ['常规检查', '口腔洁治'],
    },
  ],
});
module.exports = {
  service_list: {
    code: 0,
    data: items,
  },
  service_update: {
    code: 0,
  },
  service_detail: {
    code: 0,
    data: items[0],
  },
};
