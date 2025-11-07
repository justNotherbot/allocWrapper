# allocWrapper README

## General description

This plugin can add standard induced code for dynamic allocation in the C language.

## Author data
### Full name
Григорьев Тимофей Максимович
### Group
M3100

## Features

This extension adds a null check and free() call for every valid allocation in the selection.

## Usage

To activate the plugin, press ctrl+shift+p. Then select "C alloc wrapper" from the menu.
Here are some examples of how the extension works:

Selection:

    void* ptr1 = malloc(42);
    int* ptr2 = calloc(69);
Output:

    if(ptr1 == NULL) {}
    free(ptr1);
    if(ptr2 == NULL) {}
    free(ptr2);

Selection:

    void ptr1 = malloc(42)
Output:

    No valid allocations found in the selection

Selection:

    void **ptr_1 = realloc(a, 69)    ;
Output:

    if(ptr_1 == NULL) {}
    free(ptr_1);

## Installation
To install:
1) Go to File -> Preferences -> Extensions -> ... (Views and More Actions) -> Install from VSIX
2) Select cppu-0.0.1.vsix from the pop out.

## Documentation
### File structure

cppu-0.0.1.vsix - installable package

extension.js - main code

package.json - package configuration

package-lock.json - detailed package configuration

eslint-config.mjs - linter configuration

jsconfig.json - JS config

### Libraries

generator-code by yeoman - General vscode extension API

vsce by vscode - Library for generating .vsix package

### Functions

#### Function getTargetText

	Description:
	Finds all valid malloc,calloc,realloc calls and adds free() for each of them.
	Also adds if(var == NULL){} statements for each allocation.
	Valid calls are of the form:
	type* ptr = malloc(....)  ;  // Any text
	Allowed variable names:
	Variable name can only consist of upper/lower case english characters, digits or 
	'_' symbols. Variable must be a pointer.
	General requirements:
	An allocation call must end with ';'.
	Parameters:
	selection - selected text. Can be null.
	Return:
	Target text. Contains if statements and free() calls.

#### Function activate

	Description:
	This is the main function of the extension. 
	It places target text at the end of the selection.
	If nothing is selected, a message is triggered.
	Parameters:
	context: editor context
	Return:
	The function doesn't return anything.
