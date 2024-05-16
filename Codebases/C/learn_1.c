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
returnType functionName(parameter1, parameter2, parameter3) {
  // code to be executed
}

*/




#include <stdio.h>  // this is a "header file library". This lets us work with input and output functions, like printf()

#include <stdbool.h>    // import this header file for boolean data type

#include <string.h> // import this header file for string operations beyond basic. strcpy(), strcmp(), strcat()


int main() {

    const int BIRTHYEAR = 1980; // const declares this variable unchangeable and read-only

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
    printf("Size of myFloatNum variable is %zu bytes!\n\n", sizeof(myFloatNum));   // %lu is used to see bytes
    
    // Add variables together
    int x = 5;    
    int y = 6;
    int sum = x + y;
    printf("x + y = %d\n", sum);

    // Boolean data type
    int x2 = 10;
    int y2 = 9;
    printf("\n%d > %d == Boolean: %d\n", x2, y2, x2 > y2);

    // short-hand if else: ternary operator -> variable = (condition) ? expressionTrue : expressionFalse;
    int time = 20;
    (time < 18) ? printf("\nGood day.\n") : printf("\nGood evening.\n");

    // Example of Switch statement. Used instead of many if else statments.
    int day = 4;

    printf("\n");

    switch (day) {
    case 1:
        printf("Monday");
        break;
    case 2:
        printf("Tuesday");
        break;
    case 3:
        printf("Wednesday");
        break;
    case 4:
        printf("Thursday");
        break;
    case 5:
        printf("Friday");
        break;
    case 6:
        printf("Saturday");
        break;
    case 7:
        printf("Sunday");
        break;
    }

    printf("\n\n");

    // While loop:
    int a = 0;
    
    while (a < 5) {
        printf("%d\n", a);
        a++;
    }
    printf("\n");

    // For loop

    int z;

    for (z = 0; z < 5; z++) {
        printf("%d\n", z);
    }
    printf("\n");

    // Array
    int myNumbers[] = {25, 50, 75, 100};
    printf("%d", myNumbers[0]);
    printf("\n\n");

    // 2D array for loop
    int matrix[2][3] = { {1, 4, 2}, {3, 6, 8} };

    int i, j;
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 3; j++) {
            printf("%d\n", matrix[i][j]);
        }
    }
    printf("\n");

    /*
    // how to get user input
    // Create an integer variable that will store the number we get from the user
    int myNumber;

    // Ask the user to type a number
    printf("Type a number: \n");

    // Get and save the number the user types
    scanf("%d", &myNumber);

    // Output the number the user typed
    printf("Your number is: %d", myNumber);
    */

   
    return 0;   
}

struct MyStructure {   // Structure declaration
    int myNum;           // Member (int variable)
    char myLetter;       // Member (char variable)
}; // End the structure with a semicolon






