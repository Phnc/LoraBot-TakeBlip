const https = require("https");

/**
 * Options to be used in the requisition to the github API
 */
const options = {
  hostname: "api.github.com",
  path:
    "/orgs/takenet/repos?per_page=5&sort=created&direction=asc&language=c%23",
  method: "GET",
  headers: {
    "User-Agent": "Phnc",
  },
};

/**
 * Receives the response from the github API as a parameter
 * Returns a JSON formatted in a way to fit the items of a dynamic content block in the blip builder
 */
const formatJSON = (form) => {
  formatted = form.map((elem) => {
    let obj = {
      header: {
        type: "application/vnd.lime.media-link+json",

        value: {
          title: elem.name,
          text: elem.description,
          type: "image/jpeg",
          uri: elem.owner.avatar_url,
        },
      },
    };
    return obj;
  });

  return formatted;
}

module.exports = function (app) {
  app.get("/repositories", (req, res) => {
    https.get(options, (resp) => {
      let data = "";

      /**
       * While receiving chunks of data, keep appending to the variable which will hold the response
       */
      resp.on("data", (chunk) => {
        data += chunk;
      });

      /**
       * When done receiving the chunks of data, format the response to an adequate result
       * In this case, the result is formatted to fit the dynamic content block in the blip builder
       */
      resp.on("end", () => {
        form = JSON.parse(data);

        formatted = formatJSON(form);

        let content = {
          itemType: "application/vnd.lime.document-select+json",

          items: formatted,
        };

        res.send(content);
      });

      resp.on("error", (err) => {
        console.log(err);
      });
    });
  });
};
