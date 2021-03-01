#!/bin/bash

sha256sum *.bin | cut -c13-64 --complement | tee cksum_net.txt
sha256sum *.nnue | cut -c13-64 --complement | tee cksum_net.txt
