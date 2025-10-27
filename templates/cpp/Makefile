#
# 'make'        builds executable file 'main'
# 'make clean'  removes all .o and executable files
# 'make start'  builds executable file 'main' and executes it
#

# define the Cpp compiler to use
CXX = g++

# define any compile-time flags
CXXFLAGS := -std=c++17 -Wall -Wextra -g

# define library paths in addition to /usr/lib
#   if I wanted to include libraries not in /usr/lib I'd specify
#   their path using -Lpath, something like:
LFLAGS =

# define output directory
OUTPUT := output

# define build directory
BUILD := build

# define source directory
SRC := src

# define include directory
INCLUDE := include

# define lib directory
LIB := lib

# enable or disable parallel build (true/false)
PARALLEL_BUILD := true

ifeq ($(OS),Windows_NT)
MAIN := main.exe
SOURCEDIRS := $(SRC)
INCLUDEDIRS := $(INCLUDE)
LIBDIRS := $(LIB)
FIXPATH = $(subst /,\,$1)
RM := del /q /f
MD := mkdir
else
MAIN := main
SOURCEDIRS := $(shell find $(SRC) -type d)
INCLUDEDIRS := $(shell find $(INCLUDE) -type d)
LIBDIRS := $(shell find $(LIB) -type d)
FIXPATH = $1
RM = rm -f
MD := mkdir -p
endif

# define any directories containing header files other than /usr/include
INCLUDES := $(patsubst %,-I%, $(INCLUDEDIRS:%/=%))

# define the C libs
LIBS := $(patsubst %,-L%, $(LIBDIRS:%/=%))

# define the C source files
SOURCES := $(wildcard $(patsubst %,%/*.cpp, $(SOURCEDIRS)))

# define the C object files (stored in build/)
OBJECTS := $(patsubst $(SRC)/%, $(BUILD)/$(SRC)/%, $(SOURCES:.cpp=.o))

# define the dependency output files (also in build/)
DEPS := $(OBJECTS:.o=.d)

#
# The following part of the makefile is generic; it can be used to
# build any executable just by changing the definitions above and by
# deleting dependencies appended to the file from 'make depend'
#

OUTPUTMAIN := $(call FIXPATH,$(OUTPUT)/$(MAIN))

all: $(BUILD) $(OUTPUT)
ifeq ($(PARALLEL_BUILD),true)
	@$(MAKE) -j $(OUTPUTMAIN)
else
	@$(MAKE) $(OUTPUTMAIN)
endif
	@echo Executing 'all' complete!

$(BUILD):
	$(MD) $(BUILD)

$(OUTPUT):
	$(MD) $(OUTPUT)

# Link all object files into the final executable
$(OUTPUTMAIN): $(OBJECTS)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $(OUTPUTMAIN) $(OBJECTS) $(LFLAGS) $(LIBS)

# include all .d files
-include $(DEPS)

# This rule builds .o and .d files from .cpp sources
# It automatically creates the necessary subdirectories inside build/
$(BUILD)/$(SRC)/%.o: $(SRC)/%.cpp
	@$(MD) $(dir $@)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c -MMD $< -o $@

.PHONY: clean
clean:
	$(RM) -r $(call FIXPATH,$(BUILD))
	$(RM) -r $(call FIXPATH,$(OUTPUT))
	@echo Cleanup complete!

run: all
	./$(OUTPUTMAIN)
	@echo Executing 'run: all' complete!

# ---------------------------------------------------------------------
# Start target: runs the built executable, building it first if needed
# ---------------------------------------------------------------------
.PHONY: start
start:
ifeq ($(wildcard $(OUTPUTMAIN)),)
	@echo "Executable not found. Building first..."
	@$(MAKE) all
endif
	@echo "Starting program..."
	./$(OUTPUTMAIN)
