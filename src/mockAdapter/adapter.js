var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onGet("/slots").reply(200, {
  slots: [
    ['a','b','c','d','e'],
    ['e','c','a','b','a'],
    ['a','d','b','c','d'],
    ['e','a','d','d','b']
  ],
});

axios.get("/slots").then(function (response) {
  console.log(response.data);
});

