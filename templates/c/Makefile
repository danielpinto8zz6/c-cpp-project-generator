CC		:= gcc
CFLAGS	:= -Wall -Wextra -g

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
else
EXECUTABLE	:= main
SOURCEDIRS	:= $(shell find $(SRC) -type d)
INCLUDEDIRS	:= $(shell find $(INCLUDE) -type d)
LIBDIRS		:= $(shell find $(LIB) -type d)
endif

CINCLUDES	:= $(patsubst %,-I%, $(INCLUDEDIRS:%/=%))
CLIBS		:= $(patsubst %,-L%, $(LIBDIRS:%/=%))

SOURCES		:= $(wildcard $(patsubst %,%/*.c, $(SOURCEDIRS)))
OBJECTS		:= $(SOURCES:.c=.o)

all: $(BIN)/$(EXECUTABLE)
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

.c.o:
	$(CC) $(CFLAGS) $(CINCLUDES) -c $*.c -o $@
	@echo "Compiled "$<" successfully!"

$(BIN)/$(EXECUTABLE): $(OBJECTS)
	$(CC) $(CFLAGS) $(CINCLUDES) $(CLIBS) $^ -o $@ $(LIBRARIES)
	@echo "Linking complete!"