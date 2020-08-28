const mockjs = require('mockjs');
const Random = mockjs.Random;
const _ = require('lodash');

const { items } = mockjs.mock({
  'items|5-10': [
    {
      'id|+1': 1,
      address: '钟宅五里15-110  国贸新天地西北门仁御口腔',
      image: Random.image('200X200', '#fee', 'thumb1'),
      lat: '@natural',
      lon: '@natural',
      name: '厦门仁御口腔（钟宅店）',
      phone: '@phone',
    },
  ],
});
module.exports = {
  office_list: {
    code: 0,
    data: items,
  },
  office_detail: {
    code: 0,
    data: items[0],
  },
  office_update: {
    code: 0,
  },
};
