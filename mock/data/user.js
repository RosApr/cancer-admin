const users = [
  {
    id: 1,
    account: 'admin',
    role: 'admin',
    introduction: 'I am a super administrator',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    password: '111',
  },
  {
    id: 2,
    account: 'operator',
    role: 'operator',
    introduction: 'I am an Operator',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Operator',
    password: '111',
  },
];

module.exports = {
  login: req => {
    return {
      code: 0,
      data: {
        token: 'aaa',
        userId: '123123',
      },
    };
  },
  userlist: {
    code: 0,
    data: users,
  },
  update_user: req => {
    const { user } = req;
    const index = users.findIndex(u => u.id === user.id);
    if (index > 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    return {
      code: 0,
    };
  },
  user_detail: {
    code: 0,
    data: users[0],
  },
  logout: {
    code: 0,
  },
};
