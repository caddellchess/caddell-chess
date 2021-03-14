# Caddell Chess Computer

## Installation Instructions

### Setting up the Raspberry Pi

#### Install the Operating System
Using the Raspberry Pi Imager (or any means comfortable to you), install the latest Raspberry Pi OS Lite on your RPi.

#### Set up WiFi (I suppose this is optional, but I find it useful)
Remount the sd card if needed and create a *wpa_supplicant.conf* file and place it in the root directory of the sd card
you just created.

#### Allow ssh access to your RPi
Create an empty file in the root directory of the sd card called _ssh_.

#### Update and install supportive software
Eject the sd card and install it in your Raspberry Pi.
Apply power to boot. The initial boot process may take a little time.
SSH into your RPi using `pi` as the username and `raspberry` as the password.

##### Update and prep the Rasperry Pi
* `sudo apt-get update && sudo apt-get upgrade && sudo apt-get clean` (this will likely take some time; grow a
  coffee plant, harvest the beans, roast them, make yourself a cup and enjoy it, or some other quick diversion)
* run `sudo raspi-config`
  * Take option`3 - Interface Options`
  * Next take option `6 - Serial Port`
  * select `No` to disable the shell
  * select `Yes` to enable the serial port hardware
  * Acknowledge with `ok`
* while in `raspi-config` I like to set up localization options, and expand the file system to fill the card, both are
  optional (but can take a while sometimes, depending on your model of RPi). Setting a hostname, while also optional,
  can be beneficial for finding your RPi on your network.
* reboot and log back in via ssh

##### Install git
* `sudo apt update` (this is probably optional here, but it is thorough)
* `sudo apt install git`

##### Install nodejs and npm
* `sudo apt-get install nodejs`
* `sudo apt-get install npm`

##### Get the Nextion display updater script
* `wget https://raw.githubusercontent.com/g4klx/MMDVMHost/master/Nextion_G4KLX/nextion.py`

##### Get the Caddell Chess Computer software
* `mkdir projects && cd $_`
* `git clone https://github.com/caddellchess/caddell-chess.git`

for now Caddell has a limitation that it must reside in `/home/pi/caddell-chess` on the RPi

##### Install all the nodejs dependencies
* `cd caddell-chess`
* `npm install`

#### Load the image to the Nextion display

##### Compile the Nextion display image
Download and install the [Nextion editor](https://nextion.tech/nextion-editor/). Unfortunately it is only supported
on Windows at this time.

Before compiling be sure to select the correct version of your Nextion display in the editor, either Basic or
Enhanced and the 3.5" version. Next select the orientation, horizontal at either 90 or 270 degrees (depending on
which side is "up" in your installation).

##### Connect the Nextion display to your RPi
Using the connector cable that came with your display, connect the Nextion display to the GPIO pins on your Raspberry
Pi board. This image might be helpful:
[Drawing of Nextion connections](https://www.f5uii.net/wp-content/uploads/2017/04/MMDVM-Nextion-wiring-for-programming.jpg)

...or this photo might help more:
[Photo of Nextion connections](https://www.f5uii.net/wp-content/uploads/2017/04/Nextion-Rapberry-Pi-connected.jpg)

**DO NOT JUST RELY ON THE COLORS OF THE WIRES** verify that the connections are proper.

##### Write the image file to the display
* `sudo apt-get install python-pip`
* `sudo apt-get install python-serial`

Then (from the home directory of the `pi` user, if you're not already there):
* `sudo python nextion.py ~/caddell-chess/nextion/caddell.tft /dev/tytAMA0` the specific directory here will depend on
if you have a standard or enhanced Nextion display.

Note: if you're having trouble you can always update the display with an sd card directly.
Disclaimer: I've only updated via sd card... mostly because the Nextion Editor only runs on Windows (a Macbook is my
primary machine) and I haven't done anything to set it up to update the display directly.

#### Load and install the Caddell software

##### Get the project software from the Github repo
* `git clone http://github.com/caddellchess/caddell-chess`

##### Get all the project dependencies
* `cd caddell-chess`
* `npm install`

##### Install engine dependent libraries
The Maia engine included in the repo was compiled for BLAS, and as such requires another library
to be installed:

* `sudo apt install libopenblas-dev`

If you don't intend to play against the Maia engine you can safely skip this step.

##### First run of the program
* assuming you're still in the `caddell-chess` directory, run `node index.js`

## Attributions
Required attributes, per licenses, are in the attributions.txt file.

**Many thanks** to the [picochess project](http://picochess.com), not just for the easily accessible opening books,
tablebases, and engines, but reading the code gave me a lot of insight on how to move forward in some cases.

## Notes
The [Nextion npm package](https://www.npmjs.com/package/nextion) needed to be modified to work (though unclear if that
means just work with the Raspberry Pi or work in general - there was a "disclaimer" in the readme). As such the
package is used from a modified repository and since it appears as a dead project I have not yet created a pull request.

The [Polyglot-Chess package](https://www.npmjs.com/package/polyglot-chess) needed to be pulled from a Pull Request
that addresses breaking changes on newer versions of node.

The [chess-tools package](https://www.npmjs.com/package/chess-tools) was modified to more easily and reliably determine
if a move is a "book move".

Opening books, and engines (including Rodent IV's personality files), are pulled from the
[picochess project](http://picochess.com/), taken from the (at the time) latest image of that software (GNU license).

The Syzygy endgame tablebases also came from the picochess project, since they were already downloaded.

## Disclaimer
No warranty is stated or implied. You **must** disable the serial console on `/dev/ttyAMA0` as described in this
readme. I haven't tested if it's true or not, but I have seen mention that you can damage your display and/or your
Raspberry Pi if you do not take the steps necessary.

This software is provided AS IS. It may have bugs, it may not work at all, you may not like it. In the end, remember
what my Grandfather used to say, that "you get what you pay for."
