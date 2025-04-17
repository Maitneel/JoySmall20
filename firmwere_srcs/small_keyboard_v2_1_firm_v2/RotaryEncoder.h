#ifndef INCLUDE_ROTARYENCODER_H_
#define INCLUDE_ROTARYENCODER_H_

#include <Arduino.h>


enum RERotation {
    no_rotation = 0,
    clock_wise = 1,
    counter_clock_wise = 2
};

class RotaryEncoder {
 public:
    RotaryEncoder(int re_a, int re_b) : a_pin_(re_a), b_pin_(re_b), prev_a_stat_(digitalRead(re_a)), prev_b_stat_(digitalRead(re_b)) {};

    enum RERotation GetRotation();
 private:
    int a_pin_;
    int b_pin_;
    bool prev_a_stat_;
    bool prev_b_stat_;
};

#endif // INCLUDE_ROTARYENCODER_H_
