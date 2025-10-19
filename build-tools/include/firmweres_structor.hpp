#ifndef INCLUDE_FIRMWERES_STRUCTOR_HPP_
#define INCLUDE_FIRMWERES_STRUCTOR_HPP_

#include <cstdint>
#include <string>
#include <map>
#include <fstream>

#define LAYER_HEIGHT 4
#define LAYER_WIDTH 5

#define UNDEFINED_KEY 0


struct Joystick {
    bool is_wheel;
    unsigned char switch_key; 
    unsigned char switch_mouse;
};

class Layer {
 public:
    Layer(const std::string &file_path_arg);
    ~Layer();
    void Parse();
    void Output(std::ofstream &ofs) const;

 private:
    const std::string file_path_;
    unsigned char mousemap_[LAYER_HEIGHT][LAYER_WIDTH];
    unsigned char keymap_[LAYER_HEIGHT][LAYER_WIDTH];
    Joystick joy_;
    unsigned char re_mouse_;
    unsigned char re_key_;
};


class Layout {
 public:
    Layout(const std::string &directory_path_arg);
    ~Layout();

    size_t GetLayerCount() const;
    void Parse();
    void Output(std::ofstream &ofs) const;

 private:
    const std::string directory_path_;
    uint8_t layer_key_[LAYER_HEIGHT][LAYER_WIDTH];
    std::map<int, Layer> layer_;
};

class LayoutSet {
 public:
    LayoutSet(const std::string &directory_path_arg);
    ~LayoutSet();

    size_t GetLayoutCount() const;
    void Parse();
    void Output(std::ofstream &ofs) const;

 private:
    const std::string directory_path_;
    std::map<int, Layout> layout_;
};

#endif // INCLUDE_FIRMWERES_STRUCTOR_HPP_
