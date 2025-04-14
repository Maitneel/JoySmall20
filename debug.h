#ifndef INCLUDE_DEBUG_H_
#define INCLUDE_DEBUG_H_

#include "Layer.h"

void debug_char(const char *str, const char c);
void debug_ptr(const char *str, void *ptr);
void print_layer(const struct Layer *layer);
void print_layer_set(struct LayerSet *layer_set);


#endif // INCLUDE_DEBUG_H_
