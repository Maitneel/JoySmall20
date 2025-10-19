#include <Arduino.h>

#include "Layer.h"

void debug_char(const char *str, const char c) {
    Serial.print(str);
    Serial.print((c));
    Serial.print(": ");
    Serial.println((int)(c));
}

void debug_int(const char *str, const int n) {
    Serial.print(str);
    Serial.print(": ");
    Serial.println(n);
}

void debug_ptr(const char *str, void *ptr) {
    Serial.print(str);
    Serial.print(": ");
    Serial.println((int)(ptr), HEX);
}


void print_layer(const struct Layer *layer) {
    Serial.println("mousemap---------");
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            Serial.print(layer->mousemap[i][j]);
            Serial.print(" ");
        }
        Serial.println();
    }

    Serial.println("keymap-----------");
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            Serial.print((char)(layer->keymap[i][j]));
            Serial.print(" ");
        }
        Serial.println();
    }
}

void print_layout(struct Layout *layout) {
    Serial.print("number of layer: ");
    Serial.println(layout->number_of_layer);

    Serial.println("layer_key");
    for (int i = 0; i < LAYER_HEIGHT; i++) {
        for (int j = 0; j < LAYER_WIDTH; j++) {
            Serial.print(layout->layer_key[i][j]);
            Serial.print(" ");
        }
        Serial.println();
    }

    for (size_t i = 0; i < layout->number_of_layer; i++) {
        Serial.print("layer index: ");
        Serial.print(i);
        Serial.println("--------------------------------");
        print_layer(&(layout->layer[i]));
    }
    
}
