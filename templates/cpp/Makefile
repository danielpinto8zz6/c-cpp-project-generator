#	INSTRUCTIONS:
# 'make'        build executable file 'main'
# 'make run'    build and run executable file
# 'make run?..  unlike 'run', it allows passing arguments to the executable (e.g: make run?arg1 OR make run?'arg1 arg2')
# 'make clean'  removes every .o and executable files
# 'make remake' execute a make clean and subsequently compile all
# 'make help'   show brief guide-lines about this makefile usage

#---------------------------------------------------------------------------------
#------------------------ YOU CAN EDIT BELOW THIS LINE ---------------------------
#---------------------------------------------------------------------------------

# sources extension corrisponds to the "project language"\
	(if set to 'auto' it will try to fetch it itslef. Alternatively enter it manually: cpp, c, ...)
SRC_EXT				:=	auto
# define the compiler to use (e.g: auto, gcc, c++, ...)
CCX				:=	auto
# define the compiler support version (e.g: auto 98, 99, 03, 11, 14, 17, 2a, ...)
COMPILER_SUPPORT		:=	auto
# to compile and optimize code (if set to false, the exceptions handler will not start, set to 'true' to get optimizer -Ofast,\
	'auto' to handle it automatically or any optimizer else like: -O0, -O1, -O2, -O3, ...)
OPTIMIZER			:=	auto
# get general warnings (set to false to remove general warnings)
GENERAL_WARNINGS		:=	true
# get larger amount of warnings (set to 'false' to remove negligible warnings)
USE_STRICT			:=	false



# define the executable output name (if set to 'auto' it will automatically be assigned the main file name)
TARGET_NAME			:=	auto
# custom flags:
LFLAGS				:=
CCXFLAGS			:=
# debug
DEBUG				:=	-g

# define library paths in addition to /usr/lib
#   if I wanted to include libraries not in /usr/lib I'd specify
#   their path using -Lpath.

# define executable directory
TARGET_DIR			:=	build
# define output directory
OBJECT_DIR			:=	bin
# define source directory 
SOURCE_DIR			:=	src
# define include directory
INCLUDE_DIR			:=	include
# define library directory
LIBRARY_DIR			:=	lib


# display complete info (this is automatically set to true when "make debug" is called)
DISP_INFO			:=	false
# compiling at a faster speed by using Parallel Execution / multiple cores compiling (e.g: false, auto, min, mid, max)
SPEEDUP				:=	auto





#---------------------------------------------------------------------------------
#------------------------ DO NOT EDIT BELOW THIS LINE ----------------------------
#---------------------------------------------------------------------------------

#############################
######## VARIABLES ##########
#############################


# get Operative System name
OS			:=	$(if $(OS),$(OS),$(if $(findstring Darwin,$(shell echo $$(uname))),Mac_OS,$(shell echo $$(uname))))
# get cpu architecture info
PROCESSOR_ARCHITECTURE	:=	$(if $(PROCESSOR_ARCHITECTURE),$(PROCESSOR_ARCHITECTURE),$(shell echo $$(uname -p)))
# get environment info
TERMINAL		:=	$(if $(filter-out $$(uname),$(shell echo $$(uname))),$(shell echo $$(uname)),$(if $(findstring Windows,$(OS)),MinGW,))

# literal whitespace
s 			:=	$s $s
# literal backslash
\ 			:=	\\#
# literal comma
; 			:=	,
# literal double quotess
"			:=	$(if $(findstring MinGW,$(TERMINAL)),,")


