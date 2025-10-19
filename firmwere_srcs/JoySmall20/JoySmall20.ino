#include <avr/pgmspace.h> 
#include <Arduino.h>
#include <Keyboard.h>
#include <Mouse.h>

#include "pin_defines.h"
#include "Layer.h"
#include "SmallKeyboardV2_1.h"

extern const struct LayoutSet layout_set PROGMEM;
SmallKeyboardV2_1 my_keyboard(true);

int i = 0;
int j = 0;
int k = 0;
int l = 0;

void setup() {
    pinMode(IO_LOW0, OUTPUT);
    digitalWrite(IO_LOW0, HIGH);
    pinMode(IO_LOW1, OUTPUT);
    digitalWrite(IO_LOW1, HIGH);
    pinMode(IO_LOW2, OUTPUT);
    digitalWrite(IO_LOW2, HIGH);
    pinMode(IO_LOW3, OUTPUT);
    digitalWrite(IO_LOW3, HIGH);

    pinMode(IO_HIGH0, INPUT_PULLUP);
    pinMode(IO_HIGH1, INPUT_PULLUP);
    pinMode(IO_HIGH2, INPUT_PULLUP);
    pinMode(IO_HIGH3, INPUT_PULLUP);
    pinMode(IO_HIGH4, INPUT_PULLUP);

    // joystick
    pinMode(JOYSTICK_X, INPUT);
    pinMode(JOYSTICK_Y, INPUT);
    pinMode(JOYSTICK_BUTTON, INPUT_PULLUP);

    pinMode(RE_A, INPUT_PULLUP);
    pinMode(RE_B, INPUT_PULLUP);
    pinMode(RE_SW, INPUT_PULLUP);
    pinMode(LED1, OUTPUT);
    digitalWrite(LED1, LOW);
    pinMode(LED2, OUTPUT);
    digitalWrite(LED2, LOW);

    Keyboard.begin();
    Mouse.begin();

    Serial.begin(9600);

    my_keyboard.InitilizeJoystickPosition();
    delay(2000);
}


void print_layout_set() {
    char c = pgm_read_byte(&(layout_set.layout[i].layer[j].keymap[k][l]));
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
    if (j == pgm_read_byte(&(layout_set.layout[j].number_of_layer))) {
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
    char c = pgm_read_byte(&(ls_test.layout[0].layer[0].keymap[0][0]));
    Serial.println(c);
}

void loop() {
    my_keyboard.UpdateStatus();
    my_keyboard.SendMessage();
    delay(2);
}