var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://trackapi.nutritionix.com/v2/natural/nutrients',
  'headers': {
    'Content-Type': 'application/json',
    'x-app-id': 'e331f5d5',
    'x-app-key': '05ede4a4efa5d6b403d96a9b3910b71e'
  },
  body: JSON.stringify({
    "query": "grape"
  })
}


console.log(request(options));
