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
(set to: 'true' if "file too big" exceptions occur, auto to handle it automatically or false to ignore it)
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


#display complete info (this is automatically set to true when "make debug" is called)
DISP_INFO	= flase





#---------------------------------------------------------------------------------
#------------------------ DO NOT EDIT BELOW THIS LINE ----------------------------
#---------------------------------------------------------------------------------

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
	MD			:= mkdir -p
else
	TARGET		:= $(TARGET_NAME)
	SRC_DIR		:= $(shell find $(SRC_DIR_NAME) -type d)
	TARGET_DIR	:= $(shell find $(TARGET_DIR_NAME) -type d)
	OBJ_DIR		:= $(shell find $(OBJECT_DIR_NAME) -type d)
	INCL_DIRS	:= $(shell find $(INCLUDE_DIR_NAME) -type d)
	LIB_DIRS	:= $(shell find $(LIB_DIR_NAME) -type d)
	FIXPATH 	= $1
	RM 			= rm -f
	MD			:= mkdir -p
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
########## UTILITY ##########
#############################


#chose text style
COLOR = $(if $(filter red,$2),"\e[1;31m$(subst ",,$1)\e[0m",\
			$(if $(filter green,$2),"\e[1;32m$(subst ",,$1)\e[0m",\
				$(if $(filter yellow,$2),"\e[1;33m$(subst ",,$1)\e[0m",\
					$(if $(filter blue,$2),"\e[1;34m$(subst ",,$1)\e[0m",\
						$(if $(filter magenta,$2),"\e[1;35m$(subst ",,$1)\e[0m",\
							$(if $(filter cyan,$2),"\e[1;36m$(subst ",,$1)\e[0m",$1))))))
#enable echo output styling
PRINTLN := echo -e





#############################
######### MESSAGES ##########
#############################


#display complete info
AT			= $(if $(filter true,$(DISP_INFO)),,@)
-S			= $(if $(filter true,$(DISP_INFO)),--no-silent,-s)
-W			= $(if $(filter true,$(DISP_INFO)),--print-directory,--no-print-directory)

#messages
MESSAGE_0.0	= $(PRINTLN) $(call COLOR,Executing 'all' complete!,green)
MESSAGE_0.1	= $(PRINTLN) $(call COLOR,Executing 'all' complete by using 'BIGFILE' flag!,yellow)
MESSAGE_0.2	= $(PRINTLN) $(call COLOR,'BIGFILE' exceptions handler failed!,red)
MESSAGE_0.3	= $(PRINTLN) $(call COLOR,Executable,green) "'$(TARGET_OUTPUT)'" $(call COLOR,is already up to date!,green)
MESSAGE_1.0	= echo Removing files..
MESSAGE_1.1	= echo Removing directories..
MESSAGE_1.2	= echo Cleanup complete!
MESSAGE_2.0	= echo Making directories..
MESSAGE_2.1	= echo Compilator..
MESSAGE_2.3	= $(PRINTLN) $(call COLOR,Warning!,magenta) Attempt to handle "'File too big'" exception by enabling the "'BIGFILE'" flag..
MESSAGE_3.0	= echo Creating dir:
MESSAGE_3.1	= echo Compiling object file: $@
MESSAGE_3.2	= echo Assebling compiled objects into: $@
MESSAGE_4.0	= echo Remake complete!
MESSAGE_4.1	= echo Executing 'run: all' complete!





#############################
######### ASSEMBLER #########
#############################


# makes build directory, updates your objects, builds your executable
all: --directories
	@echo;
	@if $(MAKE) -q $(TARGET_OUTPUT); then \
		$(MESSAGE_0.3); \
	elif $(MESSAGE_2.1) && $(MAKE) $(-W) $(TARGET_OUTPUT); then \
		echo; $(MESSAGE_0.0); \
	else $(MAKE) $(-S) exp_handler; \
	fi

# updates your objects, builds your executable
$(TARGET_OUTPUT): $(OBJECTS)
	@echo; $(MESSAGE_3.2)
	$(AT) $(CCX) $(CXXFLAGS) $^ -o $@ $(LFLAGS) $(LIBS) $(INCLUDES)





#############################
######### COMPILER ##########
#############################


# include all .d files
-include $(DEPS)

#builds your objects
# -MMD generates dependency output files same name as the .o file
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.$(SRCEXT)
	$(if $(AT),@,@echo;) $(MESSAGE_3.1)
	$(AT) $(CCX) $(CXXFLAGS) $(BIG_EXP) -c -MMD $< -o $@ $(LFLAGS) $(LIBS) $(INCLUDES) 





#############################
########## RECIPES ##########
#############################


#recursive exceptions handler
exp_handler:
	@if [ $(BIGFILE) = auto ]; then \
		echo; $(MESSAGE_2.3); echo; \
		if $(MAKE) BIGFILE=true; then \
			$(MESSAGE_0.1); echo; \
		else echo; $(MESSAGE_0.2); echo; exit 1; \
		fi \
	else (exit 1); \
	fi

#Make the Directories
--directories:
	@if [ ! -d $(OBJ_DIR) ] || [ ! -d $(TARGET_DIR) ]; then echo; $(MESSAGE_2.0); fi
	@if [ ! -d $(OBJ_DIR) ]; then $(MESSAGE_3.0) $(OBJ_DIR); fi
	$(AT) $(MD) $(OBJ_DIR)
	@if [ ! -d $(TARGET_DIR) ]; then $(if $(AT),,echo;) $(MESSAGE_2.1) $(TARGET_DIR); fi
	$(AT) $(MD) $(TARGET_DIR)

#Cean removes all the object and executable files
clean:
	@echo; $(MESSAGE_1.0)
	$(AT) $(RM) $(TARGET_OUTPUT)
	$(AT) $(RM) $(call FIXPATH,$(OBJECTS))
	$(AT) $(RM) $(call FIXPATH,$(DEPS))
	$(if $(AT),@,@echo;) $(MESSAGE_1.1)
	$(AT) $(RM) -rf $(OBJ_DIR) $(TARGET_DIR)
	$(if $(AT),@,@echo;) $(MESSAGE_1.2)

#Remake does clean and compile all
remake: clean all
	@echo; $(MESSAGE_4.0)

#Run compiles all and runs the executable
run: all
	@echo Running the executable: $(TARGET_OUTPUT)
	$(AT) $(TARGET_OUTPUT)
	@echo; $(MESSAGE_4.1)

#makefile debugger
debug:
	$(MAKE) DISP_INFO=true

#Help is intended to provide the user a minimum of guide-lines
help:
	@echo
	@echo "make        - builds/updates everything, is ready to run with $(TARGET_OUTPUT) after completion"
	@echo "make clean  - removes object file folder and executable"
	@echo "make remake - remake consist of cleaning and compileing all"
	@echo "make run    - builds/updates everything, runs immediately"
	@echo

#Non-File Targets
.PHONY: all clean remake run debug help
