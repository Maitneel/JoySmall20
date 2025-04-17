#include <Arduino.h>
#include <Keyboard.h>
#include <Mouse.h>

#include "Layer.h"
#include "pin_defines.h"
#include "RotaryEncoder.h"
#include "SmallKeyboardV2_1.h"

#include "debug.h"

extern const struct LayoutSet layout_set PROGMEM;

SwitchStatus::SwitchStatus() : joystick_button_status_(false), re_switch_status_(false) {
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            key_status_[i][j] = false;
        }
    }
}

const SwitchStatus &SwitchStatus::operator=(const SwitchStatus &rhs) {
    if (this == &rhs) {
        return *this;
    }

    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            this->key_status_[i][j] = rhs.key_status_[i][j];
        }
    }
    this->joystick_button_status_ = rhs.joystick_button_status_;
    this->re_switch_status_ = rhs.re_switch_status_;
    return *this;
}


SmallKeyboardV2_1::SmallKeyboardV2_1(bool is_used_joystick_button_arg) :
    layout_index(0),
    prev_(),
    current_(),
    pressed_button_(),
    re_(RE_A, RE_B),
    re_stat(no_rotation),
    is_used_joystick_button_(is_used_joystick_button_arg),
    joystick_init_x(0),
    joystick_init_y(0),
    joystick_diff_x(0),
    joystick_diff_y(0)
{
    LoadLayerSet(0);
}

void SmallKeyboardV2_1::InitilizeJoystickPosition() {
    joystick_init_x = analogRead(JOYSTICK_X);
    joystick_init_y = analogRead(JOYSTICK_Y);
}


int IO_INPUT_PIN[5] = {IO_HIGH0, IO_HIGH1, IO_HIGH2, IO_HIGH3, IO_HIGH4};
int IO_OUTPUT_PIN[4] = {IO_LOW0, IO_LOW1, IO_LOW2, IO_LOW3};

int led_counter = 0;

void SmallKeyboardV2_1::UpdateStatus() {
    prev_ = current_;

    // update keys
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        digitalWrite(IO_OUTPUT_PIN[i], LOW);
        for (int j = 0; j < LAYER_WIDTH; j++) {
            current_.key_status_[i][j] = (!digitalRead(IO_INPUT_PIN[j]));
        }
        digitalWrite(IO_OUTPUT_PIN[i], HIGH);
    }

    // rotary encoder;
    re_stat = re_.GetRotation();
    current_.re_switch_status_ = (!digitalRead(RE_SW));

    // joystick;
    if (is_used_joystick_button_) {
        current_.joystick_button_status_ = (!digitalRead(JOYSTICK_BUTTON));
    }
    const int current_x = analogRead(JOYSTICK_X);
    joystick_diff_x = (current_x - joystick_init_x) * -1;
    const int current_y = analogRead(JOYSTICK_Y);
    joystick_diff_y = current_y - joystick_init_y;


    // update keymap
    if (re_stat == clock_wise) {
        digitalWrite(LED1, HIGH);
        layout_index += 1;
        led_counter = 1000;
    } else if (re_stat == counter_clock_wise) {
        digitalWrite(LED2, HIGH);
        layout_index += NUMBER_OF_LAYER_SET - 1;
        led_counter = 1000;
    }
    if (led_counter == 1) {
        digitalWrite(LED2, LOW);
        digitalWrite(LED1, LOW);
    } else if (led_counter) {
        led_counter--;
    }
    layout_index %= NUMBER_OF_LAYER_SET;
    if (re_stat != no_rotation) {
        LoadLayerSet(layout_index);
    }

}

int SmallKeyboardV2_1::GetLayerIndex() {
    int layer_index = 0;
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            if (current_.key_status_[i][j]) {
                layer_index += keymap_.layer_key[i][j];
            }
        }
    }
    return layer_index;
}


void send_mouse_message(const bool status, const unsigned char button_code, unsigned char *pressed_button) {
    if (button_code == UNDEFINED_KEY) {
        return;
    }
    if (status) {
        Mouse.press(button_code);
        *pressed_button = button_code;
    } else {
        Mouse.release(pressed_button);
        *pressed_button = UNDEFINED_KEY;
    }
}

void send_key_message(const bool status, const unsigned char key_code, unsigned char *pressed_key) {
    if (key_code == UNDEFINED_KEY) {
        return;
    }
    if (status) {
        Keyboard.press(key_code);
        *pressed_key = key_code;
    } else {
        Keyboard.release(*pressed_key);
        *pressed_key = UNDEFINED_KEY;
    }
}

