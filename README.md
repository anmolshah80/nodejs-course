## Node.js Course

- Modules in Node.js
- File handing in Node.js
- Build HTTP server in Node.js
- Get started with Express and Node.js
- Build REST APIs using Node.js and Express
- Express Middleware
- What are HTTP Headers in an API
- HTTP Status Codes
- Getting Started with MongoDB
- Connecting Node.js with MongoDB | Mongoose + Express
- Model View Controller in Node.js | MVC Pattern
- Create a custom URL shortener using Node.js and MongoDB
- Server Side Rendering with EJS and Node.js
- Building Node.js Authentication from Scratch
- Cookies and Authorization header in Node.js
- Authorization in Node.js

## Notes

- [Deploy a Node Express App on Render](https://render.com/docs/deploy-node-express-app)

- [Using middleware (express)](https://expressjs.com/en/guide/using-middleware.html)

- [The HTTP Request Headers List](https://thevalleyofcode.com/http-request-headers/)

- [How to read environment variables from Node.js](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)

- [Load environment variables from the `.env` file into `process.env`](https://www.npmjs.com/package/dotenv)

- [Load static assets in Node.js](https://stackoverflow.com/questions/32303460/loading-static-assets-in-nodejs/32303676#32303676)

### Error

- Error formatting document
- Unexpected character "EOF" (Do you have an unescaped "{" in your template? Use "{{ '{' }}") to escape it.)

### Fix

- Tell Prettier to treat `.ejs` as HTML (recommended)
- Create a `.prettierrc` in your project root:

```json
{
  "overrides": [
    {
      "files": "*.ejs",
      "options": {
        "parser": "html"
      }
    }
  ]
}
```

- Then reload VS Code and format again.

### Quick Sanity Checklist

- After adding `.prettierrc`:
  - Reload VS Code
  - Open home.ejs
  - Run Format Document
  - Parser should now be `html`, not `angular`
- [GitHub Gist](https://gist.github.com/anmolshah80/cabacdc81ac6f315887da10efcea7834)
