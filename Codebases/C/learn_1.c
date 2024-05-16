// single line comment

/*
multi-line comments
*/

/*
Learning Notes:

1) 
header file libraries let us add functionality to our C program.

2) 
int - stores integers (whole numbers), without decimals, such as 123 or -123
float - stores floating point numbers, with decimals, such as 19.99 or -19.99
char - stores single characters, such as 'a' or 'B'. Characters are surrounded by single quotes

3) 
creating variables ->
type variableName = value;

4) 


*/




#include <stdio.h>  // this is a "header file library". This lets us work with input and output functions, like printf()

int main() {
    printf("Hello World!\n"); // note, have to use double quotes "" when working with text.
    printf("This is a string with newline\n");

    // Create variables
    int myNum = 15;            // Integer (whole number)
    float myFloatNum = 5.99;   // Floating point number
    char myLetter = 'D';       // Character
    char myText[] = "Hello";
    double myDoubleNum = 19.99;

    // Print variables
    printf("This is an integer variable printed %d\n", myNum);
    printf("This is a float decimal. Precise up to about 6 digits %.3f\n", myFloatNum); // .3 means to 3 decimals
    printf("This is a character variable printed %c\n", myLetter);
    printf("This is a text variable printed (string) %s\n", myText);
    printf("This is a double decimal. Precise up to about 15 digits %.2lf\n", myDoubleNum); // .2 means to 2 decimals
    printf("\n");
    printf("Size of myLetter variable is %lu bytes!\n\n", myLetter);   // %lu is used to see bytes
    
    // Add variables together
    int x = 5;
    int y = 6;
    int sum = x + y;
    printf("x + y = %d\n", sum);

    return 0;   
}


