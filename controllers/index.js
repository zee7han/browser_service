const {exec} = require("child_process")
const osascript = require('node-osascript');
const conf = require("../config")

const allowed_browser = ["firefox", "chrome"]
let UrlQueues = {
    "firefox": [],
    'chrome': []
}

module.exports.start = (req,res) =>{
    let inputBrowser = req.query.browser ? req.query.browser : null
    let urlToOpen = req.query.url ? req.query.url: null

    if(!inputBrowser || !urlToOpen || !allowed_browser.includes(inputBrowser)){
        return res.status(400).send({
            message: "Bad Request"
        })
    } else {
        let command = ""
        switch(process.platform){
            case "Win32":
                command = "start"
                break;
            case "darwin":
                command = "open"
                break;
            default:
                command = "xdg-open"
                break;
        }
        let commandToExecute = `${command} -a ${inputBrowser} ${urlToOpen}`
        if(process.platform === "darwin" && inputBrowser === "chrome"){
            commandToExecute = `open -a "Google Chrome" ${urlToOpen}`
        }

        let sp = exec(commandToExecute)

        UrlQueues[inputBrowser].push(urlToOpen)

        return res.status(200).send({
            message: `${inputBrowser} start successfully`
        })
    }
}

module.exports.stop = (req,res) =>{
    let inputBrowser = req.query.browser ? req.query.browser : null

    if(!inputBrowser || !allowed_browser.includes(inputBrowser)){
        return res.status(400).send({
            message: "Bad Requet"
        })
    } else {
        let command = ""
        switch(process.platform){
            case "Win32":
                command = `TASKLIST | grep ${inputBrowser}`
                break;
            case "darwin":
                command = `killall ${inputBrowser}`
                break;
            default:
                command = `killall ${inputBrowser}`
                break;
        }

        if(process.platform === "darwin" && inputBrowser === "chrome"){
            command = `killall "Google Chrome"`
        }
        
        let sp = exec(command)
        UrlQueues[inputBrowser] = []
        return res.status(200).send({
            message: `${inputBrowser} stop successfully`
        })
    }
}

module.exports.geturl = (req,res) =>{
   let inputBrowser = req.query.browser ? req.query.browser : null

   if(!inputBrowser || !allowed_browser.includes(inputBrowser)){
       return res.status(400).send({
           message: "Bad Request"
       })
   } else {
        let commandToExecute = conf.osaCommands[inputBrowser] ? conf.osaCommands[inputBrowser] : null
        if(commandToExecute){
            osascript.execute(commandToExecute,(err,result, raw)=>{
                if(err){
                    return res.status(500).send({
                        message: err.message
                    })
                } else {
                    return res.status(200).send({
                        tab: result
                    })
                }

            })
    
        } else {
            return res.status(200).send({
                tab: UrlQueues[inputBrowser][UrlQueues[inputBrowser].length-1] ? UrlQueues[inputBrowser][UrlQueues[inputBrowser].length-1] : null
            })
        }
   }
}

module.exports.cleanup = (req,res) =>{
    let inputBrowser = req.query.browser ? req.query.browser : null

    if(!inputBrowser || !allowed_browser.includes(inputBrowser)){
        return res.status(400).send({
            message: "Bad Request"
        })
    } else {
        let commandToExecute = `rm -rf ${conf.cachePath[inputBrowser]}`
        let sp = exec(commandToExecute)

        return res.status(200).send({
            message: `Cache file browser ${inputBrowser} has been removed successfully.`
        })
    }
}