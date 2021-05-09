#	INSTRUCTIONS:
# 'make'        build executable file 'main'
# 'make run'    build and run executable file
# 'make run?..  unlike 'run', it allows passing arguments to the executable (e.g: make run?MyArgs OR make run?'My Args')
# 'make clean'  removes every .o and executable files
# 'make remake' execute a make clean and subsequently compile all
# 'make help'   show brief guide-lines about this makefile usage

#---------------------------------------------------------------------------------
#------------------------ YOU CAN EDIT BELOW THIS LINE ---------------------------
#---------------------------------------------------------------------------------

# sources extension corrisponds to the "project language"\
	(if set to auto it will try to fetch it itslef. Alternatively enter it manually: cpp, c, ...)
SRC_EXT				:=	auto
# define the compiler to use (e.g: gcc, c++, ...)
CCX				=	auto
# define the compiler support version (e.g: 98, 99, 11, 14, 17, 2a, ...)
COMPILER_SUPPORT		=	auto
# to compile and optimize code \
	(set to 'true' to get optimizer -Ofast, 'auto' to handle it automatically or any optimizer else, like -O0, -O1, -O2, -O3, ...)
OPTIMIZER			=	auto
# get general warnings (set to false to remove general warnings)
GENERAL_WARNINGS   		:=	true
# get larger amount of warnings (set to false to remove negligible warnings)
USE_STRICT 			:=	false



# define the executable output name (if set to auto it will automatically be assigned the main file name)
TARGET_NAME			=	auto
# custom flags:
LFLAGS 				:=
CCXFLAGS			:=
# debug
DEBUG				:= -g

# define library paths in addition to /usr/lib
#   if I wanted to include libraries not in /usr/lib I'd specify
#   their path using -Lpath, something like:

# define output directory
TARGET_DIR_NAME		:=	build
# define output directory
OBJECT_DIR_NAME		:=	bin
# define source directory 
SRC_DIR_NAME		:=	src
# define include directory
INCLUDE_DIR_NAME	:=	include
# define lib directory
LIB_DIR_NAME		:=	lib


# display complete info (this is automatically set to true when "make debug" is called)
DISP_INFO		=	false





#---------------------------------------------------------------------------------
#------------------------ DO NOT EDIT BELOW THIS LINE ----------------------------
#---------------------------------------------------------------------------------

#############################
####### DIRECTORIES #########
#############################


# defining directories
ifeq ($(OS),Windows_NT)
	OS_EXE		:=	.exe
	SRC_DIR		:=	$(SRC_DIR_NAME)
	TARGET_DIR	:=	$(TARGET_DIR_NAME)
	OBJ_DIR		:=	$(OBJECT_DIR_NAME)
	INCL_DIRS	:=	$(INCLUDE_DIR_NAME)
	LIB_DIRS	:=	$(LIB_DIR_NAME)
	FIXPATH 	=	$(subst /,\,$1)
	RM			:=	del /q /f
	MD			:=	mkdir
else
	OS_EXE		:=
	SRC_DIR		:=	$(shell find $(SRC_DIR_NAME) -type d)
	TARGET_DIR	:=	$(shell find $(TARGET_DIR_NAME) -type d)
	OBJ_DIR		:=	$(shell find $(OBJECT_DIR_NAME) -type d)
	INCL_DIRS	:=	$(shell find $(INCLUDE_DIR_NAME) -type d)
	LIB_DIRS	:=	$(shell find $(LIB_DIR_NAME) -type d)
	FIXPATH 	=	$1
	RM 			:=	rm -f
	MD			:=	mkdir -p
endif

# main finder regex
MAIN_MATCH	:= "^(\s)*(unsigned\s+)?(void|bool|short|int|long|long\s+long|double|char)\s+main\s*\((\s|\S)*\)\s*\{?"

