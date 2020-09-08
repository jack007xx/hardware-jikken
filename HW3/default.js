console.log("Start");
// onoff.Gpio ライブラリをロード
var Gpio = require("onoff").Gpio;
// ピン番号を指定して Gpio インスタンスを作成
// in / out は⼊⼒に使うか出⼒に使うかの指定
1
var led = new Gpio(4, "out");
var button = new Gpio(12, "in");
// 下段 LED1: 4, 17, 27, 22
// 上段 LED1: 5, 6, 13, 19
// ボタン 1: 20, ボタン 2: 16, ボタン 3: 12
// 3 回までループ
for (i = 0; i < 3; i++) {
  // LED を 1 秒周期 (点灯 0.5 秒, 消灯 0.5 秒) で 5 回明滅
  for (j = 0; j < 5; j++) {
    sleep(500);
    led.writeSync(1);
    sleep(500);
    led.writeSync(0);
  }
  // 無限ループでボタン⼊⼒を待つ (0: off, 1: on)
  console.log("[Waiting button input]");
  while (button.readSync() == 0) {
    sleep(100);
  }
  console.log("Pushed!!");
}
console.log("Finished!");
