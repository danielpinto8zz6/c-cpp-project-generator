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
CCX				:=	auto
# define the compiler support version (e.g: 98, 99, 11, 14, 17, 2a, ...)
COMPILER_SUPPORT		:=	auto
# to compile and optimize code (if set to false, the exceptions handler will not start, set to 'true' to get optimizer -Ofast,\
	'auto' to handle it automatically or any optimizer else like: -O0, -O1, -O2, -O3, ...)
OPTIMIZER			:=	auto
# get general warnings (set to false to remove general warnings)
GENERAL_WARNINGS		:=	true
# get larger amount of warnings (set to false to remove negligible warnings)
USE_STRICT			:=	false



# define the executable output name (if set to auto it will automatically be assigned the main file name)
TARGET_NAME			:=	auto
# custom flags:
LFLAGS				:=
CCXFLAGS			:=
# debug
DEBUG				:=	-g

# define library paths in addition to /usr/lib
#   if I wanted to include libraries not in /usr/lib I'd specify
#   their path using -Lpath, something like:

# define output directory
TARGET_DIR			:=	build
# define output directory
OBJECT_DIR			:=	bin
# define source directory 
SRC_DIR				:=	src
# define include directory
INCLUDE_DIR			:=	include
# define lib directory
LIB_DIR				:=	lib


# display complete info (this is automatically set to true when "make debug" is called)
DISP_INFO			:=	false





#---------------------------------------------------------------------------------
#------------------------ DO NOT EDIT BELOW THIS LINE ----------------------------
#---------------------------------------------------------------------------------

#############################
####### DIRECTORIES #########
#############################


# literal backslash
\ = \\#

