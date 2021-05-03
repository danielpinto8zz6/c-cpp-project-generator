#	INSTRUCTIONS:
# 'make'        build executable file 'main'
# 'make run'    build and run executable file
# 'make clean'  removes all .o and executable files
# 'make remake' execute a make clean and subsequently compile all
# 'make help'   show brief guide-lines about this makefile usage

#---------------------------------------------------------------------------------
#------------------------ YOU CAN EDIT BELOW THIS LINE ---------------------------
#---------------------------------------------------------------------------------

# sources extension (project language)
SRCEXT				:= cpp
# define the compiler to use (e.g: gcc, c++, ...)
CCX					= auto
# define the compiler support version (e.g: 98, 99, 11, 14, 17, 2a, ...)
COMPILER_SUPPORT	= auto
# to compile big sized objects \
(set to: 'true' if "too big file" exceptions occur, auto to handle it automatically or false to ignore it)
BIGFILE				= auto
# get general warnings (set to false to remove general warnings)
GENERAL_WARNINGS    := true
# get larger amount of warnings (set to false to remove negligible warnings)
USE_STRICT 			:= false



# define the executable output name
TARGET_NAME			:= software
# custom flags:
LFLAGS 				:=
CCXFLAGS			:=
#debug
DEBUG				:= -g

# define library paths in addition to /usr/lib
#   if I wanted to include libraries not in /usr/lib I'd specify
#   their path using -Lpath, something like:

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





#---------------------------------------------------------------------------------
#------------------------ DO NOT EDIT BELOW THIS LINE ----------------------------
#---------------------------------------------------------------------------------

#############################
#### COMPILER SEGTTINGS #####
#############################

STD = $(subst p,+,$(SRCEXT))

# define the compiler to use
ifeq  ($(subst auto,,$(CCX)),)
	ifeq ($(SRCEXT),c)
		CCX := gcc
		STD := c
	else ifeq ($(SRCEXT),cpp)
		CCX := g++
		STD := c++
	endif
endif

# define the 'big sized objects' handler
ifeq ($(BIGFILE),true)
	BIG_EXP := -Wa,-mbig-obj
endif

# define the lang support version
ifeq ($(subst auto,,$(COMPILER_SUPPORT)),)
	ifeq ($(STD),c)
		COMPILER_SUPPORT := 99
	else ifeq ($(STD),c++)
		COMPILER_SUPPORT := 17
	endif
endif





#############################
########### FLAGS ###########
#############################


# The next warnings are neither valid nor needed for C++
CWARNSC = -Wdeclaration-after-statement \
	-Wmissing-prototypes \
	-Wnested-externs \
	-Wstrict-prototypes \
	-Wc++-compat \
	-Wold-style-definition
# Warnings for gcc, not valid for clang
CWARNGCC = \
	-Wlogical-op \
	-Wno-aggressive-loop-optimizations

# Warnings valid for both C and C++
CWARNSCPP = \
	-Wfatal-errors \
	-Wextra \
	-Wshadow \
	-Wsign-compare \
	-Wundef \
	-Wwrite-strings \
	-Wredundant-decls \
	-Wdisabled-optimization \
	-Wdouble-promotion
# the next warnings might be useful sometimes,
# but usually they generate too much noise
CWARNSCPP_STRICT = \
	-Werror \
	-pedantic \
	-Wconversion  \
	-Wsign-conversion \
	-Wstrict-overflow=2 \
	-Wformat=2 \
	-Wcast-qual

# define flags
ifeq ($(findstring gcc,$(CCX)),gcc)
	STD := c
	ifeq ($(GENERAL_WARNINGS),true)
		CWARNS = $(CWARNSC) $(CWARNGCC)
		ifeq ($(USE_STRICT),true)
			CWARNS += $(CWARNSCPP_STRICT)
		endif
	endif
else ifeq ($(findstring g++,$(CCX)),g++)
	STD := c++
	ifeq ($(GENERAL_WARNINGS),true)
		CWARNS = $(CWARNSCPP)
		ifeq ($(USE_STRICT),true)
			CWARNS += $(CWARNSCPP_STRICT)
		endif
	endif
