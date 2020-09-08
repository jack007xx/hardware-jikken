console.log("Start");
var Gpio = require("onoff").Gpio;

var green_led1 = new Gpio(22, "out");
var green_led2 = new Gpio(19, "out");
var button = new Gpio(16, "in");
// 下段 LED1: 4, 17, 27, 22
// 上段 LED1: 5, 6, 13, 19
// ボタン 1: 20, ボタン 2: 16, ボタン 3: 12
for (i = 0; i < 3; i++) {
  // LED を 1 秒周期 (点灯 0.5 秒, 消灯 0.5 秒) で 5 回明滅
  for (j = 0; j < 5; j++) {
    sleep(500);
    green_led1.writeSync(1);
    green_led2.writeSync(1);
    sleep(500);
    green_led1.writeSync(0);
    green_led2.writeSync(0);
  }
  console.log("[Waiting button input]");
  while (button.readSync() == 0) {
    sleep(100);
  }
  console.log("Pushed!!");
}
console.log("Finished!");
