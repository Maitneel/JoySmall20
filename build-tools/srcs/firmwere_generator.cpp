#include <string>
#include <iostream>
#include <fstream>
#include <exception>

#include "firmwere_generator.hpp"
#include "firmweres_structor.hpp"

FirmwereGenerator::FirmwereGenerator(const std::string &src_directory_path_arg) : src_directory_(src_directory_path_arg), layout_(src_directory_path_arg) {

}

FirmwereGenerator::~FirmwereGenerator() {

}

void FirmwereGenerator::Parse() {
    layout_.Parse();
}

void FirmwereGenerator::Generate(const std::string &output_path) {
    std::ofstream ofs;
    try {
        ofs.exceptions(std::ofstream::failbit);
        ofs.open(output_path);
    } catch (const std::ofstream::failure &e) {
        std::cerr << output_path << ": " << e.what() << std::endl;
        throw std::runtime_error("ofstream");
    }
    layout_.Output(ofs);
    ofs.close();
}
