#!/usr/bin/env node
'use strict';

const frames = require('./frames').frames;

const FRAME_SIZE = 64;
const COLORS = {
  ',' :  '\x1B[48;5;17m',
  '.' :  '\x1B[48;5;231m',
  '\'':  '\x1B[48;5;16m',
  '@' :  '\x1B[48;5;230m',
  '$' :  '\x1B[48;5;175m',
  '-' :  '\x1B[48;5;162m',
  '>' :  '\x1B[48;5;196m',
  '&' :  '\x1B[48;5;214m',
  '+' :  '\x1B[48;5;226m',
  '#' :  '\x1B[48;5;118m',
  '=' :  '\x1B[48;5;33m',
  ';' :  '\x1B[48;5;19m',
  '*' :  '\x1B[48;5;240m',
  '%' :  '\x1B[48;5;175m'
};

function Nyancat() {
  this.setSize();
  this.output = '  ';
  this.frame = 0;
  this.last = 0;

  process.stdout.on('resize', this.setSize.bind(this));
}

Nyancat.prototype.setSize = function () {
  this.terminal_height = process.stdout.rows;
  this.terminal_width = process.stdout.columns;
  this.min_col = ((FRAME_SIZE - (this.terminal_width / 2)|0) / 2)|0;
  this.max_col = ((FRAME_SIZE + (this.terminal_width / 2)|0) / 2)|0;
  this.min_row = ((FRAME_SIZE - (this.terminal_height - 1)) / 2)|0;
  this.max_row = ((FRAME_SIZE + (this.terminal_height - 1)) / 2)|0;
};

Nyancat.prototype.run = function () {
  const rainbow = ',,>>&&&+++###==;;;,,';
  let color;

  process.stdout.write('\x1B[?25l]\n');
  let x, y;
  for (y = this.min_row; y < this.max_row; y++) {
    for (x = this.min_col; x < this.max_col; x++) {
      if (((23 < y) && (y < 43)) && (x < 0)) {
        let mod_x = (((-x + 2) % 16 ) / 8)|0;
        if ((this.frame / 2)|0 % 2) {
          mod_x = 1 - mod_x;
        }
        let tmp = mod_x + y - 23;
        if (-1 < tmp && tmp < rainbow.length) {
          color = rainbow.charAt(tmp);
        } else {
          color = ',';
        }
      } else if ((x < 0) || (y < 0) || (y >= FRAME_SIZE) || (x >= FRAME_SIZE)) {
        color = ',';
      } else {
        color = frames[this.frame][y].charAt(x);
      }
      if ((color != this.last) && !!COLORS[color]) {
        this.last = color;
        process.stdout.write(COLORS[color] + this.output);
      } else {
        process.stdout.write(this.output);
      }
    }
    process.stdout.write('\n');
  }
  this.frame++; this.frame = this.frame % frames.length;
  this.last = 0;
  setTimeout(this.run.bind(this), 100);
};

if (require.main === module) {
  const nyan = new Nyancat();
  nyan.run();
}
