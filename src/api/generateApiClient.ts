// @ts-ignore
const {generateApi} = require('swagger-typescript-api');
const path = require("path");
const fs = require("fs");

/* NOTE: all fields are optional expect one of `output`, `url`, `spec`
* https://github.com/acacode/swagger-typescript-api*/

generateApi({
    name: "starskyApi.ts",
    output: path.resolve(process.cwd(), "./src/api/__generated__"),
    url: 'http://localhost:8080/api/v3/api-docs',
    httpClientType: "fetch"
})
    .then((files: { content: string; name: string; }[]) => {
        files.forEach(({content, name}) => {
            fs.writeFile(name, content, (err: any) => console.error(err));
        });
    })
    .catch((e: any) => console.error(e))