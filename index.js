const express = require("express");
const app = express();
const cors = require("cors");

//Server setup
app.use(cors());
app.use(express.json());

//Local libraries
const scraper = require("./scraper");

app.get("/", (req, res) => {
    res.send(":)");
});

app.put("/getMobileInfo", async (req, res) => {
    let phoneNumber = req.body.phoneNumber;

    let phoneData = await scraper.scrapeNumberInfo(phoneNumber);
    console.log(
        `Checked number ${phoneNumber}. Found provider: ${phoneData.provider}`
    );

    res.json(phoneData);
});

app.listen(8080, () => {
    console.log(`Example app listening on port 8080`);
});