# project language detector ('$s ' stands for literal space)
SRCEXT0	:=	$(if $(subst auto,,$(SRC_EXT)),$(subst $s ,,$(SRC_EXT)),$(firstword $(patsubst .%,%,$(filter .%,$(suffix\
					$(filter %.cpp %.c,$(shell egrep -E --include=\*.* -rnwl $(SRC_DIR) -e $(MAIN_MATCH))))))))
# final attempt to get the extension
SRCEXT	:=	$(if $(SRCEXT0),$(SRCEXT0),$(firstword $(patsubst .%,%,$(filter .%,$(suffix\
					$(filter %.cpp %.c,$(wildcard $(SRC_DIR)/*.*)))))))

# automatically generate target name by using the main file name
TARGET_N0 :=	$(subst $s ,,$(if $(subst auto,,$(TARGET_NAME)),$(subst $s ,_,$(TARGET_NAME)),\
							$(basename $(notdir $(shell egrep -E --include=\*.$(SRCEXT) -rnwl $(SRC_DIR) -e $(MAIN_MATCH))))))
# final attempt to get the name						
TARGET_N :=	$(subst $s ,,$(if $(TARGET_N0),$(TARGET_N0),\
							$(basename $(notdir $(wildcard $(SRC_DIR)/*.$(SRCEXT))))))

# setting target name and extension
TARGET		:=	$(if $(TARGET_N),$(TARGET_N),a)$(OS_EXE)

# define any directories containing header files other than /usr/include
INCLUDES	:=	$(patsubst %,-I%, $(INCL_DIRS:%/=%))
# define the C libs
LIBS		:=	$(patsubst %,-L%, $(LIB_DIRS:%/=%))
# define the C source files
SOURCES		:=	$(wildcard $(patsubst %,%/*.$(SRCEXT), $(SRC_DIR)))
# define the C object files
OBJECTS		:=	$(SOURCES:.$(SRCEXT)=.o)
# define the dependency output files
DEPS		:=	$(OBJECTS:.o=.d)

#
# The following part of the makefile is generic; it can be used to 
# build any executable just by changing the definitions above and by
# deleting dependencies appended to the file from 'make depend'

# finds all your objects that corrispond to your .cpp files, system agnostic version
OBJECTS 		:=	$(patsubst $(SRC_DIR)/%.$(SRCEXT),$(OBJ_DIR)/%.o, $(wildcard $(SRC_DIR)/*.$(SRCEXT)))
# defining target directory
TARGET_OUTPUT	:=	$(call FIXPATH,$(TARGET_DIR)/$(TARGET))





#############################
##### COMPILER SETTINGS #####
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
	else
		CCX :=
		STD :=
	endif
endif

# define the 'optimizer'
ifeq ($(OPTIMIZER),true)
	OPT := -Ofast
else ifeq ($(OPTIMIZER),auto)
	OPT := -Og
else ifneq ($(OPTIMIZER),false)
	OPT := $(OPTIMIZER)
endif

# define the lang support version
ifeq ($(subst auto,,$(COMPILER_SUPPORT)),)
	ifeq ($(STD),c)
		COMPILER_SUPPORT := 99
	else ifeq ($(STD),c++)
		COMPILER_SUPPORT := 17
	else
		COMPILER_SUPPORT :=
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
CXXFLAGS	:= -std=$(STD)$(COMPILER_SUPPORT) $(OPT) -Wall $(CCXFLAGS) $(CWARNS) $(DEBUG)





#############################
########## UTILITY ##########
#############################


# chose text style
COLOR = $(if $(filter red,$2),"\e[1;31m$(subst ",,$1)\e[0m",\
			$(if $(filter green,$2),"\e[1;32m$(subst ",,$1)\e[0m",\
				$(if $(filter yellow,$2),"\e[1;33m$(subst ",,$1)\e[0m",\
					$(if $(filter blue,$2),"\e[1;34m$(subst ",,$1)\e[0m",\
						$(if $(filter magenta,$2),"\e[1;35m$(subst ",,$1)\e[0m",\
							$(if $(filter cyan,$2),"\e[1;36m$(subst ",,$1)\e[0m",$1))))))
# enable echo output styling
PRINTLN := echo -e

# recipe debug
RECIPE_DEBUG = $(if $(AT),,echo $1) $1





#############################
######### MESSAGES ##########
#############################


# display complete info
AT			=	$(if $(filter true,$(DISP_INFO)),,@)
-S			=	$(if $(filter true,$(DISP_INFO)),--no-silent,-s)
-W			=	$(if $(filter true,$(DISP_INFO)),--print-directory,--no-print-directory)

# outcome messages
MESSAGE_0.0	:=	$(PRINTLN) $(call COLOR,Executing 'all' complete!,green)
MESSAGE_0.1	:=	$(PRINTLN) $(call COLOR,Executing 'all' complete by using '-Ofast' optimizer flag!,yellow)
MESSAGE_0.2	:=	$(PRINTLN) $(call COLOR,Exceptions handler failed!,red)
MESSAGE_0.3	=	$(PRINTLN) $(call COLOR,Executable,green) "'$(TARGET_OUTPUT)'" $(call COLOR,is already up to date!,green)
MESSAGE_0.4	:=	$(PRINTLN) $(call COLOR,Language detection failed! Pleas, fill manually the Makefile 'SRC_EXT' variable,red)
# header messages
MESSAGE_1.0	:=	$(PRINTLN) $(call COLOR,Removing files..,blue)
MESSAGE_1.1	:=	$(PRINTLN) $(call COLOR,Removing directories..,blue)
MESSAGE_1.2	:=	$(PRINTLN) $(call COLOR,Making directories..,blue)
MESSAGE_1.3	:=	$(PRINTLN) $(call COLOR,Compilator..,blue)
MESSAGE_1.4	:=	$(PRINTLN) $(call COLOR,Warning!,magenta) Attempt to handle the exception by enabling the "'-Ofast'" optimizer flag..
# body messages
MESSAGE_2.0	:=	echo Creating dir:
MESSAGE_2.1	=	echo Compiling object file: $@
MESSAGE_2.2	=	echo Assembling compiled objects into: $@
MESSAGE_2.3	=	echo Running the executable: $(TARGET_OUTPUT)
MESSAGE_2.4	:=	echo Removing:
# footer messages
MESSAGE_3.0	:=	echo Cleanup complete!
MESSAGE_3.1	:=	echo Nothing to be deleted!
MESSAGE_3.2	:=	echo Remake complete!
MESSAGE_3.3	:=	echo Executing 'run: all' complete!





#############################
######### ASSEMBLER #########
#############################


# makes build directory, updates your objects, builds your executable
all: --directories
	@echo;
	@if [ $(SRCEXT) ]; then \
		if $(MAKE) $(-W) -q $(TARGET_OUTPUT); then \
			$(MESSAGE_0.3); \
		elif $(MESSAGE_1.3) && $(MAKE) $(-W) $(TARGET_OUTPUT); then \
			echo; $(MESSAGE_0.0); \
		else $(MAKE) $(-S) exp_handler; \
		fi \
	else $(MESSAGE_0.4); \
	fi

# updates your objects, builds your executable
$(TARGET_OUTPUT): $(OBJECTS)
	@echo; $(MESSAGE_2.2)
	$(AT) $(CCX) $(CXXFLAGS) $^ -o $@ $(LFLAGS) $(LIBS) $(INCLUDES)





#############################
######### COMPILER ##########
#############################


# include all .d files
-include $(DEPS)

# builds your objects
# -MMD generates dependency output files same name as the .o file
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.$(SRCEXT)
	$(if $(AT),@,@echo;) $(MESSAGE_2.1)
	$(AT) $(CCX) $(CXXFLAGS) -c -MMD $< -o $@ $(LFLAGS) $(LIBS) $(INCLUDES) 





#############################
########## RECIPES ##########
#############################


# recursive exceptions handler
exp_handler:
	@if [ $(OPTIMIZER) = auto ]; then \
		echo; $(MESSAGE_1.4); echo; \
		if $(MAKE) OPTIMIZER=true; then \
			$(MESSAGE_0.1); echo; \
		else echo; $(MESSAGE_0.2); echo; exit 1; \
		fi \
	else (exit 1); \
	fi

# Make the Directories
--directories:
	@if [ ! -d $(OBJ_DIR) ] || [ ! -d $(TARGET_DIR) ]; then echo; $(MESSAGE_1.2); fi
	@if [ ! -d $(OBJ_DIR) ]; then \
		$(if $(AT),,echo;) \
		$(MESSAGE_2.0) $(OBJ_DIR); \
		$(call RECIPE_DEBUG, $(MD) $(OBJ_DIR);) \
	fi
	@if [ ! -d $(TARGET_DIR) ]; then \
		$(if $(AT),,echo;) \
		$(MESSAGE_2.0) $(TARGET_DIR); \
		$(call RECIPE_DEBUG, $(MD) $(TARGET_DIR);) \
	fi

# Clean removes all the object and executable files
clean:
	@echo; 
	@if [ -d $(OBJ_DIR) ] || [ -d $(TARGET_DIR) ]; then \
		$(MESSAGE_1.0); \
		$(MESSAGE_2.4) $(TARGET_OUTPUT); \
		$(call RECIPE_DEBUG, $(RM) $(TARGET_OUTPUT);) \
		$(MESSAGE_2.4) $(call FIXPATH,$(OBJECTS)); \
		$(call RECIPE_DEBUG, $(RM) $(call FIXPATH,$(OBJECTS));) \
		$(MESSAGE_2.4) $(call FIXPATH,$(DEPS)); \
		$(call RECIPE_DEBUG, $(RM) $(call FIXPATH,$(DEPS));) \
		echo; $(MESSAGE_1.1); \
		$(MESSAGE_2.4) $(OBJ_DIR) $(TARGET_DIR); \
		$(call RECIPE_DEBUG, $(RM) -rf $(OBJ_DIR) $(TARGET_DIR);) \
		echo; $(MESSAGE_3.0); \
	else $(MESSAGE_3.1); \
	fi

# Remake does clean and compile all
remake: clean all
	@echo; $(MESSAGE_3.2)

# Run compiles all and runs the executable
run: all
	@$(MESSAGE_2.3)
	$(AT) $(TARGET_OUTPUT)
	@echo; $(MESSAGE_3.3)

# run by passing arguments to the "main"
run?%:
	@$(if $(subst run?,,$@),\
		$(MAKE) $(-W) all &&\
		$(MESSAGE_2.3) $(subst run?,,$@) &&\
		$(TARGET_OUTPUT) $(subst run?,,$@) &&\
		echo && $(MESSAGE_3.3),)

# makefile debugger
debug:
	$(MAKE) DISP_INFO=true

# Help is intended to provide the user a minimum of guide-lines
help:
	@echo
	@$(PRINTLN) $(call COLOR,make,yellow) "       - builds/updates everything, is ready to run with $(TARGET_OUTPUT) after completion"
	@$(PRINTLN) $(call COLOR,make,yellow) "clean  - removes object file folder and executable"
	@$(PRINTLN) $(call COLOR,make,yellow) "remake - remake consist of cleaning and compiling all"
	@$(PRINTLN) $(call COLOR,make,yellow) "run    - builds/updates everything, runs immediately"
	@$(PRINTLN) $(call COLOR,make,yellow) run?.. - unlike \'run\', it allows passing arguments to the executable \
		"("e.g: $(call COLOR,make,yellow) run?\'My Arguments\' OR $(call COLOR,make,yellow) run?MyArguments")"
	@$(PRINTLN) $(call COLOR,make,yellow) "debug  - builds/updates everything displaying more detailed messages"
	@echo

# Non-File Targets
.PHONY: all clean remake run run? run?% debug help
