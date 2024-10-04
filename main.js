const { Hardware, getAllWindows, sleep, GlobalHotkey } = require('keysender');
const { Monitor, Window } = require("node-screenshots");
const { exec } = require('child_process');
const net = require('net');
const fs = require("fs");
const { exit } = require('process');
const settings = require('./settings.js');

let result = "";
let num = 0;
let timestamp;
let ScreenshotWindow = Window.all();



const running_game = settings.ApplicationName;

ScreenshotWindow = ScreenshotWindow.find(Element => {
    return Element.title == running_game;
});

const main = getAllWindows().find(Element => {
    return Element.title == running_game;
});

if (!main) {
    console.error('Could not find the game window');
    process.exit();
}

const { keyboard, mouse, workwindow } = new Hardware(main.handle);

workwindow.setForeground();

// Function to check if the port is in use
function isPortInUse(port, callback) {
    const tester = net.createServer()
        .once('error', function (err) {
            if (err.code === 'EADDRINUSE') {
                callback(true);
            } else {
                callback(false);
            }
        })
        .once('listening', function () {
            tester.once('close', function () {
                callback(false);
            }).close();
        })
        .listen(port);
}

// Check if the port is in use before starting the Python script
isPortInUse(settings.port, (inUse) => {
    if (!inUse) {
        // Execute the Python script to initialize the TCP server
        const pythonProcess = exec('python trail.py', (error, stdout, stderr) => {
            if (error) {
                console.error('Error running Python script:', error);
                return;
            }
            if (stderr) {
                console.error('Python script encountered an error:', stderr);
                return;
            }
            console.log(`Python script output: ${stdout}`);
        });
    } else {
        console.log('Python server is already running.');
    }

    // Add a delay to ensure the Python server is ready
    setTimeout(() => {
        const client = new net.Socket();

        client.connect(settings.port, '127.0.0.1', () => {
            console.log('Connected to Python server');

            // Send the HSV values once during the initial connection setup
            const hsvMessage = JSON.stringify({
                lowerHSV: settings.LowerBound,
                upperHSV: settings.UpperBound
            });
            client.write(hsvMessage);
        });

        client.on('data', (data) => {
            result = data.toString().trim();
            if (result === 'True') {
                console.log('Shiny detected!');
                process.exit();
            } else {
                console.log(num++);
                keyboard.sendKey(settings.SixthKeyValue, settings.SixthMoveTime);
            }
        });

        client.on('error', (err) => {
            console.error('Client socket error:', err);
        });

        async function main1() {
            while (true) {
                await keyboard.sendKey(settings.FirstKeyValue, settings.FirstMoveTime);
                await keyboard.sendKey(settings.SecondKeyValue, settings.SecondMoveTime);
                await keyboard.sendKey(settings.ThirdKeyValue, settings.ThirdMoveTime);
                await keyboard.sendKey(settings.FourthKeyValue, settings.FourthMoveTime);
                await keyboard.sendKey(settings.FifthKeyValue, settings.FifthMoveTime);

                // Capture screenshot and save as image file
                await ScreenshotWindow.captureImage().then(async (image) => {
                    // Crop the image using the Pokémon area coordinates
                    image = await image.crop(500, 200, 900, 600);
                    let pngBuffer = await image.toPng();
                    // Save the image
                    timestamp = new Date().getTime();
                    await fs.writeFileSync(`screenshot.png`, pngBuffer);
                    const screenshotPath = `./allss/screenshot_${timestamp}.png`;

                    // Save the image
                    fs.writeFileSync(screenshotPath, pngBuffer);

                    // Send the image path to the Python script via TCP
                    client.write(JSON.stringify({ imagePath: 'screenshot.png' }));
                });

                // Use the MaximumWaitTimeforProcessingOfPhotoDetection from settings
                await sleep(settings.MaximumWaitTimeforProcessingOfPhotoDetection);
            }
        }

        main1();
    }, 5000); // Adjust the delay as needed (5000ms = 5 seconds)
});