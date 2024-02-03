const express = require("express")
const app = express()
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser")
const parser = new XMLParser()
const { inject } = require('@vercel/analytics')

const axios = require('axios');
const { dirname } = require("path");

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
    res.send(`<h1>The API is at /api/, use ?data=YourData</h1><script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    console.log("Analytics should run")
  </script>
  <script defer src="/_vercel/insights/script.js"></script>`)
})

app.get("/info", (req,res) => {
  res.send(`<h1 align="center">A neat xml to json converter</h1>
  <p align="center">Do you have a framework that hasn't a xml parser</p>
  <p align="center">Yeah, that was mine too, so I've deployed this one</p>
  <h2 align="center">How to use this?</h2>
  <p align="center"><b>TWO</b> ways</p>
  <p align="center">URL and raw data</p>
  <p align="center">Encode the xml data and put it into https://xml-json-converter.vercel.app/api?data= at the end.</p>
  <p align="center">Boom, raw data</p>
  <p align="center">Second, get the url (has to be accessible as a normal get request), and put it into https://xml-json-converter.vercel.app/api?dataurl= at the end.
  <p align="center">And thats it!</p>
  <script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  console.log("Analytics should run")
  </script>
  <script defer src="/_vercel/insights/script.js"></script>`)
})

app.get("/redirect", (req, res) => {
  res.redirect(req.query.url)
})

app.get("/github", (req,res) => {
  res.sendFile(__dirname + "/github.html")
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

inject()

module.exports = app