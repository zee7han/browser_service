module.exports = {
    "osaCommands": {
        "firefox": 'tell application "System Events" \n keystroke "l" using command down \n keystroke "c" using command down \n end tell',
        "chrome": 'tell application "Google Chrome" to get URL of active tab of front window as string'
    },
    "cachePath": {
        "firefox": "~/Library/Caches/Firefox/",
        "chrome": "~/Library/Caches/com.google.Chrome/"
    }
}