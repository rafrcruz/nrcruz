const helloService = require('../services/helloService');

const getHello = (_req, res, next) => {
  try {
    const message = helloService.getHelloMessage();
    res.send(message);
  } catch (error) {
    next(error);
  }
};

module.exports = { getHello };
