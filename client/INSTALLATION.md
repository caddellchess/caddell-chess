
# Caddell Chess Computer

## Browser Component

### Installation Instructions

A little advanced technical knowledge is assumed for these steps.

#### Building the browser component

**It is assumed that the stand alone chess computer is running at this point.**

SSH to the Raspberry Pi, and navigate to the `caddell/client` directory.

Enter the `npm install` command to install all necessary dependencies.
Enter `npm run build` command to "compile" and package the "front end" code.

Restart the chess computer.

#### Viewing the browser component

You should now be able to access the browser component at `http://caddel.local:3000` (or using
the IP address of your RPi, or whatever hostname you have assigned)

You are not restricted to going to the web page of the browser component only at the start of the game. The
browser component can be accessed at any time in a game, and even from multiple browser tabs!

## Attributions

**Sincere thanks** to the [StingRay Chess GUI project](http://www.stingraychess.org/). I've been very
captivated by the look and feel of StingRay and for now have leaned on its look until Caddell matures
and grows a look of its own.
No code, including no CSS, was lifted from StingRay. Caddell's browser component was handcrafted from scratch.
