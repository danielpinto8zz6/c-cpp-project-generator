# c-cpp-project-generator README

Create C/C++ projects

## Features

Project will generate the following:

Project structure: Common folders like src, include and bin
Makefile: A makefile already set up to build and run your project
VSCode task: Configurations for building and running your project

## Requirements

* If you are on linux you must install gcc and make
* If you are on window you must install mingw

## How to use
* Go to command pallete (usually : ctrl + shift + p)
* Search for "Create C project" or "Create c++ project" depending on your preference
* Select the folder where the project should be created
* That's it, project will open

## Extension Settings

## Known Issues
* Open main file after loading files

## Release Notes

### 1.1.1
- Fix vulnerabilities
- Add how to use

### 1.1.0
- Cleanups + fixes
- Doesn't include c_cpp_properties anymore, c/c++ extension should find it automatically

### 1.0.4
- Fixed makefile executable on windows for make clean

### 1.0.2
- Fixed include path on linux
- Added icon

### 1.0.1
- Improved debugging
- Better compatibility with windows, mac os, linux
- Added clean task

### 1.0.0
- Initial release
