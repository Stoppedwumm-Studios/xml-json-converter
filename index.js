const express = require("express")
const app = express()
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser")
const parser = new XMLParser()

const axios = require('axios');

async function getXmlResponse(url) {
    try {
      const response = await axios.get(url, {
        headers: {
        },
      });
  
      // Return the XML response
      return response.data;
    } catch (error) {
      console.error('Error making HTTP request:', error.message);
  
      // Return an error response
      return '<error><message>Internal Server Error</message></error>';
    }
  }


app.get("/", (req,res) => {
    res.send("<h1>The API is at /api/, use ?data=YourData</h1>")
})

app.get("/api/", (req, res) => {
    const bigdata = req.query.data
    const urldata = req.query.dataurl
    
    console.log(urldata)
    console.log(bigdata)

    if (urldata === undefined) {
      res.send("No data provided");
  } else {
      const xmlResponse = getXmlResponse(urldata);
      xmlResponse.then((funny) => {
        console.log(funny)
        res.send(JSON.stringify(parser.parse(funny)));
      })
  }
})

app.listen(3000, () => {
    console.log("Online")
})

module.exports = app