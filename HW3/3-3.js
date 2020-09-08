console.log("Start");
var Gpio = require("onoff").Gpio;

var led1 = new Gpio(4, "out");
var led2 = new Gpio(17, "out");
var led3 = new Gpio(27, "out");
var led4 = new Gpio(22, "out");
var leds = [led1, led2, led3, led4]

var sw1 = new Gpio(20, "in");
var sw2 = new Gpio(16, "in");
// 下段 LED1: 4, 17, 27, 22
// 上段 LED1: 5, 6, 13, 19
// ボタン 1: 20, ボタン 2: 16, ボタン 3: 12
var count = 0;
var upCount = 1;
while (true) {
  leds[count].writeSync(1);

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
      upCount = (upCount == 1) ? 3 : 1;
    }
    sleep(100);
  }

  leds[count].writeSync(0);

  // upCountの値によって昇降切り替わる
  count = (count + upCount) % 4;
  console.log(count);

}
