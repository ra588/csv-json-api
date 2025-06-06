# csv-json-api

A simple Node.js and Express REST API that reads data from a CSV file and returns it in JSON format.

---

## Setup Instructions

1. Open the terminal
2. Go to the project folder
3. Install dependencies:

```bash
npm install
```

4. Start the server

```bash
node server.js
```

## The API will be available at

```bash
http://localhost:3000
```

## Example Requests

Get all rows:

```bash
GET http://localhost:3000/api/data
```

Get first 8 rows:

```bash
GET http://localhost:3000/api/data?limit=8
```

## Example CSV file (data.csv)

```bash
id;name;age;email
1;Alice;28;alice@example.com
2;Bea;12;bea@example.com
```

## Example JSON response

```bash
{"id":"1","name":"Alice","age":"28","email":"alice@example.com "},
{"id":"2","name":"Bea","age":"12","email":"bea@example.com "}
```
