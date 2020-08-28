const mockjs = require("mockjs");

const { items } = mockjs.mock({
    'items|10': [{
        'id|+1': 1,
        name: '@canme',
        'gender|1': ['男', '女'],
        weight: '65kg',
        allergies: '无',
        medicalHistory: '感冒',
    }]
})

module.exports = {
    code: 0,
    data: {
        items,
        total: items.length
    }
}