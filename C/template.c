#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Function prototypes
void basicDataTypes();
void controlStructures();
void functions(int a, int b);
void arrays();
void pointers();
void fileIO();

int main() {
    printf("Welcome to the C Programming Basics Template!\n\n");

    basicDataTypes();
    controlStructures();
    functions(10, 20);
    arrays();
    pointers();
    fileIO();

    return 0;
}

// Function to demonstrate basic data types
void basicDataTypes() {
    printf("Basic Data Types:\n");

    int integer = 10;
    float floatingPoint = 3.14;
    char character = 'A';
    char string[] = "Hello, World!";

    printf("Integer: %d\n", integer);
    printf("Float: %.2f\n", floatingPoint);
    printf("Character: %c\n", character);
    printf("String: %s\n\n", string);
}

// Function to demonstrate control structures
void controlStructures() {
    printf("Control Structures:\n");

    int x = 5;

    // If-else statement
    if (x > 0) {
        printf("x is positive\n");
    } else {
        printf("x is non-positive\n");
    }

    // For loop
    printf("For loop: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", i);
    }
    printf("\n");

    // While loop
    printf("While loop: ");
    int count = 0;
    while (count < 5) {
        printf("%d ", count);
        count++;
    }
    printf("\n");

    // Switch statement
    printf("Switch statement: ");
    switch (x) {
        case 1:
            printf("x is 1\n");
            break;
        case 5:
            printf("x is 5\n");
            break;
        default:
            printf("x is neither 1 nor 5\n");
            break;
    }

    printf("\n");
}

// Function to demonstrate user-defined functions
void functions(int a, int b) {
    printf("Functions:\n");

    int sum = a + b;
    printf("Sum of %d and %d is %d\n\n", a, b, sum);
}

// Function to demonstrate arrays
void arrays() {
    printf("Arrays:\n");

    int numbers[5] = {1, 2, 3, 4, 5};

    printf("Array elements: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\n\n");
}

// Function to demonstrate pointers
void pointers() {
    printf("Pointers:\n");

    int var = 10;
    int *ptr = &var;

    printf("Value of var: %d\n", var);
    printf("Address of var: %p\n", (void*)&var);
    printf("Value stored in ptr: %p\n", (void*)ptr);
    printf("Value pointed to by ptr: %d\n\n", *ptr);
}

// Function to demonstrate file I/O
void fileIO() {
    printf("File I/O:\n");

    FILE *file;
    char filename[] = "example.txt";
    char content[] = "This is an example file.\n";

    // Writing to a file
    file = fopen(filename, "w");
    if (file == NULL) {
        printf("Error opening file for writing.\n");
        return;
    }
    fprintf(file, "%s", content);
    fclose(file);

    // Reading from a file
    file = fopen(filename, "r");
    if (file == NULL) {
        printf("Error opening file for reading.\n");
        return;
    }
    char buffer[100];
    printf("File content: ");
    while (fgets(buffer, sizeof(buffer), file) != NULL) {
        printf("%s", buffer);
    }
    fclose(file);

    printf("\n");
}