# defining directories
ifeq ($(OS),Windows_NT)
	OS_EXE		:=	.exe
	INCL_DIRS	:=	$(INCLUDE_DIR)
	LIB_DIRS	:=	$(LIB_DIR)
	ifeq ($(findstring cygwin, $(shell echo $$OSTYPE)),cygwin)
		RM 		:=	rm -f
		RMDIR		:=	$(RM)r
		MD		:=	mkdir -p
		E_START		:=	"\e
		E_END		:=	\e[0m"
		ESC_SEQ		:=	-e
		BR		:=	;
		NL		:=	echo
		EXITSTATUS	:=	$$?
		MAIN_MATCH	:=	"^(\s)*(unsigned\s+)?(void|bool|short|int|long|long\s+long|double|char)\s+main\s*\((\s|\S)*\)\s*\{?"
		SRCEXT_FIND	=	egrep -E --include=\*.$(if $(SRCEXT),$(SRCEXT),*) -rnwl $(SRC_DIR) -e $(MAIN_MATCH)
		EXIT1		=	$(if $(filter true,$(DISP_INFO)),exit 1,exit 1 &> /dev/null)
		FIXPATH		=	$1
	else
		RM		:=	DEL /F/Q
		RMDIR		:=	RMDIR /Q/S
		MD		:=	MKDIR
		E_START		:=	
		E_END		:=	[0m
		BR		:=	&
		NL		:=	type nul | more /e /p
		EXITSTATUS	:=	%errorlevel%
		MAIN_MATCH	:=	"^[ ]*[unsigned ]*[void bool char short int long long long double ][ ][ ]*main[ ]*(.*)[ ]*{*"
		SRCEXT_FIND	=	findstr /s /i /m /r /c:$(MAIN_MATCH) $(SRC_DIR)/*.$(if $(SRCEXT),$(SRCEXT),*)
		EXIT1		=	$(if $(filter true,$(DISP_INFO)),exit 1,exit 1 >nul 2>&1)
		FIXPATH		=	$(subst /,$\,$1)
	endif
else
	SRC_DIR		:=	$(shell find $(SRC_DIR) -type d)
	INCL_DIRS	:=	$(shell find $(INCLUDE_DIR) -type d)
	LIB_DIRS	:=	$(shell find $(LIB_DIR) -type d)
	RM 		:=	rm -f
	RMDIR		:=	$(RM)r
	MD		:=	mkdir -p
	E_START		:=	"\e
	E_END		:=	\e[0m"
	BR		:=	;
	NL		:=	echo
	EXITSTATUS	:=	$$?
	MAIN_MATCH	:=	"^(\s)*(unsigned\s+)?(void|bool|short|int|long|long\s+long|double|char)\s+main\s*\((\s|\S)*\)\s*\{?"
	SRCEXT_FIND	=	egrep -E --include=\*.$(if $(SRCEXT),$(SRCEXT),*) -rnwl $(SRC_DIR) -e $(MAIN_MATCH)
	EXIT1		=	$(if $(filter true,$(DISP_INFO)),exit 1,exit 1 &> /dev/null)
	FIXPATH		=	$1
endif


# project language detector ('$s ' stands for literal space)
SRCEXT0		:=	$(if $(subst auto,,$(SRC_EXT)),$(subst $s ,,$(SRC_EXT)),$(firstword $(patsubst .%,%,$(filter .%,$(suffix\
					$(filter %.cpp %.c,$(shell $(SRCEXT_FIND))))))))
# final attempt to get the extension
SRCEXT		:=	$(if $(SRCEXT0),$(SRCEXT0),$(firstword $(patsubst .%,%,$(filter .%,$(suffix\
					$(filter %.cpp %.c,$(wildcard $(SRC_DIR)/*.*)))))))

# automatically generate target name by using the main file name
TARGET_N0	:=	$(subst $s ,,$(if $(subst auto,,$(TARGET_NAME)),$(subst $s ,_,$(TARGET_NAME)),\
							$(basename $(notdir $(shell $(SRCEXT_FIND))))))
# final attempt to get the name				
FILES_NAME	:=	$(basename $(notdir $(wildcard $(SRC_DIR)/*.$(SRCEXT))))
TARGET_N	:=	$(subst $s ,,$(if $(TARGET_N0),$(TARGET_N0),$(if $(filter 1,$(words $(FILES_NAME))),$(FILES_NAME),)))

# setting target name and extension
TARGET		:=	$(if $(TARGET_N),$(TARGET_N),a)$(OS_EXE)

# define any directories containing header files other than /usr/include
INCLUDES	:=	$(patsubst %,-I%, $(INCL_DIRS:%/=%))
# define the C libs
LIBS		:=	$(patsubst %,-L%, $(LIB_DIRS:%/=%))
# define the C source files
SOURCES		:=	$(wildcard $(patsubst %,%/*.$(SRCEXT), $(SRC_DIR)))

# finds objects that corrispond to the src files, system agnostic version
OBJECTS		:=	$(patsubst $(SRC_DIR)/%.$(SRCEXT),$(OBJECT_DIR)/%.o, $(SOURCES))
# define the dependency output files
DEPS		:=	$(OBJECTS:.o=.d)
# defining target directory
TARGET_OUTPUT	:=	$(call FIXPATH,$(TARGET_DIR)/$(TARGET))
#
# The following part of the makefile is generic; it can be used to 
# build any executable just by changing the definitions above and by
# deleting dependencies appended to the file from 'make depend'





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
CWARNSC = \
	-Wdeclaration-after-statement \
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
COLOR = $(if $(filter red,$2),$(E_START)[1;31m$(subst ",,$1)$(E_END),$(if \
			$(filter green,$2),$(E_START)[1;32m$(subst ",,$1)$(E_END),$(if \
				$(filter yellow,$2),$(E_START)[1;33m$(subst ",,$1)$(E_END),$(if \
					$(filter blue,$2),$(E_START)[1;34m$(subst ",,$1)$(E_END),$(if \
						$(filter magenta,$2),$(E_START)[1;35m$(subst ",,$1)$(E_END),$(if \
							$(filter cyan,$2),$(E_START)[1;36m$(subst ",,$1)$(E_END),$1))))))
# enable echo output styling
PRINTLN := echo$(if $(ESC_SEQ), $(ESC_SEQ),)

# recipe debug
RECIPE_DEBUG = $(if $(AT),,echo $1) $1





#############################
######### MESSAGES ##########
#############################


# display complete info
AT		=	$(if $(filter true,$(DISP_INFO)),,@)
-S		=	$(if $(filter true,$(DISP_INFO)),,-s)
-W		=	$(if $(filter true,$(DISP_INFO)),--print-directory,--no-print-directory)

# outcome messages
MESSAGE_0.0	:=	$(PRINTLN) $(call COLOR,Executing 'all' complete!,green)
MESSAGE_0.1	:=	$(PRINTLN) $(call COLOR,Executing 'all' complete by using '-Ofast' optimizer flag!,yellow)
MESSAGE_0.2	:=	$(PRINTLN) $(call COLOR,Executing 'all' failed!,red)
MESSAGE_0.3	=	$(PRINTLN) $(call COLOR,Executable,green) "'$(TARGET_OUTPUT)'" $(call COLOR,is already up to date!,green)
MESSAGE_0.4	:=	$(PRINTLN) $(call COLOR,Language detection failed! Please  fill manually the Makefile 'SRC_EXT' variable,red)
# header messages
MESSAGE_1.0	:=	$(PRINTLN) $(call COLOR,Removing files..,blue)
MESSAGE_1.1	:=	$(PRINTLN) $(call COLOR,Removing directories..,blue)
MESSAGE_1.2	:=	$(PRINTLN) $(call COLOR,Making directories..,blue)
MESSAGE_1.3	:=	$(PRINTLN) $(call COLOR,Compilator..,blue)
MESSAGE_1.4	:=	$(PRINTLN) $(call COLOR,Assembler..,blue)
MESSAGE_1.5	:=	$(PRINTLN) $(call COLOR,Warning!,magenta) Attempt to handle the exception by enabling the "'-Ofast'" optimizer flag..
# body messages
MESSAGE_2.0	:=	echo Creating dir:
MESSAGE_2.1	=	echo Compiling object file: $@
MESSAGE_2.2	=	echo Assembling compiled objects into: $@
MESSAGE_2.3	=	echo Running the executable: $(TARGET_OUTPUT)
MESSAGE_2.4	:=	echo Removing:
# footer messages
MESSAGE_3.0	:=	$(PRINTLN) Cleanup complete! $(call COLOR,👍,green)
MESSAGE_3.1	:=	$(PRINTLN) Nothing to be deleted! $(call COLOR,⚠️,yellow)
MESSAGE_3.2	:=	$(PRINTLN) Remake complete! $(call COLOR,✔️,green)
MESSAGE_3.3	:=	$(PRINTLN) Executing 'run: all' complete! $(call COLOR,✔️,green)
MESSAGE_3.4	:=	$(PRINTLN) Exceptions handler failed! $(call COLOR,❌,red)





#############################
######### ASSEMBLER #########
#############################


# makes build directory, updates your objects, builds your executable
all: --directories
	@$(NL)$(BR)
	@$(if $(SRCEXT),\
		$(if $(if $(shell $(MAKE) $(-S) -q $(TARGET_OUTPUT) || echo 1),,true),\
			$(MESSAGE_0.3) $(BR) \
		,$(MESSAGE_1.3) && $(MAKE) $(-W) $(TARGET_OUTPUT) && \
			( $(NL)$(BR) $(MESSAGE_0.0) )\
		|| $(MAKE) $(-S) exp_handler || \
			( $(if $(filter-out true,$(OPTIMIZER)), $(NL)$(BR) $(MESSAGE_0.2) $(BR),) $(EXIT1) ))\
	,$(MESSAGE_0.4) $(BR))
	

# updates your objects, builds your executable
$(TARGET_OUTPUT): $(OBJECTS)
	@$(NL)$(BR)  $(MESSAGE_1.4) $(BR) $(if $(AT),,$(NL)$(BR)) $(MESSAGE_2.2)
	$(AT) $(CCX) $(CXXFLAGS) $^ -o $@ $(LFLAGS) $(LIBS) $(INCLUDES)





#############################
######### COMPILER ##########
#############################


# include all .d files
-include $(DEPS)

# builds your objects and -MMD generates dependency files with the same name as the .o file
$(OBJECT_DIR)/%.o: $(SRC_DIR)/%.$(SRCEXT)
	@$(if $(AT),,$(NL)$(BR)) $(MESSAGE_2.1)
	$(AT) $(CCX) $(CXXFLAGS) -c -MMD $< -o $@ $(LFLAGS) $(LIBS) $(INCLUDES)





#############################
########## RECIPES ##########
#############################


# recursive exceptions handler
exp_handler:
	@$(if $(if $(subst auto,,$(OPTIMIZER)),,true),\
		$(NL)$(BR) $(MESSAGE_1.5) $(BR) $(NL)$(BR) \
		$(MAKE) OPTIMIZER=true &&\
			$(MESSAGE_0.1) $(BR) $(NL) \
		|| ( $(NL)$(BR) $(MESSAGE_3.4) $(BR) $(EXIT1) $(BR) )\
	,$(EXIT1) $(BR))

# Make the Directories
--directories:
	$(if $(if $(wildcard $(OBJECT_DIR)/),,void)$(if $(wildcard $(TARGET_DIR)/),,void), @$(NL)$(BR) $(MESSAGE_1.2),)
	$(if $(wildcard $(OBJECT_DIR)/),,@\
		$(if $(AT),,$(NL)$(BR))\
		$(MESSAGE_2.0) $(OBJECT_DIR) $(BR)\
		$(call RECIPE_DEBUG, $(MD) $(OBJECT_DIR) $(BR)))
	$(if $(wildcard $(TARGET_DIR)/),,@\
		$(if $(AT),,$(NL)$(BR))\
		$(MESSAGE_2.0) $(TARGET_DIR) $(BR)\
		$(call RECIPE_DEBUG, $(MD) $(TARGET_DIR) $(BR)))

# Clean removes all the object and executable files
clean:
	@$(NL)$(BR)
	@$(if $(wildcard $(OBJECT_DIR)/)$(wildcard $(TARGET_DIR)/),\
		$(MESSAGE_1.0) $(BR)\
		$(MESSAGE_2.4) $(call FIXPATH,$(TARGET_OUTPUT)) $(BR)\
		$(call RECIPE_DEBUG, $(RM) $(TARGET_OUTPUT) $(BR))\
		$(MESSAGE_2.4) $(call FIXPATH,$(OBJECTS)) $(BR)\
		$(call RECIPE_DEBUG, $(RM) $(call FIXPATH,$(OBJECTS)) $(BR)) \
		$(MESSAGE_2.4) $(call FIXPATH,$(DEPS)) $(BR)\
		$(call RECIPE_DEBUG, $(RM) $(call FIXPATH,$(DEPS)) $(BR)) \
		$(NL)$(BR) $(MESSAGE_1.1) $(BR)\
		$(MESSAGE_2.4) $(OBJECT_DIR) $(TARGET_DIR) $(BR)\
		$(call RECIPE_DEBUG, $(RMDIR) $(OBJECT_DIR) $(TARGET_DIR) $(BR)) \
		$(NL)$(BR) $(MESSAGE_3.0) $(BR)\
	,$(MESSAGE_3.1) $(BR))

# Remake does clean and compile all
remake: clean all
	@$(NL)$(BR) $(MESSAGE_3.2)

# Run compiles all and runs the executable
run: all
	@$(MESSAGE_2.3)
	$(AT) $(TARGET_OUTPUT)
	@$(NL)$(BR) $(MESSAGE_3.3)

# run by passing arguments to the "main"
run?%:
	@$(if $(subst run?,,$@),\
		$(MAKE) $(-W) all &&\
		$(MESSAGE_2.3) $(subst run?,,$@) &&\
		$(TARGET_OUTPUT) $(subst run?,,$@) &&\
		$(NL) && $(MESSAGE_3.3),)

# makefile debugger
debug:
	$(MAKE) DISP_INFO=true

# Help is intended to provide the user a minimum of guide-lines
help:
	@$(NL)$(BR)
	@$(PRINTLN) $(call COLOR,make,yellow) "       - builds/updates everything, is ready to run with $(TARGET_OUTPUT) after completion"
	@$(PRINTLN) $(call COLOR,make,yellow) "clean  - removes object file folder and executable"
	@$(PRINTLN) $(call COLOR,make,yellow) "remake - remake consist of cleaning and compiling all"
	@$(PRINTLN) $(call COLOR,make,yellow) "run    - builds/updates everything, runs immediately"
	@$(PRINTLN) $(call COLOR,make,yellow) "run?.. - unlike 'run', it allows passing arguments to the executable\
		(e.g: " $(call COLOR,make,yellow)" run?'My Arguments' OR " $(call COLOR,make,yellow)" run?MyArguments)"
	@$(PRINTLN) $(call COLOR,make,yellow) "debug  - builds/updates everything displaying more detailed messages"
	@$(NL)$(BR)

# Non-File Targets
.PHONY: all clean remake run run? run?% debug help