# OS compatibility
ifeq ($(OS),Windows_NT)
	OS_EXE		:=	.exe
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
		NPROCS		:=	$(shell grep -c 'processor' /proc/cpuinfo)
		MAIN_MATCH	:=	"^(\s)*(unsigned\s+)?(void|bool|short|int|long|long\s+long|double|char)\s+main\s*\((\s|\S)*\)\s*\{?"
		SRCEXT_FIND	=	egrep -E --include=\*.$(if $(SRCEXT),$(SRCEXT),*) -rnwl $(if $(strip $(SRC_DIR)),$(SRC_DIR),.) -e $(MAIN_MATCH) 2> /dev/null
		EXIT1		=	$(if $(filter true,$(DISP_INFO)),exit 1,exit 1 &> /dev/null)
		FIXPATH		=	$1
		MATH		=	$(shell echo $$(( $1 )))
	else
		RM		:=	DEL /F/Q
		RMDIR		:=	RMDIR /Q/S
		MD		:=	MKDIR
		E_START		:=	
		E_END		:=	[0m
		BR		:=	&
		NL		:=	type nul | more /e /p
		EXITSTATUS	:=	%errorlevel%
		NPROCS		:=	$(lastword $(strip $(shell WMIC CPU Get NumberOfLogicalProcessors)))
		MAIN_MATCH	:=	"^[ ]*[unsigned ]*[ ]*[void bool char short int long long long double][ ][ ]*main[ ]*(.*)[ ]*{*"
		SRCEXT_FIND	=	findstr /s /i /m /r /c:$(MAIN_MATCH) $(call DIRSEP,$(SRC_DIR))*.$(if $(SRCEXT),$(SRCEXT),*) 2>nul
		EXIT1		=	$(if $(filter true,$(DISP_INFO)),exit 1,exit 1 >nul 2>&1)
		FIXPATH		=	$(subst /,$\,$1)
		MATH		=	$(shell echo on | set /a $1)
	endif
else
	RM 		:=	rm -f
	RMDIR		:=	$(RM)r
	MD		:=	mkdir -p
	E_START		:=	"\033
	E_END		:=	\033[0m"
	BR		:=	;
	NL		:=	echo
	EXITSTATUS	:=	$$?
	NPROCS		:=	$(if $(findstring Mac_OS,$(OS)),$(shell sysctl hw.ncpu  | grep -o '[0-9]\+'),$(shell grep -c 'processor' /proc/cpuinfo))
	MAIN_MATCH	:=	"^(\s)*(unsigned\s+)?(void|bool|short|int|long|long\s+long|double|char)\s+main\s*\((\s|\S)*\)\s*\{?"
	SRCEXT_FIND	=	egrep -E --include=\*.$(if $(SRCEXT),$(SRCEXT),*) -rnwl $(if $(strip $(SRC_DIR)),$(SRC_DIR),.) -e $(MAIN_MATCH) 2> /dev/null
	EXIT1		=	$(if $(filter true,$(DISP_INFO)),exit 1,exit 1 &> /dev/null)
	FIXPATH		=	$1
	MATH		=	$(shell echo $$(( $1 )))
endif





#############################
########## UTILITY ##########
#############################


# enable echo output styling
PRINTLN		:=	echo$(if $(ESC_SEQ), $(ESC_SEQ),)
# recipe debug
RECIPE_DEBUG	=	$(if $(AT),,echo $1) $1

# chose text style
COLOR 		=	$(if $(filter red,$2),$(E_START)[1;31m$(subst ",,$1)$(E_END),$(if \
				$(filter green,$2),$(E_START)[1;32m$(subst ",,$1)$(E_END),$(if \
					$(filter yellow,$2),$(E_START)[1;33m$(subst ",,$1)$(E_END),$(if \
						$(filter blue,$2),$(E_START)[1;34m$(subst ",,$1)$(E_END),$(if \
							$(filter magenta,$2),$(E_START)[1;35m$(subst ",,$1)$(E_END),$(if \
								$(filter cyan,$2),$(E_START)[1;36m$(subst ",,$1)$(E_END),$1))))))
# upper case to lower case
TO_LOWER	=	$(subst A,a,$(subst B,b,$(subst C,c,$(subst D,d,$(subst E,e,$(subst F,f,$(subst G,g,$(subst H,h,$(subst I,i,$(subst J,j,$(subst K,k,$(subst L,l,$(subst M,m,$(subst N,n,$(subst O,o,$(subst P,p,$(subst Q,q,$(subst R,r,$(subst S,s,$(subst T,t,$(subst U,u,$(subst V,v,$(subst W,w,$(subst X,x,$(subst Y,y,$(subst Z,z,$1))))))))))))))))))))))))))
# lower case to upper case
TO_UPPER	=	$(subst a,A,$(subst b,B,$(subst c,C,$(subst d,D,$(subst e,E,$(subst f,F,$(subst g,G,$(subst h,H,$(subst i,I,$(subst j,J,$(subst k,K,$(subst l,L,$(subst m,M,$(subst n,N,$(subst o,O,$(subst p,P,$(subst q,Q,$(subst r,R,$(subst s,S,$(subst t,T,$(subst u,U,$(subst v,V,$(subst w,W,$(subst x,X,$(subst y,Y,$(subst z,Z,$1))))))))))))))))))))))))))
# determine if the value entered is an integer
IS_INT		=	$(if $(subst 0,,$(subst 1,,$(subst 2,,$(subst 3,,$(subst 4,,$(subst 5,,$(subst 6,,$(subst 7,,$(subst 8,,$(subst 9,,$(patsubst -%,%,$1))))))))))),,$1)
# not operator
NOT		=	$(if $1,,true)
# greater than (e.g: $(call GT,4,3))
GT		=	$(if $(filter -%,$(call MATH,$2-$1)),$(subst -,,$(call MATH,$2-$1)),)
# less than (e.g: $(call LT,3,4))
LT		=	$(if $(filter -%,$(call MATH,$1-$2)),$(subst -,,$(call MATH,$1-$2)),)
# equals operator (strings)
EQS		=	$(if $(subst $(words $1),,$(words $2)),,$(if $(subst $1,,$2),,$(if $(subst $2,,$1),,$(if $1,$1,true))))
# equals too (numbers)
EQN		=	$(if $(if $(and $(call IS_INT,$1),$(call IS_INT,$2)),$(call EQS,0,$(strip $(call MATH,$1-$2))),),$(call MATH,$1),)

# directories separator
DIRSEP		=	$(if $1,$1/,)
# determines if a name exists as a file or a directory
EXISTS		=	$(patsubst %/,%,$(wildcard $1))
# determines whether a value entered belongs to a directory or not
IS_DIR		=	$(if $(subst /,,$(patsubst %/,/,$(wildcard $1/))),,$(patsubst %/,%,$(wildcard $1)))
# determines whether a value entered belongs to a file or not
IS_FILE		=	$(if $(and $(call EXISTS,$1),$(call NOT,$(call IS_DIR,$1))),$1,)

# generates a list of numbers or given a argument
LISTGEN		=	$(if $(call EQS,0,$1)$(call NOT,$(call IS_INT,$1)),,$(call LISTGEN,$(call MATH,$1-1),$2)$(if $(call EQS,$1,1),, )$(if $2,$2,$1))
# list inverter
REVERSE		=	$(if $(eval i := $(call MATH,$i+1))$($i),$($0),$(eval i := $(if $(call GT,$i,1),$(call MATH,$i-1)))$(if \
					$(call GT,$i,1),$(foreach j,$(call LISTGEN,$i),$($(call MATH,$i-$j+1))),$(foreach \
						j,$(call LISTGEN,$(words $1)),$(word $(call MATH,$(words $1)-$j+1),$1)))$(eval i := ))
# removes the first element of a list
REST		=	$(if $(eval i := $(call MATH,$i+1))$($i),$($0),$(eval i := $(if $(call GT,$i,1),$(call MATH,$i-1)))$(patsubst $s%,%,$(if \
					$(call GT,$i,1),$(foreach j,$(call LISTGEN,$i),$(if $(call GT,$j,1),$($j))),$(foreach \
						j,$(call LISTGEN,$(words $1)),$(if $(call GT,$j,1),$(word $j,$1)))))$(eval i := ))





#############################
####### DIRECTORIES #########
#############################


# directories
TARGET_DIR	:=	$(subst $s,_,$(strip $(TARGET_DIR)))
OBJECT_DIR	:=	$(subst $s,_,$(strip $(OBJECT_DIR)))
SRC_DIR		:=	$(subst $s,_,$(strip $(call IS_DIR,$(SOURCE_DIR))))
INCL_DIRS	:=	$(subst $s,_,$(strip $(call IS_DIR,$(INCLUDE_DIR))))
LIB_DIRS	:=	$(subst $s,_,$(strip $(call IS_DIR,$(LIBRARY_DIR))))

# project language detector ('$s' stands for literal space)
SRCEXT0		:=	$(if $(subst auto,,$(SRC_EXT)),$(subst $s,,$(SRC_EXT)),$(firstword $(patsubst .%,%,$(filter .%,$(suffix \
					$(filter %.cpp %.c,$(shell $(SRCEXT_FIND))))))))
# final attempt to get the extension
SRCEXT		:=	$(if $(SRCEXT0),$(SRCEXT0),$(firstword $(patsubst .%,%,$(filter .%,$(suffix \
					$(filter %.cpp %.c,$(wildcard $(call DIRSEP,$(SRC_DIR))*.*)))))))

# automatically generate target name by using the main file name
TARGET_N0	:=	$(subst $s,,$(if $(subst auto,,$(TARGET_NAME)),$(subst $s,_,$(TARGET_NAME)),\
							$(basename $(notdir $(shell $(SRCEXT_FIND))))))
# final attempt to get the name				
FILES_NAME	:=	$(basename $(notdir $(wildcard $(call DIRSEP,$(SRC_DIR))*.$(SRCEXT))))
TARGET_N	:=	$(subst $s,,$(if $(TARGET_N0),$(TARGET_N0),$(if $(filter 1,$(words $(FILES_NAME))),$(FILES_NAME),)))

# setting target name and extension
TARGET		:=	$(if $(TARGET_N),$(TARGET_N),a)$(OS_EXE)

# define any directories containing header files other than /usr/include
INCLUDES	:=	$(patsubst %,-I%, $(INCL_DIRS:%/=%))
# define the C/C++ libs
LIBS		:=	$(patsubst %,-L%, $(LIB_DIRS:%/=%))
# define the C/C++ source files
SOURCES		:=	$(wildcard $(call DIRSEP,$(SRC_DIR))*.$(SRCEXT))

# finds objects that corrispond to the src files, system agnostic version
OBJECTS		:=	$(patsubst $(call DIRSEP,$(SRC_DIR))%.$(SRCEXT),$(call DIRSEP,$(OBJECT_DIR))%.o, $(SOURCES))
# define the dependency output files
DEPS		:=	$(OBJECTS:.o=.d)
# defining target directory
TARGET_OUTPUT	:=	$(call FIXPATH,$(call DIRSEP,$(TARGET_DIR))$(TARGET))
#
# The following part of the makefile is generic; it can be used to 
# build any executable just by changing the definitions above and by
# deleting dependencies appended to the file from 'make depend'





#############################
##### COMPILER SETTINGS #####
#############################


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
		COMPILER_SUPPORT := 11
	else ifeq ($(STD),c++)
		COMPILER_SUPPORT := 17
		
	endif
endif

# makefile multi cores flag
JOBS	:=	$(if $(call EQS,auto,$(strip $(SPEEDUP))),--jobs,$(if \
				$(call EQS,min,$(strip $(SPEEDUP))),--jobs 1,$(if \
					$(call EQS,mid,$(strip $(SPEEDUP))),--jobs $(call MATH,$(NPROCS)/2),$(if \
						$(call EQS,max,$(strip $(SPEEDUP))),--jobs $(NPROCS),$(if \
							$(findstring -j,$(SPEEDUP))$(findstring --jobs,$(SPEEDUP)),$(SPEEDUP),)))))





#############################
########### FLAGS ###########
#############################


# The next warnings are neither valid nor needed for C++
CWARNSC := \
	-Wdeclaration-after-statement \
	-Wmissing-prototypes \
	-Wnested-externs \
	-Wstrict-prototypes \
	-Wc++-compat \
	-Wold-style-definition
# Warnings for gcc, not valid for clang
CWARNGCC := \
	-Wlogical-op \
	-Wno-aggressive-loop-optimizations

# Warnings valid for both C and C++
CWARNSCPP := \
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
CWARNSCPP_STRICT := \
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
CXXFLAGS	:= $(if $(STD),-std=$(STD)$(COMPILER_SUPPORT),) $(OPT) -Wall $(CCXFLAGS) $(CWARNS) $(DEBUG)





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
MESSAGE_0.3	=	$(PRINTLN) $(call COLOR,Executable,green)" '$(TARGET_OUTPUT)' "$(call COLOR,is already up to date!,green)
MESSAGE_0.4	:=	$(PRINTLN) $(call COLOR,Language detection failed! Please$; fill manually the Makefile 'SRC_EXT' variable.,red)
MESSAGE_0.5	:=	$(PRINTLN) $(call COLOR,Source files not found! Please$; set properly the Makefile 'SOURCE_DIR' variable.,red)
MESSAGE_0.6	:=	$(PRINTLN) $(call COLOR,Src-dir '$(SOURCE_DIR)' not found! Please$; set properly the Makefile 'SOURCE_DIR' variable.,red)
# header messages
MESSAGE_1.0	:=	$(PRINTLN) $(call COLOR,Removing files..,blue)
MESSAGE_1.1	:=	$(PRINTLN) $(call COLOR,Removing directories..,blue)
MESSAGE_1.2	:=	$(PRINTLN) $(call COLOR,Making directories..,blue)
MESSAGE_1.3	:=	$(PRINTLN) $(call COLOR,Compilator..,blue)
MESSAGE_1.4	:=	$(PRINTLN) $(call COLOR,Assembler..,blue)
MESSAGE_1.5	:=	$(PRINTLN) $(call COLOR,Warning!,magenta)$" Attempt to handle the exception by enabling the '-Ofast' optimizer flag..$"
MESSAGE_1.6	:=	$(PRINTLN) $(call COLOR,MAKE HELP..,blue)
MESSAGE_1.7	:=	$(PRINTLN) $(call COLOR,Environment Info..,blue)
# body messages
MESSAGE_2.0	:=	echo $"Creating dir:$"
MESSAGE_2.1	=	echo $"Compiling object file: $@$"
MESSAGE_2.2	=	echo $"Assembling compiled objects into: $@$"
MESSAGE_2.3	=	echo $"Running the executable: $(TARGET_OUTPUT)$"
MESSAGE_2.4	:=	echo $"Removing$"
# footer messages
MESSAGE_3.0	:=	$(PRINTLN) $"Cleanup complete! $"$(call COLOR,👍,green)
MESSAGE_3.1	:=	$(PRINTLN) $"Nothing to be deleted! $"$(call COLOR,⚠️,yellow)
MESSAGE_3.2	:=	$(PRINTLN) $"Remake complete! $"$(call COLOR,✔️,green)
MESSAGE_3.3	:=	$(PRINTLN) $"Executing 'run' complete! $"$(call COLOR,✔️,green)
MESSAGE_3.4	:=	$(PRINTLN) $"Exceptions handler failed! $"$(call COLOR,❌,red)





#############################
######### ASSEMBLER #########
#############################


# makes build directory, updates your objects, builds your executable
all:
	@$(MAKE) $(-S) directories
	@$(NL)$(BR)
	@$(if $(call EQS,$(SRC_DIR),$(SOURCE_DIR)),\
		$(if $(SOURCES),\
			$(if $(SRCEXT),\
				$(if $(if $(shell $(MAKE) $(-S) -q $(TARGET_OUTPUT) || echo 1),,true),\
					$(MESSAGE_0.3) $(BR) \
				,$(MESSAGE_1.3) && $(MAKE) $(JOBS) $(-W) $(TARGET_OUTPUT) && \
					( $(NL)$(BR) $(MESSAGE_0.0) )\
				|| $(MAKE) $(-S) exp_handler || \
					( $(if $(call EQS,true,$(OPTIMIZER)),, $(NL)$(BR) $(MESSAGE_0.2) $(BR)) $(EXIT1) ))\
			,$(MESSAGE_0.4) $(BR))\
		,$(MESSAGE_0.5) $(BR))\
	,$(MESSAGE_0.6) $(BR))
	

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
$(call DIRSEP,$(OBJECT_DIR))%.o: $(call DIRSEP,$(SRC_DIR))%.$(SRCEXT)
	@$(if $(AT),,$(NL)$(BR)) $(MESSAGE_2.1)
	$(AT) $(CCX) $(CXXFLAGS) -c -MMD $< -o $@ $(LFLAGS) $(LIBS) $(INCLUDES)





#############################
########## RECIPES ##########
#############################


# recursive exceptions handler
exp_handler:
	@$(if $(call EQS,auto,$(OPTIMIZER)),\
		$(NL)$(BR) $(MESSAGE_1.5) $(BR) $(NL)$(BR) \
		$(MAKE) OPTIMIZER=true && \
			$(MESSAGE_0.1) $(BR) $(NL) \
		|| ( $(NL)$(BR) $(MESSAGE_3.4) $(BR) $(EXIT1) $(BR) )\
	,$(EXIT1) $(BR))

# Make the Directories
directories:
	@$(if $(and $(OBJECT_DIR),$(call NOT,$(call IS_DIR,$(OBJECT_DIR))))$(and $(TARGET_DIR),$(call NOT,$(call IS_DIR,$(TARGET_DIR)))),\
		$(if $(OBJECT_DIR)$(TARGET_DIR),$(NL)$(BR) $(MESSAGE_1.2) $(BR),) \
		$(if $(and $(OBJECT_DIR),$(call NOT,$(call IS_DIR,$(OBJECT_DIR)))),\
			$(if $(AT),,$(NL)$(BR)) \
			$(MESSAGE_2.0) $(OBJECT_DIR) $(BR) \
			$(call RECIPE_DEBUG, $(MD) $(OBJECT_DIR) $(BR))) \
		$(if $(and $(TARGET_DIR),$(call NOT,$(call IS_DIR,$(TARGET_DIR)))),\
			$(if $(AT),,$(NL)$(BR)) \
			$(MESSAGE_2.0) $(TARGET_DIR) $(BR) \
			$(call RECIPE_DEBUG, $(MD) $(TARGET_DIR) $(BR))))

# Clean removes all the object and executable files
clean:
	@$(NL)$(BR)
	@$(if $(wildcard $(TARGET_OUTPUT) $(OBJECTS) $(DEPS))$(call IS_DIR,$(OBJECT_DIR))$(call IS_DIR,$(TARGET_DIR)),\
		$(if $(wildcard $(TARGET_OUTPUT) $(OBJECTS) $(DEPS)),\
			$(MESSAGE_1.0) $(BR) \
			$(MESSAGE_2.4)$" executables:	$"$(call FIXPATH,$(TARGET_OUTPUT)) $(BR) \
			$(call RECIPE_DEBUG, $(RM) $(TARGET_OUTPUT) $(BR)) \
			$(MESSAGE_2.4)$" objects:	$"$(call FIXPATH,$(OBJECTS)) $(BR) \
			$(call RECIPE_DEBUG, $(RM) $(call FIXPATH,$(OBJECTS)) $(BR)) \
			$(MESSAGE_2.4)$" dependencies:	$"$(call FIXPATH,$(DEPS)) $(BR) \
			$(call RECIPE_DEBUG, $(RM) $(call FIXPATH,$(DEPS)) $(BR)),) \
		$(if $(call IS_DIR,$(OBJECT_DIR))$(call IS_DIR,$(TARGET_DIR)),\
			$(NL)$(BR) $(MESSAGE_1.1) $(BR) \
			$(MESSAGE_2.4): $(OBJECT_DIR) $(TARGET_DIR) $(BR) \
			$(call RECIPE_DEBUG, $(RMDIR) $(OBJECT_DIR) $(TARGET_DIR) $(BR)),) \
		$(NL)$(BR) $(MESSAGE_3.0) $(BR) \
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
	$(if $(findstring MinGW,$(TERMINAL)),@echo >nul,)
	@$(NL)$(BR) $(NL)$(BR) $(MESSAGE_1.6) $(BR) $(NL)$(BR)
	@$(PRINTLN) $(call COLOR,make,yellow)$"        - builds/updates everything, is ready to run with $(TARGET_OUTPUT) after completion$"
	@$(PRINTLN) $(call COLOR,make,yellow)$" clean  - removes object, file, folder and executable$"
	@$(PRINTLN) $(call COLOR,make,yellow)$" remake - remake consist of cleaning and compiling all$"
	@$(PRINTLN) $(call COLOR,make,yellow)$" run    - builds/updates everything, runs immediately$"
	@$(PRINTLN) $(call COLOR,make,yellow)$" run?.. - unlike 'run', it allows passing arguments to the executable $"\
		$"(e.g:$" $(call COLOR,make,yellow)$" run?arg1 OR $"$(call COLOR,make,yellow)$" run?'arg1 arg2')$"
	@$(PRINTLN) $(call COLOR,make,yellow)$" debug  - builds/updates everything displaying more detailed messages$"
	@$(NL)$(BR) $(MESSAGE_1.7)
	@$(PRINTLN) $"Operative System:	$"$(call COLOR,$(if $(OS)$(PROCESSOR_ARCHITECTURE),$(OS) ($(PROCESSOR_ARCHITECTURE)),$"Unknown$"),$(if $(OS)$(PROCESSOR_ARCHITECTURE),green,red))
	@$(PRINTLN) $"Terminal:		$"$(call COLOR,$(if $(TERMINAL),$(TERMINAL),$"Unknown$"),$(if $(TERMINAL),green,red))
	@$(PRINTLN) $"Main src file name:	$"$(call COLOR,$(if $(TARGET_N),$(TARGET_N),$"Unknown$"),$(if $(TARGET_N),green,red))
	@$(PRINTLN) $"Detected Language:	$"$(call COLOR,$(if $(SRCEXT),$(SRCEXT),$"Unknown$"),$(if $(SRCEXT),green,red))
	@$(NL)$(BR) $(NL)$(BR)

# Non-File Targets
.PHONY: all clean remake run run? run?% debug help
