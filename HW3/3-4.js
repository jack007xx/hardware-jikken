console.log("Start");
var Gpio = require("onoff").Gpio;

var coil1 = new Gpio(4, "out");
var coil2 = new Gpio(17, "out");
var coil3 = new Gpio(27, "out");
var coil4 = new Gpio(22, "out");
var coils = [coil1, coil2, coil3, coil4]

var sw1 = new Gpio(20, "in");
var sw2 = new Gpio(16, "in");
// 下段 coil1: 4, 17, 27, 22
// 上段 coil1: 5, 6, 13, 19
// ボタン 1: 20, ボタン 2: 16, ボタン 3: 12

var count = 0;
var isClockwise = true;

// 1相励磁
var excitationTable = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
// 2相励磁
// var excitationTable = [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 0, 1]];
// 1-2相励磁
// var excitationTable = [[1, 0, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 1], [0, 0, 0, 1], [1, 0, 0, 1]];

while (true) {
  // ここから
  for (i = 0; i < coils.length; i++) {
    coils[i].writeSync(excitationTable[count][i]);
  }
  // ここまで同時

  for (i = 0; i < 5; i++) {
    // スイッチ振り分け
    if (sw1.readSync() != 0) {
      console.log("stopped!!");
      while (sw1.readSync() == 0) {
        sleep(100);
      }
      console.log("restart!!");

    } else if (sw2.readSync() != 0) {
      console.log("reversed!!");
      isClockwise = !isClockwise;
    }
    sleep(100);
  }

  // isClockwiseによって昇降切り替わる
  count = (count + ((isClockwise) ? 1 : excitationTable.length - 1)) % excitationTable.length;
  console.log(count);
}
