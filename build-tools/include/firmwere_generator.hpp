#ifndef INCLUDE_FIRMWERE_GENERATOR_HPP_
#define INCLUDE_FIRMWERE_GENERATOR_HPP_

#include <string>
#include "firmweres_structor.hpp"

#define OUTPUT_FILE_NAME "keymap.ino"

class FirmwereGenerator {
 public:
    FirmwereGenerator(const std::string &src_directory_path_arg);
    ~FirmwereGenerator();

    void Parse();
    void Generate(const std::string &output_directory);

 private:
    const std::string src_directory_;
    LayoutSet layout_;
};

#endif // INCLUDE_FIRMWERE_GENERATOR_HPP_
