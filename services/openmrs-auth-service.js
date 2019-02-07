const rp = require('request-promise');
const config = require('../config/config');
module.exports = {
    authenticate: function (auth) {
        return rp(`${config.openmrs_base_url}/ws/rest/v1/session`, {
            headers: {
                "Authorization": auth
            }
        })
            .then(function (result) {
                const resultObject = JSON.parse(result);
                if (resultObject && resultObject.authenticated) {
                    return resultObject.user;
                }
                return false;
            });
    }
};