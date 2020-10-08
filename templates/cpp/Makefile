CXX		:= g++
CXXFLAGS	:= -std=c++17 -Wall -Wextra -g
LDFLAGS		:=

BIN		:= bin
SRC		:= src
INCLUDE	:= include
LIB		:= lib

LIBRARIES	:=


MD 		:= mkdir
ifeq ($(OS),Windows_NT)
EXECUTABLE	:= main.exe
SOURCEDIRS	:= $(SRC)
INCLUDEDIRS	:= $(INCLUDE)
LIBDIRS		:= $(LIB)
RM = cmd //C del //Q //F
RRM = cmd //C rmdir //Q //S
else
EXECUTABLE	:= main
SOURCEDIRS	:= $(shell find $(SRC) -type d)
INCLUDEDIRS	:= $(shell find $(INCLUDE) -type d)
LIBDIRS		:= $(shell find $(LIB) -type d)
RM = rm -f
RRM = rm -f -r
endif

CINCLUDES	:= $(patsubst %,-I%, $(INCLUDEDIRS:%/=%))
CLIBS		:= $(patsubst %,-L%, $(LIBDIRS:%/=%))

SOURCES		:= $(wildcard $(patsubst %,%/*.cpp, $(SOURCEDIRS)))
OBJECTS		:= $(SOURCES:.cpp=.o)

all: $(BIN) $(BIN)/$(EXECUTABLE)
	@echo "Executing 'all' complete!"

$(BIN):
	$(MD) -p $(BIN)

.PHONY: clean
clean:
	-$(RM) $(BIN)/$(EXECUTABLE)
	-$(RM) $(OBJECTS)
	@echo "Cleanup complete!"

run: all
	./$(BIN)/$(EXECUTABLE)
	@echo "Executing 'run: all' complete!"
	
.cpp.o:
	$(CXX) -c $(LDFLAGS) $(CINCLUDES) $(CLIBS) $< -o $@ $(LIBRARIES)
	@echo "Compiled "$<" successfully!"

$(BIN)/$(EXECUTABLE): $(OBJECTS)
	$(CXX) $(LDFLAGS) $(CINCLUDES) $(CLIBS) $^ -o $@ $(LIBRARIES)
	@echo "Linking complete!"