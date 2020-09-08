console.log("Start");
var Gpio = require("onoff").Gpio;

var coil1 = new Gpio(4, "out");
var coil2 = new Gpio(17, "out");
var coil3 = new Gpio(27, "out");
var coil4 = new Gpio(22, "out");
var coils1 = [coil1, coil2, coil3, coil4]

var coil5 = new Gpio(5, "out");
var coil6 = new Gpio(6, "out");
var coil7 = new Gpio(13, "out");
var coil8 = new Gpio(19, "out");
var coils2 = [coil5, coil6, coil7, coil8]

var sw1 = new Gpio(20, "in");
var sw2 = new Gpio(16, "in");
var sw3 = new Gpio(12, "in");
// 下段 coil1: 4, 17, 27, 22
// 上段 coil1: 5, 6, 13, 19
// ボタン 1: 20, ボタン 2: 16, ボタン 3: 12

var count1 = 0;
var count2 = 0;
var isClockwise1 = true;
var isClockwise2 = true;

// 1相励磁
var excitationTable = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
// 2相励磁
// var excitationTable = [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 0, 1]];
// 1-2相励磁
// var excitationTable = [[1, 0, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 1], [0, 0, 0, 1], [1, 0, 0, 1]];

console.log("[Waiting button input]");
while (sw1.readSync() == 0) {
  sleep(100);
}
console.log("start!!");

while (true) {
  // ここから
  for (i = 0; i < coils1.length; i++) {
    coils1[i].writeSync(excitationTable[count1][i]);
  }
  for (i = 0; i < coils2.length; i++) {
    coils2[i].writeSync(excitationTable[count2][i]);
  }
  // ここまで同時

  for (i = 0; i < 5; i++) {
    // スイッチ振り分け
    if (sw1.readSync() != 0) {
      console.log("stopped!!");
      isClockwise1 = true;
      isClockwise2 = true;
      while (sw1.readSync() == 0) {
        sleep(100);
      }
      console.log("restart!!");

    } else if (sw2.readSync() != 0) {
      console.log("turn right");
      isClockwise1 = !isClockwise1;

    } else if (sw3.readSync() != 0) {
      console.log("turn left");
      isClockwise2 = !isClockwise2;

    }
    sleep(100);
  }

  // isClockwiseによって昇降切り替わる
  count1 = (count1 + ((isClockwise1) ? 1 : excitationTable.length - 1)) % excitationTable.length;
  count2 = (count2 + ((isClockwise2) ? 1 : excitationTable.length - 1)) % excitationTable.length;
}
