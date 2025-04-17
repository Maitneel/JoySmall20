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

void FirmwereGenerator::Generate(const std::string &output_directory) {
    std::string output_path = output_directory;
    std::ofstream ofs;

    if (output_directory.length() != 0 && output_directory.at(output_directory.length() - 1) != '/') {
        output_path += '/';
    }
    output_path += OUTPUT_FILE_NAME;
    try {
        ofs.exceptions(std::ofstream::failbit);
        ofs.open(output_path);
        ofs << "hogehoge\nt";
    } catch (const std::ofstream::failure &e) {
        std::cerr << output_directory << ": " << e.what() << std::endl;
        throw std::runtime_error("ofstream");
    }
    layout_.Output(ofs);
    ofs.close();
}
