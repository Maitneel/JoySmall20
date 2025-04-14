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
    prev_(),
    current_(),
    pressed_button_(),
    re_(RE_A, RE_B),
    re_stat(no_rotation),
    is_used_joystick_button_(is_used_joystick_button_arg),
    joystick_init_x(analogRead(JOYSTICK_X)),
    joystick_init_y(analogRead(JOYSTICK_Y)),
    joystick_diff_x(0),
    joystick_diff_y(0)
{
    LoadLayerSet(0);
}


int IO_INPUT_PIN[5] = {IO_HIGH0, IO_HIGH1, IO_HIGH2, IO_HIGH3, IO_HIGH4};
int IO_OUTPUT_PIN[4] = {IO_LOW0, IO_LOW1, IO_LOW2, IO_LOW3};

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
    joystick_diff_x = current_x - joystick_init_x;
    const int current_y = analogRead(JOYSTICK_Y);
    joystick_diff_y = current_y - joystick_init_y;
}

void SmallKeyboardV2_1::SendMessage() {

}

void load_joystcick(const int layout_index, const int layer_index, struct Joystick *joystick) {
    joystick->is_wheel = pgm_read_byte(&(layout_set.layer_set[layout_index].layer[layer_index].joy.is_wheel));
    joystick->switch_key = pgm_read_byte(&(layout_set.layer_set[layout_index].layer[layer_index].joy.switch_key));
    joystick->switch_mouse = pgm_read_byte(&(layout_set.layer_set[layout_index].layer[layer_index].joy.switch_mouse));
}

void load_re_switch(const int layout_index, const int layer_index, unsigned char *re_switch) {
    re_switch = pgm_read_byte(&(layout_set.layer_set[layout_index].layer[layer_index].re_switch));
}

void load_layer(const int layout_index, const int layer_index, struct Layer *layer) {
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            layer->mousemap[i][j] = pgm_read_byte(&(layout_set.layer_set[layout_index].layer[layer_index].mousemap[i][j]));
            layer->keymap[i][j] = pgm_read_byte(&(layout_set.layer_set[layout_index].layer[layer_index].keymap[i][j]));
        }
    }
    load_joystcick(layout_index, layer_index, &(layer->joy));
    load_re_switch(layout_index, layer_index, &(layer->re_switch));
}

void load_layer_key(const int layout_index, uint8_t layer_key[LAYER_HEIGHT][LAYER_WIDTH]) {
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            layer_key[i][j] = pgm_read_byte(&(layout_set.layer_set->layer_key[i][j]));
        }
        
    }
    
}

void load_layer_set(const int layout_index, struct LayerSet *layer_set) {
    layer_set->number_of_layer = pgm_read_byte(&(layout_set.layer_set[layout_index].number_of_layer));
    for (int i = 0; i < layer_set->number_of_layer; i++) {
        load_layer(layout_index, i, &(layer_set->layer[i]));
    }
    load_layer_key(layout_index, layer_set->layer_key);
}

void SmallKeyboardV2_1::LoadLayerSet(int layout_index) {
    layout_index %= pgm_read_byte(&(layout_set.number_of_layer));
    load_layer_set(layout_index, &(keymap_));

    print_layer_set(&(keymap_));
}

void SmallKeyboardV2_1::temp_load(const int index) {
    this->LoadLayerSet(index);
}