#include <avr/pgmspace.h> 
#include <Arduino.h>
#include <Keyboard.h>
#include <Mouse.h>

#include "Layer.h"

const struct LayoutSet layout_set PROGMEM = {
    3,
    {
        {
            2, // number_of_layer
            { // layer_key
                {0, 0, 0, 0, 0},
                {0, 0, 0, 0, 0},
                {0, 0, 0, 0, 0},
                {1, 0, 0, 0, 0},
            },
            { // layer
                { // layer[0]
                    {
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                    },
                    {
                        {'a', 'a', 'a', 'a', 'a'},
                        {'b', 'b', 'b', 'b', 'b'},
                        {'c', 'c', 'c', 'c', 'c'},
                        {'d', 'd', 'd', 'd', 'd'}
                    },
                    {false, 'J'},
                    'R'
                },
                {
                    { // layer[1]
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                    },
                    {
                        {'e', 'e', 'e', 'e', 'e'},
                        {'f', 'f', 'f', 'f', 'f'},
                        {'g', 'g', 'g', 'g', 'g'},
                        {'h', 'h', 'h', 'h', 'h'}
                    },
                    {false, 'J'},
                    'R'
                }
            }
        },
        {
            2, // number_of_layer
            { // layer_key
                {0, 0, 0, 0, 0},
                {0, 0, 0, 0, 0},
                {0, 0, 0, 0, 0},
                {1, 0, 0, 0, 0},
            },
            { // layer
                { // layer[0]
                    {
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                    },
                    {
                        {'i', 'i', 'i', 'i', 'i'},
                        {'j', 'j', 'j', 'j', 'j'},
                        {'k', 'k', 'k', 'k', 'k'},
                        {'l', 'l', 'l', 'l', 'l'}
                    },
                    {false, 'J'},
                    'R'
                },
                {
                    { // layer[1]
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                    },
                    {
                        {'m', 'm', 'm', 'm', 'm'},
                        {'n', 'n', 'n', 'n', 'n'},
                        {'o', 'o', 'o', 'o', 'o'},
                        {'p', 'p', 'p', 'p', 'p'}
                    },
                    {false, 'J'},
                    'R'
                }
            }
        },
        {
            2, // number_of_layer
            { // layer_key
                {0, 0, 0, 0, 0},
                {0, 0, 0, 0, 0},
                {0, 0, 0, 0, 0},
                {1, 0, 0, 0, 0},
            },
            { // layer
                { // layer[0]
                    {
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                    },
                    {
                        {'r', 'r', 'r', 'r', 'r'},
                        {'s', 's', 's', 's', 's'},
                        {'t', 't', 't', 't', 't'},
                        {'u', 'u', 'u', 'u', 'u'}
                    },
                    {false, 'J'},
                    'R'
                },
                {
                    { // layer[1]
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                        {UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY, UNDEFINED_KEY},
                    },
                    {
                        {'v', 'v', 'v', 'v', 'v'},
                        {'w', 'w', 'w', 'w', 'w'},
                        {'x', 'x', 'x', 'x', 'x'},
                        {'y', 'y', 'y', 'y', 'y'}
                    },
                    {false, 'J'},
                    'R'
                }
            }
        }
    }
};


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