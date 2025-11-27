const helloService = require('./hello.service');

const getHello = async (_req, res) => {
  const message = await helloService.getHelloMessage();
  res.send(message);
};

module.exports = { getHello };
