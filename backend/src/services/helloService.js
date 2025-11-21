const helloRepository = require('../repositories/helloRepository');

const getHelloMessage = () => helloRepository.fetchHelloMessage();

module.exports = { getHelloMessage };