endif


# define any compile-time flags
CXXFLAGS	= -std=$(STD)$(COMPILER_SUPPORT) -Wall $(CCXFLAGS) $(CWARNS) $(DEBUG)





#############################
####### DIRECTORIES #########
#############################


#defining directories
ifeq ($(OS),Windows_NT)
	TARGET		:= $(TARGET_NAME).exe
	SRC_DIR		:= $(SRC_DIR_NAME)
	TARGET_DIR	:= $(TARGET_DIR_NAME)
	OBJ_DIR		:= $(OBJECT_DIR_NAME)
	INCL_DIRS	:= $(INCLUDE_DIR_NAME)
	LIB_DIRS	:= $(LIB_DIR_NAME)
	FIXPATH 	= $1$(subst /,\,$1)
	RM			= del /q /f
	MD			:= @mkdir -p
else
	TARGET		:= $(TARGET_NAME)
	SRC_DIR		:= $(shell find $(SRC_DIR_NAME) -type d)
	TARGET_DIR	:= $(shell find $(TARGET_DIR_NAME) -type d)
	OBJ_DIR		:= $(shell find $(OBJECT_DIR_NAME) -type d)
	INCL_DIRS	:= $(shell find $(INCLUDE_DIR_NAME) -type d)
	LIB_DIRS	:= $(shell find $(LIB_DIR_NAME) -type d)
	FIXPATH 	= $1
	RM 			= rm -f
	MD			:= @mkdir -p
endif

# define any directories containing header files other than /usr/include
INCLUDES	= $(patsubst %,-I%, $(INCL_DIRS:%/=%))
# define the C libs
LIBS		= $(patsubst %,-L%, $(LIB_DIRS:%/=%))
# define the C source files
SOURCES		= $(wildcard $(patsubst %,%/*.$(SRCEXT), $(SRC_DIR)))
# define the C object files
OBJECTS		= $(SOURCES:.$(SRCEXT)=.o)
# define the dependency output files
DEPS		= $(OBJECTS:.o=.d)

#
# The following part of the makefile is generic; it can be used to 
# build any executable just by changing the definitions above and by
# deleting dependencies appended to the file from 'make depend'

# finds all your objects that corrispond to your .cpp files, system agnostic version
OBJECTS 		:= $(patsubst $(SRC_DIR)/%.$(SRCEXT), $(OBJ_DIR)/%.o, $(wildcard $(SRC_DIR)/*.$(SRCEXT)))
# defining target directory
TARGET_OUTPUT	=	$(call FIXPATH,$(TARGET_DIR)/$(TARGET))






#############################
######### ASSEMBLER #########
#############################


# makes build directory, updates your objects, builds your executable
all: --directories
	@+$(MAKE) $(TARGET_OUTPUT) \
	&& echo Executing "'all'" complete! \
	|| $(MAKE) -s exp_handler

# updates your objects, builds your executable
$(TARGET_OUTPUT): $(OBJECTS)
	$(CCX) $(CXXFLAGS) $^ -o $@ $(LFLAGS) $(LIBS) $(INCLUDES)





#############################
######### COMPILER ##########
#############################


# include all .d files
-include $(DEPS)

#builds your objects
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp
	$(CCX) $(CXXFLAGS) $(BIG_EXP) -c -MMD $< -o $@ $(LFLAGS) $(LIBS) $(INCLUDES)





#############################
######### RECIPIES ##########
#############################


#recursive exceptions handler
exp_handler:
	@if [ $(BIGFILE) = auto ]; then \
		echo ;\
		echo Attempt to handle "'Too big file'" exception by enabling the "'BIGFILE'" flag; \
		echo ; \
		$(MAKE) BIGFILE=true; \
		echo ;\
		echo Executing "'all'" complete by using "'BIGFILE'" flag!; \
		echo ;\
	fi

#Make the Directories
--directories:
	$(MD) $(OBJ_DIR) $(TARGET_DIR)

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
