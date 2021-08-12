const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceValue = (unchangedValue, changedValue) => {
    let dataChanged = unchangedValue.replace("{%tempval%}", changedValue.main.temp);
    dataChanged = dataChanged.replace("{%tempmin%}", changedValue.main.temp_min);
    dataChanged = dataChanged.replace("{%tempmax%}", changedValue.main.temp_max);
    dataChanged = dataChanged.replace("{%location%}", changedValue.name);
    dataChanged = dataChanged.replace("{%country%}", changedValue.sys.country);
    return dataChanged;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Jammu&units=metric&appid=f19515ccea6394387690cc3a08440e8b", ).on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // console.log(arrData[0].main.temp);
                const actualData = arrData.map((value) => replaceValue(homeFile, value)).join("");
                // console.log(actualData);
                // res.writeHead(200, {
                //     "Content-Type": "text/html",
                // });
                res.write(actualData);

            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                console.log('end');
                res.end();
            });
    } else {
        res.writeHead(404, {
            "Content-Type": "text/html",
        });
        res.write("<h1>Error : 404 File Not Found</h1>");
        console.log(req.url);
        res.end();
    }
});



server.listen(1000, () => {
    console.log("Server listening.... at 1000");
});

