const helloRepository = require('./hello.repository');

const getHelloMessage = () => helloRepository.fetchHelloMessage();

module.exports = { getHelloMessage };
