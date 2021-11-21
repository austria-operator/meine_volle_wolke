/* hi, dies ist ein kleines programm dass den Nextcloudlink der FPÖ mit ddg image results vollspammen kann
// 
// Was man braucht: nodejs, npm, bash, internet, keine Mitglidschaft in der FPÖ
//
// wie man installiert:
// - diese datei in einen ordner herunterladen
// - diesen Ordner im Terminal öffnen
// - Ausführen: "npm init" (einfach überall einter drücken)
// - Ausführen: "npm add ddgimages-node"
// - Ausführen: "node index.js" (oder wie auch immer die datei bei euch heißt) 
//
// fertig installiert, nun nur noch ausführen:
// node index.js <rounds> <searchterm...>
// rounds - anzahl an bildern die man hochlät
// searchterm... nach was gesucht werden soll (alles danach ist auch searchterm)
// ---
// beispiele:
// node index.js 10 FPÖ nazis		- sucht nach "FPÖ nazis"	und nimmt die obersten 10 Bilder
// node index.js 40 corona virus	- sucht nach "corona virus"	und nimmt die obersten 40 Bilder
//
// ich empfehle euch eine VPN oder noch besser TOR zu nutzen, dass man nicht zurückverfolgt wird.
//
// dieses Programm läuft nur auf Linux mit bash installiert (wahrscheinlich auch auf minGW aber seht selbst)
// für minGW muss die datei "./cloudsend.sh" angepasst werden.
//
// Viel Spaß, aus DE!
// ---
// natürlich dürft ihr die datei bearbeiten und weiter verbreiten
// LICENSE: public-domain
// ---
// ich als Autor will (aus rechtlichen Gründen) unbekannt bleiben, danke!
//
// fun facts:
// - hab gedacht die Partei heist ÖVP
// - dieses Programm ist nicht gut geschrieben
*/

import fs from "fs"
import ddimg from "ddgimages-node"
import http from "http"
import https from "https"
import util from 'util'
import {
    exec as _exec
} from "child_process"
const exec = util.promisify(_exec);


// config:
const ul = "https://meinewolke.fpoe-klub.at/s/ycMtLXi7aEKQk3L"
const uploader = "cloudsend.sh <file> " + ul
const delay = 5000 //ms (1000ms = 1s)
const tmpdir = "/tmp" // temp str for pictures
var image_count = 0
var running = true
var searchterm = process.argv[2]
for (let i = 0; i < process.argv.length - 3; i++) {
    searchterm += " " + process.argv[i + 3]
}

const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const downloadFile = (url: any): Promise < string > => {
    console.log(`[DOWNLOAD] results: ${url}`)

    let client: typeof http | typeof https = https;
    if (url.includes('http://')) client = http;
    // usefull for testing but not for running (cuz filenames are visible to uploader)
    // let path = `${tmpdir}/${searchterm}-${i}.jpg` // lets guess * is a jpg / jpeg 
    // generate plausible file names based on phone filenametype "IMG_YYYYMMDD_HHMMSS"
    // random date between Friday (7:00) & an hour ago:
    let time = Math.floor(Math.random() * (Date.now() / 1000 - 1637303408)) + 1637303408; // 
    let d = new Date(time * 1000)
    let path = `${tmpdir}/IMG_2021${(d.getMonth()+1).toString().padStart(2,'')}${d.getDate().toString().padStart(2,'')}_${d.getHours().toString().padStart(2,'')}${d.getMinutes().toString().padStart(2,'')}${d.getSeconds().toString().padStart(2,'')}.jpg`

    let data = Buffer.from('');

    // download picture:
    return new Promise((resolve, reject) => {
        client.get((url), (res: http.IncomingMessage) => {
            res.on("data", (d) => {
                data = Buffer.concat([data, d], (data.length + d.length))
            })
            res.on("end", () => {
                // TODO: generate metatata for picture

                console.log(`[DOWNLOAD] downloaded picture! storing in ${path}`)
                fs.writeFileSync(path, data)
                resolve(path)
            })
        }).on("error", (e) => {
            reject(e)
        })
    })

}

const spam = async (url: string) => {
    console.log(`[SEARCH] searchingfor "${searchterm}"`)

    console.log(`[SEARCH] results: ${url}`)
    let path = await downloadFile(url)
    let cmd = uploader.replace("<file>", path)

    console.log(`[UPLOAD] starting uploading process with command "${cmd}"`)
    await exec(cmd)
    console.log(`[UPLOAD] uploaded file "${path}" to ${ul}`)
    fs.unlinkSync(path)
    console.log(`[DELETE] deleted file "${path}"`)

    return
}


(async () => {
    if (!searchterm) {
        console.log("Usage: index.js <searchterm...>")
        process.exit()
    }

    console.log(`[CONF] uploading dest: "${ul}"`)
    console.log(`[CONF] search term:    "${searchterm}"`)

    let images = await ddimg.search(searchterm)

    while (running) {
        console.log(`[ROUND] ${image_count + 1}`)

        if (image_count >= images.length) {
            image_count = 0
            images = await ddimg.search(searchterm)
        }

        spam(images[image_count].image).catch((err) => console.error(err))
        await sleep(delay)

        image_count++

    }
})();