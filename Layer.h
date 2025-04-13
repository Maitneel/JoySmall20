#ifndef INCLUDE_LAYER_H_
#define INCLUDE_LAYER_H_

#define LAYER_HEIGHT 4
#define LAYER_WIDTH 5

#define NUMBER_OF_LAYER 2
#define NUMBER_OF_LAYER_SET 3

#define UNDEFINED_KEY 0


struct Joystick {
    const bool is_wheel;
    const unsigned char switch_key; 
};

struct Layer {
    const unsigned char mousemap[LAYER_HEIGHT][LAYER_WIDTH];
    const unsigned char keymap[LAYER_HEIGHT][LAYER_WIDTH];
    const Joystick joy;
    const unsigned char re_switch;
};


struct LayerSet {
    const uint8_t number_of_layer;
    const uint8_t layer_key[LAYER_HEIGHT][LAYER_WIDTH];
    const struct Layer layer[NUMBER_OF_LAYER];
};

struct LayoutSet {
    const uint8_t number_of_layer;
    const LayerSet layer_set[NUMBER_OF_LAYER_SET];
};


#endif // INCLUDE_LAYER_H_
