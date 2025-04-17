#include <string>
#include <map>
#include <fstream>

#include "firmweres_structor.hpp"

Layer::Layer(const std::string &file_path_arg) : file_path_(file_path_arg), re_mouse_(UNDEFINED_KEY), re_key_(UNDEFINED_KEY) {
    for (size_t i = 0; i < LAYER_HEIGHT; i++) {
        for (size_t j = 0; j < LAYER_WIDTH; j++) {
            mousemap_[i][j] = UNDEFINED_KEY;
            keymap_[i][j] = UNDEFINED_KEY;
        }
    }
    joy_.is_wheel = false;
    joy_.switch_key = UNDEFINED_KEY;
    joy_.switch_mouse = UNDEFINED_KEY;
}

Layer::~Layer() {
}

void Layer::Parse() {
    // TODO
}

void Layer::Output(std::ofstream &ofs) const {
    // TODO
}

LayerSet::LayerSet(const std::string &directory_path_arg) : directory_path_(directory_path_arg) {
    for (size_t i = 0; i < LAYER_HEIGHT; i++) {
        for (size_t j = 0; j < LAYER_WIDTH; j++) {
            layer_key_[i][j] = 0;
        }
    }
}

LayerSet::~LayerSet() {

}

size_t LayerSet::GetLayerCount() const {
    return layer_.size();
}

void LayerSet::Parse() {
    // TODO
}

void LayerSet::Output(std::ofstream &ofs) const {
    // TODO
}


LayoutSet::LayoutSet(const std::string &directory_path_arg) : directory_path_(directory_path_arg) {

}

LayoutSet::~LayoutSet() {

}

size_t LayoutSet::GetLayoutCount() const {
    return layout_.size();
}

void LayoutSet::Parse() {
    // TODO
}

void LayoutSet::Output(std::ofstream &ofs) const {
    // TODO
}
