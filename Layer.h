#ifndef INCLUDE_LAYER_H_
#define INCLUDE_LAYER_H_

#define LAYER_HEIGHT 4
#define LAYER_WIDTH 5

#define NUMBER_OF_LAYER 2
#define NUMBER_OF_LAYER_SET 3

#define UNDEFINED_KEY 0


struct Joystick {
    bool is_wheel;
    unsigned char switch_key; 
    unsigned char switch_mouse;
};

struct Layer {
    unsigned char mousemap[LAYER_HEIGHT][LAYER_WIDTH];
    unsigned char keymap[LAYER_HEIGHT][LAYER_WIDTH];
    Joystick joy;
    unsigned char re_mouse;
    unsigned char re_key;
};


struct LayerSet {
    uint8_t number_of_layer;
    uint8_t layer_key[LAYER_HEIGHT][LAYER_WIDTH];
    struct Layer layer[NUMBER_OF_LAYER];
};

struct LayoutSet {
    const uint8_t number_of_layer;
    const LayerSet layer_set[NUMBER_OF_LAYER_SET];
};


#endif // INCLUDE_LAYER_H_
