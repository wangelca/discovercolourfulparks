const axios = require('axios');
const { Suite } = require('benchmark');

const baseUrl = 'http://localhost:3000';

const endpoints = ['/parks', '/events', '/spots'];

const suite = new Suite();

endpoints.forEach(endpoint => {
  suite.add(`GET ${endpoint}`, {
    defer: true,
    fn: async (deferred) => {
      try {
        const response = await axios.get(`${baseUrl}${endpoint}`);
        console.log(`Status for ${endpoint}: ${response.status}`);
        deferred.resolve();
      } catch (error) {
        console.error(`Error on ${endpoint}: ${error.message}`);
        deferred.reject(error);
      }
    }
  });
});

suite.on('cycle', (event) => {
  console.log(String(event.target));
}).on('complete', () => {
  console.log('Performance test completed.');
});

suite.run({ async: true });

