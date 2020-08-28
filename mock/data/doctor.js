const mockjs = require('mockjs');
const Random = mockjs.Random;
const _ = require('lodash');

const { items } = mockjs.mock({
  'items|5-10': [
    {
      'id|+1': 1,
      'title|1': ['主任医生', '副主任医生'],
      'expertIn|1': ['牙齿修复', '拔牙'],
      name: '@cname',
      'hospitalName|1': ['西京医院', '人民医院', '省中医院'],
      departmentName: '口腔科',
      'privateSupport|1': [true, false],
      avatar: Random.image('200X200', '#fee', 'thumb1'),
      resume: {
        created: '2020/04/13 15:01:39',
        updated: '2020/04/27 17:55:44',
        id: 381,
        grade: '医师',
        profile:
          '口腔外科等常见多发病治疗，对根管治疗，牙周等有丰富治疗经验，同时擅长牙体缺损，缺失等进行冠、嵌体修复等，曾于解放军175医院口腔科进修学习，临床经验丰富',
        practiceExperience:
          '口腔外科等常见多发病治疗，对根管治疗，牙周等有丰富治疗经验，同时擅长牙体缺损，缺失等进行冠、嵌体修复等，曾于解放军175医院口腔科进修学习，临床经验丰富',
        academicExperience:
          '口腔外科等常见多发病治疗，对根管治疗，牙周等有丰富治疗经验，同时擅长牙体缺损，缺失等进行冠、嵌体修复等，曾于解放军175医院口腔科进修学习，临床经验丰富',
      },
      office: {
        id: 21,
        name: '厦门仁御口腔（钟宅店）',
        address: '钟宅五里15-110  国贸新天地西北门仁御口腔',
        phone: '18059846655',
        image:
          'http://ey-cdn.eyangmedia.com/venom/admin/test/8/15877253030ZmlsZQ==.png',
        lon: 134,
        lat: 12,
      },
    },
  ],
});
module.exports = {
  doctor_list: {
    code: 0,
    data: items,
  },
  sync_docotr: {
    code: 0,
  },
  doctor_detail: {
    code: 0,
    data: items[0],
  },
  doctor_update: () => {
    const id = _.last(items).id + 1;
    items.push({ ...items[0], id });
    return {
      code: 0,
      data: { id },
    };
  },
  doctor_del: () => {
    items.splice(0, 1);
    return {
      code: 0,
    };
  },
  upload_image: {
    code: 0,
    data: {
      url: Random.image('200X200', '#fee', 'thumb1'),
    },
  },
  doctor_resume: {
    code: 0,
    data: _.last(items)['resume'],
  },
  update_doctor_resume: {
    code: 0,
  },
  doctor_schedule: {
    code: 0,
    data: [
      { day: 0, startTime: '8:30' },
      { day: 0, startTime: '9:30' },
      { day: 1, startTime: '8:30' },
      { day: 1, startTime: '9:30' },
      { day: 1, startTime: '10:30' },
      { day: 1, startTime: '11:30' },
    ],
  },
  update_doctor_schedule: {
    code: 0,
  },
};
