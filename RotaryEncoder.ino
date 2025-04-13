#include <Arduino.h>
#include "RotaryEncoder.h"

enum RERotation RotaryEncoder::GetRotation() {
    const bool a_stat = digitalRead(a_pin_);
    const bool b_stat = digitalRead(b_pin_);
    enum RERotation result = no_rotation;

    if (b_stat || a_stat == prev_b_stat_) {
        result = no_rotation;
    } else if (prev_b_stat_ == false && a_stat == true) {
        result = clock_wise;
    } else if (prev_b_stat_ == true && a_stat == false) {
        result = counter_clock_wise;
    }
    prev_a_stat_ = b_stat;
    prev_b_stat_ = a_stat;
    return result;
}
