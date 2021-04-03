var express = require('express');
var router = express.Router();
var moment = require('moment-timezone')

var lib = require(process.cwd() + '/lib/Tiktok')
var fs = require('fs')
var needle = require('needle')
var DB = require(process.cwd() + '/database/index')

var options = {
    headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36",
        "referer": "https://www.tiktok.com/",
        "cookie": "tt_webid_v2=689854141086886123"
    }
}

/* GET home page. */
router.post('/tiktok', async (req, res, next) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    var OPTIONS = { date: moment().tz('Asia/Jakarta'), ip: ip }

    await DB.insert(OPTIONS)

    let url = req.body.url
    if (!url) res.json({ status: 400, message: 'input a paramater url.' })

    lib.Tiktok(url).then(resp => {
        var path = `${moment().tz('Asia/Jakarta').format('YYYYMMDD_HHMMss')}.mp4`
        var data = fs.createWriteStream(process.cwd() + '/public/videos/' + path)
        var link = process.cwd() + '/public/videos/' + path

        needle.get(resp.collector[0].videoUrl, options).pipe(data).on('finish', () => {
            console.log('success')
            res.json({ status: 200, data: { link: 'http://' + link.replace(process.cwd(), req.headers.host).replace('/public', '')  } })
        }).on('error', d => console.log(d))

    }).catch(e => {})
})

router.get('/dbcount', async (req, res, next) => {
    DB.count({}, (e, data) => {
        res.json({ status: 200, count: data })
    })
})

router.get('/dbfetch', async (req, res, next) => {
    DB.find({}, (e, data) => {
        res.json({ status: 200, data: data })
    })
})

module.exports = router;