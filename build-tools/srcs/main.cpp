#include <iostream>

#include "firmwere_generator.hpp"

int main(int argc, char **argv) {
    if (3 < argc) {
        std::cerr << "usage: " << argv[0] << " [input_directory output_path]" << std::endl;
        return 1;
    }
    std::string input_directory;
    std::string output_path;
    if (2 <= argc) {
        input_directory = argv[1];
    } else {
        std::cerr << "input_directory  : " << std::flush;
        std::getline(std::cin, input_directory);
    }
    if (3 <= argc) {
        output_path = argv[2];
    } else {
        std::cerr << "output_directory : " << std::flush;
        std::getline(std::cin, output_path);
    }
    try {
        FirmwereGenerator generator(input_directory);
        generator.Parse();
        generator.Generate(output_path);
    } catch (const std::runtime_error &e) {
        return 2;
    }
}