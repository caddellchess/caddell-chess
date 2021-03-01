#!/bin/bash

# name this file "getnet.sh" or whatever you preferred
# by MichaelB7  08/12/20
# amended by Scally 09Sep20 to reflect the Stockfish source changes
# A little script to update to current SF net and to rename net file to "eval.bin"
# designed to be run from the src folder , modify as you wish.
# Modified by Scally to run from Picochess engines folder and copy eval.bin to other NNUE files
# This script is covered by the usual disclaimers, meaning that I am not possibly
# responsible, finanacially or otherwise, for anything that may possibly go
# wrong. There is absolutely no implied warranty, merchantability
# or fitness for any particular purpose whatsover.

#cd ../  ## move up a directory, modify to your own preference
wget https://github.com/official-stockfish/Stockfish/raw/master/src/evaluate.h
sha256nn="$(grep EvalFileDefaultName evaluate.h | sed 's/.*\(nn-[a-z0-9]\{12\}.nnue\).*/\1/')"
echo "sha256nn = $sha256nn"
binurl=" https://tests.stockfishchess.org/api/nn/$sha256nn"

##renames nnue file to eval.bin , modify "eval.bin" to your own preference
wgetnet="wget -O eval.bin"

## pulls the most recent and latest officical NN from the SF Github repository
$wgetnet $binurl
rm evaluate.h   ## no longer needed.
sleep 1  ##  need to wait 1 second, before moving file or might error as being busy

# I like to keep it in my SF build folder, modify to your own preference
cp eval.bin nn-803c91ad5c-20201107.nnue
cp eval.bin nn-62ef826d1a6d.nnue
cp eval.bin default.nnue
cp eval.bin eval/nn.bin
