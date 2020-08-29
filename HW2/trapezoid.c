#include <stdio.h>
#include <sys/io.h>
#include <unistd.h>

#define PPA_0 ((unsigned short)(0x378))
#define PBS 2
#define TRUE 1

// 各コイルを励磁するためにパラポートに送るフラグ
#define A 0b0001  //ピン2
#define B 0b0010  //ピン3
#define C 0b0100  //ピン4
#define D 0b1000  //ピン5

#define ACC 1             //加速度[pps/回]
#define START_RATE 20     //起動周波数(最大自起動周波数以下)[pps]
#define MAX_SLEW_RATE 40  //最大応答周波数(目的となる速度)[pps]

void trapezoid(unsigned int step) {
  int coils[] = {A, B, C, D};
  int count = 0;
  int rate = START_RATE;

  while (count != step) {
    // 加減速
    if (step / 2 > count) {
      rate += ACC;
    } else {
      rate -= ACC;
    }

    // 2相励磁
    outb(coils[count % 4] & coils[(count + 1) % 4], PPA_0);

    // 速度を一定に
    if (rate > MAX_SLEW_RATE) {
      usleep(1000000 / MAX_SLEW_RATE);
    } else {
      usleep(1000000 / rate);
    }

    count++;
  }
  outb(0, PPA_0);
}

int main(int argc, char const *argv[]) {
  if (ioperm(PPA_0, PBS, TRUE) != 0) {
    printf("error\n");
    exit(-1);
  }

  trapezoid(100);

  return 0;
}
