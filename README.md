# Pokémon Shiny Hunter

This project automates the process of hunting for shiny Pokémon in the game "Pokémon Ultra Sun" using a combination of Node.js and Python scripts. The Node.js script interacts with the game window to perform key presses and capture screenshots, while the Python script processes the screenshots to detect shiny Pokémon based on HSV color ranges.

Although this project is specifically tested on "Pokémon Ultra Sun," it can be adapted for any game on the Citra emulator.

## Prerequisites

- Node.js (v14 or later)
- Python (v3.6 or later)
- OpenCV for Python (`cv2` module)
- `numpy` for Python
- `keysender` Node.js package
- `node-screenshots` Node.js package
- `screenshot-desktop` Node.js package

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/varun0310t/pokemon-shiny-hunter.git
   cd pokemon-shiny-hunter
2. Install Node.js dependencies:
   npm install

3. Install Python dependencies:
   
   pip install opencv-python numpy

4. Configure settings:
   Edit the settings.js file to configure the application name, HSV values, key press timings, and other settings
  
   HSV :change the hsv value according to the pokemon you are hunting current hsv is for shiny grounden

   keyTime: change the Key time based on your emulator Emulation speed current one is for 175% emulation speed 

#Running the Project

1. Start the Python TCP server:
 
  python trail.py

2. Start the Node.js script:

  node main.js

#How It Works

1. Node.js Script (main.js):  

  Finds the game window based on the application name specified in settings.js.
  Performs a series of key presses to interact with the game.
  Captures screenshots of the game window.
  Sends the screenshot paths to the Python server for processing.
  Receives the result from the Python server and performs actions based on the result (e.g., logging shiny detection).

2. Python Script (trail.py):

   Initializes a TCP server that listens for incoming connections.
   Receives screenshot paths and HSV values from the Node.js script.
   Processes the screenshots using OpenCV to detect shiny Pokémon based on the specified HSV color ranges.
   Sends the detection result back to the Node.js script.


#Troubleshooting

   Ensure that the game window title matches the ApplicationName specified in settings.js.
   Ensure that the Python server is running before starting the Node.js script.
   Check for any errors in the console output of both the Python and Node.js scripts.