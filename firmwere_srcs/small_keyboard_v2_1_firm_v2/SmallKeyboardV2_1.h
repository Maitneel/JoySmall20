#ifndef INCLUDE_SMALLKEYBOARDV2_1_H_
#define INCLUDE_SMALLKEYBOARDV2_1_H_

#include "Layer.h"
#include "RotaryEncoder.h"

class SwitchStatus {
 public:
    bool key_status_[LAYER_HEIGHT][LAYER_WIDTH];
    bool joystick_button_status_;
    bool re_switch_status_;

    SwitchStatus();
    const SwitchStatus &operator=(const SwitchStatus &rhs);
};


class SmallKeyboardV2_1 {
 public:
    SmallKeyboardV2_1(bool is_used_joystick_button_arg);

    void InitilizeJoystickPosition();
    void UpdateStatus();
    void SendMessage();

    void temp_load(const int index);
 private:
    int layout_index;
    struct Layout keymap_;

    struct SwitchStatus prev_;
    struct SwitchStatus current_;
    struct Layer pressed_button_;

    RotaryEncoder re_;
    enum RERotation re_stat;

    bool is_used_joystick_button_;
    int joystick_init_x;
    int joystick_init_y;
    int joystick_diff_x;
    int joystick_diff_y;

    void LoadLayout(int layout_index);
    int GetLayerIndex();
};


#endif // INCLUDE_SMALLKEYBOARDV2_1_H_
