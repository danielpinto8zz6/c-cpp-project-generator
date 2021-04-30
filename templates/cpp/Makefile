#	INSTRUCTIONS:
# 'make'        build executable file 'main'
# 'make run'    build and run executable file
# 'make clean'  removes all .o and executable files
# 'make remake' execute a make clean and subsequently a compile all
# 'make Help'   is intended to provide the user a minimum of guide-lines
#

# define the Cpp compiler to use
CXX			= g++
# sources extensions
SRCEXT			:= cpp
# define the compiler version
COMPILER_VERSION 	:= 17
# to compile large sized file
BIGFILE			= -Wa,-mbig-obj
# define library paths in addition to /usr/lib
#   if I wanted to include libraries not in /usr/lib I'd specify
#   their path using -Lpath, something like:
LFLAGS =
# define output directory
TARGET_DIR_NAME		:= build
# define output directory
OBJECT_DIR_NAME		:= bin
# define source directory
SRC_DIR_NAME		:= src
# define include directory
INCLUDE_DIR_NAME	:= include
# define lib directory
LIB_DIR_NAME		:= lib

# define the main
TARGET_NAME		= software



#---------------------------------------------------------------------------------
#DO NOT EDIT BELOW THIS LINE
#---------------------------------------------------------------------------------

# define any compile-time flags
CXXFLAGS	:= -std=$(subst p,+,$(SRCEXT))17 -Wall -Wextra -g

ifeq ($(OS),Windows_NT)
TARGET		:= $(TARGET_NAME).exe
SRC_DIR		:= $(SRC_DIR_NAME)
TARGET_DIR	:= $(TARGET_DIR_NAME)
OBJ_DIR		:= $(OBJECT_DIR_NAME)
INCL_DIRS	:= $(INCLUDE_DIR_NAME)
LIB_DIRS	:= $(LIB_DIR_NAME)
FIXPATH 	= $(subst /,\,$1)
RM		:= del /q /f
MD		:= @mkdir -p
else
TARGET		:= $(TARGET_NAME)
SRC_DIR		:= $(shell find $(SRC_DIR_NAME) -type d)
TARGET_DIR	:= $(shell find $(TARGET_DIR_NAME) -type d)
OBJ_DIR		:= $(shell find $(OBJECT_DIR_NAME) -type d)
INCL_DIRS	:= $(shell find $(INCLUDE_DIR_NAME) -type d)
LIB_DIRS	:= $(shell find $(LIB_DIR_NAME) -type d)
FIXPATH 	= $1
RM 		= rm -f
MD		:= @mkdir -p
endif

# define any directories containing header files other than /usr/include
INCLUDES	:= $(patsubst %,-I%, $(INCL_DIRS:%/=%))
# define the C libs
LIBS		:= $(patsubst %,-L%, $(LIB_DIRS:%/=%))
# define the C source files
SOURCES		:= $(wildcard $(patsubst %,%/*.$(SRCEXT), $(SRC_DIR)))
# define the C object files
OBJECTS		:= $(SOURCES:.cpp=.o)
# define the dependency output files
DEPS		:= $(OBJECTS:.o=.d)

#
# The following part of the makefile is generic; it can be used to 
# build any executable just by changing the definitions above and by
# deleting dependencies appended to the file from 'make depend'
#


# finds all your objects that corrispond to your .cpp files, system agnostic version
OBJECTS := $(patsubst $(SRC_DIR)/%.$(SRCEXT), $(OBJ_DIR)/%.o, $(wildcard $(SRC_DIR)/*.$(SRCEXT)))
TARGET_OUTPUT	:=	$(call FIXPATH,$(TARGET_DIR)/$(TARGET))


# makes build directory, updates your objects, builds your executable
all: 
	$(MD) $(OBJ_DIR) $(TARGET_DIR)
	+$(MAKE) $(TARGET)
	@echo Executing 'all' complete!

# updates your objects, builds your executable
$(TARGET): $(OBJECTS)
	$(CXX) $^ $(CXXFLAGS) -o $(TARGET_OUTPUT) $(LFLAGS) $(LIBS) $(INCLUDES)

# include all .d files
-include $(DEPS)

# builds your objects
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp
	$(CXX) $(CXXFLAGS) -c -MMD $< -o $@ $(LFLAGS) $(LIBS) $(INCLUDES)


#Cean removes all the object and executable files
clean:
	@echo Removing files..
	$(RM) $(TARGET_OUTPUT)
	$(RM) $(call FIXPATH,$(OBJECTS))
	$(RM) $(call FIXPATH,$(DEPS))
	@echo Removing directories..
	$(RM) -rf $(OBJ_DIR) $(TARGET_DIR)
	@echo Cleanup complete!

#Remake does clean and compile all
remake: clean all
	@echo Remake complete!

#Run compiles all and runs the executable
run: all
	$(TARGET_OUTPUT)
	@echo Executing 'run: all' complete!

#Help is intended to provide the user a minimum of guide-lines
help:
	@echo
	@echo "make        - builds/updates everything, is ready to run with $(TARGET_OUTPUT) after completion"
	@echo "make clean  - removes object file folder and executable"
	@echo "make remake - remake consist of cleaning and compileing all"
	@echo "make run    - builds/updates everything, runs immediately"
	@echo

#Non-File Targets
.PHONY: all clean remake run help
