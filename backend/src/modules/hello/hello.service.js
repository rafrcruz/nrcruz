const helloRepository = require('./hello.repository');

const getHelloMessage = async () => helloRepository.fetchHelloMessage();

module.exports = { getHelloMessage };
