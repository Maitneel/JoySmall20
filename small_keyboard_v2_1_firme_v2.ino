#include <avr/pgmspace.h> 
#include <Arduino.h>
#include <Keyboard.h>
#include <Mouse.h>

#include "Layer.h"

extern const struct LayoutSet layout_set PROGMEM;

int i = 0;
int j = 0;
int k = 0;
int l = 0;

void setup() {
    Keyboard.begin();
    Mouse.begin();

    Serial.begin(9600);
}


void print_layout_set() {
    char c = pgm_read_byte(&(layout_set.layer_set[i].layer[j].keymap[k][l]));
    Serial.print(i);
    Serial.print(j);
    Serial.print(k);
    Serial.print(l);
    Serial.println(c);

    l++;
    if (l == LAYER_WIDTH) {
        k++;
        Serial.println();
        l %= LAYER_WIDTH;
    }
    if (k == LAYER_HEIGHT) {
        j++;
        k %= LAYER_HEIGHT;
    }
    if (j == pgm_read_byte(&(layout_set.layer_set[j].number_of_layer))) {
        j = 0;
        i++;
    }
    i %= pgm_read_byte(&(layout_set.number_of_layer));
}

void debug(const char *str, void *ptr) {
    Serial.print(str);
    Serial.print(": ");
    Serial.println((long)(ptr), HEX);
}

void test(const LayoutSet ls_test) {
    char c = pgm_read_byte(&(ls_test.layer_set[0].layer[0].keymap[0][0]));
    Serial.println(c);
}
    

void loop() {
    print_layout_set();
    
    delay(200);
}