void send_joystick_mouse_message(const bool is_wheel, int diff_x, int diff_y) {
    if (abs(diff_x) < JOYSTICK_IGNORE_LENGTH && abs(diff_y) < JOYSTICK_IGNORE_LENGTH) {
        return;
    }

    diff_x /= JOYSTICK_MAGNIFICATION;
    diff_y /= JOYSTICK_MAGNIFICATION;

    if (is_wheel) {
        Mouse.move(0, 0, diff_y);
    } else {
        Mouse.move(diff_x, diff_y, 0);
    }
}


void SmallKeyboardV2_1::SendMessage() {
    const int layer_index = GetLayerIndex();
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            if (current_.key_status_[i][j] != prev_.key_status_[i][j]) {
                send_mouse_message(current_.key_status_[i][j], keymap_.layer[layer_index].mousemap[i][j], &(pressed_button_.mousemap[i][j]));
                send_key_message(current_.key_status_[i][j], keymap_.layer[layer_index].keymap[i][j], &(pressed_button_.keymap[i][j]));
            }
        }
    }
    if (is_used_joystick_button_ && current_.joystick_button_status_ != prev_.joystick_button_status_) {
        send_mouse_message(current_.joystick_button_status_, keymap_.layer[layer_index].joy.switch_mouse, &(pressed_button_.joy.switch_mouse));
        send_key_message(current_.joystick_button_status_, keymap_.layer[layer_index].joy.switch_key, &(pressed_button_.joy.switch_key));
    }
    if (current_.re_switch_status_ != prev_.re_switch_status_) {
        send_mouse_message(current_.re_switch_status_, keymap_.layer[layer_index].re_mouse, &(pressed_button_.re_mouse));
        send_key_message(current_.re_switch_status_, keymap_.layer[layer_index].re_key, &(pressed_button_.re_key));
    }
    send_joystick_mouse_message(keymap_.layer[layer_index].joy.is_wheel, joystick_diff_x, joystick_diff_y);
}

void load_joystcick(const int layout_index, const int layer_index, struct Joystick *joystick) {
    joystick->is_wheel = pgm_read_byte(&(layout_set.layout[layout_index].layer[layer_index].joy.is_wheel));
    joystick->switch_key = pgm_read_byte(&(layout_set.layout[layout_index].layer[layer_index].joy.switch_key));
    joystick->switch_mouse = pgm_read_byte(&(layout_set.layout[layout_index].layer[layer_index].joy.switch_mouse));
}

void load_re_mouse(const int layout_index, const int layer_index, unsigned char *re_mouse) {
    re_mouse = pgm_read_byte(&(layout_set.layout[layout_index].layer[layer_index].re_mouse));
}

void load_re_key(const int layout_index, const int layer_index, unsigned char *re_key) {
    re_key = pgm_read_byte(&(layout_set.layout[layout_index].layer[layer_index].re_key));
}

void load_layer(const int layout_index, const int layer_index, struct Layer *layer) {
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            layer->mousemap[i][j] = pgm_read_byte(&(layout_set.layout[layout_index].layer[layer_index].mousemap[i][j]));
            layer->keymap[i][j] = pgm_read_byte(&(layout_set.layout[layout_index].layer[layer_index].keymap[i][j]));
        }
    }
    load_joystcick(layout_index, layer_index, &(layer->joy));
    load_re_mouse(layout_index, layer_index, &(layer->re_mouse));
    load_re_key(layout_index, layer_index, &(layer->re_key));
}

void load_layer_key(const int layout_index, uint8_t layer_key[LAYER_HEIGHT][LAYER_WIDTH]) {
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            layer_key[i][j] = pgm_read_byte(&(layout_set.layout->layer_key[i][j]));
        }
        
    }
    
}

void load_layer_set(const int layout_index, struct LayerSet *layer_set) {
    layer_set->number_of_layer = pgm_read_byte(&(layout_set.layout[layout_index].number_of_layer));
    for (int i = 0; i < layer_set->number_of_layer; i++) {
        load_layer(layout_index, i, &(layer_set->layer[i]));
    }
    load_layer_key(layout_index, layer_set->layer_key);
}

void SmallKeyboardV2_1::LoadLayerSet(int layout_index) {
    layout_index %= pgm_read_byte(&(layout_set.number_of_layer));
    load_layer_set(layout_index, &(keymap_));
}

void SmallKeyboardV2_1::temp_load(const int index) {
    this->LoadLayerSet(index);
}
