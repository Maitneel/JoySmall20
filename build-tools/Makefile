NAME = firmwere_generator

CXX = g++
CXXFLAGS = -Wall -Wextra -Wshadow

INCLUDE_DIR = ./include
SRCS_DIR = ./srcs
OBJS_DIR = ./objs

OBJS_SUBDIR = ${sort ${dir ${OBJS}}}

SRCS =	main.cpp \

SRCS :=	${patsubst %,${SRCS_DIR}/%,${SRCS}}
	
OBJS = ${subst ${SRCS_DIR},${OBJS_DIR},${SRCS:%.cpp=%.o}}

${NAME} : ${OBJS_SUBDIR} ${OBJS}
	${CXX} ${CXXFLAGS} -o ${NAME} ${OBJS}

${OBJS_SUBDIR}:
	mkdir -p ${OBJS_SUBDIR}

${OBJS_DIR}/%.o: ${SRCS_DIR}/%.cpp
	${CXX} ${CXXFLAGS} -I ${INCLUDE_DIR} -c -o $@ $^

.PHONY: all
all: ${NAME}

.PHONY: clean
clean:
	rm -rf ${OBJS}
	rm -rf ${OBJS_DIR}

.PHONY: fclean
fclean: clean
	rm -rf ${NAME}

.PHONY: re
re: fclean all
