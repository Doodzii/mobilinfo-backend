const request = require("request");

let cookie =
    "_gcl_au=1.1.596399688.1675545588; _fbp=fb.1.1675545600695.1342119466; PHPSESSID=v7cg5v397abfabti6i46u59pr2";
let headers = {
    "Sec-Ch-Ua": '"Chromium";v="109", "Not_A Brand";v="99"',
    Accept: "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
    "Sec-Ch-Ua-Mobile": "?0",
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.120 Safari/537.36",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    Referer:
        "https://forms.evercall.dk/evercall.dk/signupForm/cellPhone/porting/",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "da-DK,da;q=0.9,en-US;q=0.8,en;q=0.7",
    Connection: "close",
    Cookie: cookie,
};

const scrapeNumberInfo = (number) => {
    return new Promise(async (resolve) => {
        request(
            {
                url: `https://forms.evercall.dk:443/evercall.dk/signupForm/cellPhone/porting/helpers/ajaxRequests.php?action=validateSignupFormPhoneNumberAndGetServiceOperators&phoneNumber=${number}&serviceTypeID=4`,
                headers: headers,
                method: "get",
            },

            (error, response, body) => {
                try {
                    //Error in request
                    if (error || response.statusCode != 200) {
                        resolve({
                            valid: false,
                            provider: null,
                        });
                        return;
                    }

                    let data = JSON.parse(body);
                    let isValid = data.validPhoneNumber;

                    //Number is invalid
                    if (!isValid) {
                        resolve({
                            valid: false,
                            provider: null,
                        });
                    }

                    let providerAmount = Object.keys(
                        data.serviceOperators
                    ).length;

                    //No providers in the list
                    if (providerAmount == 0) {
                        resolve({
                            valid: true,
                            provider: null,
                        });
                        return;
                    }

                    //Provider found!
                    let providerName =
                        data.serviceOperators[0].serviceOperatorName;
                    resolve({
                        valid: true,
                        provider: providerName,
                    });
                } catch (error) {
                    resolve({
                        valid: false,
                        provider: null,
                    });
                }
            }
        );
    });
};

module.exports = { scrapeNumberInfo };
