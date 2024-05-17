#include <stdio.h>  // For input and output operations.
#include <stdlib.h> // For general-purpose functions like memory allocation, conversions, and process control.
#include <string.h> // For string manipulation functions.
#include <ctype.h>  // For character handling functions.
#include <stdbool.h>


// function to print hangman after each try
void printHangman(int t) {
    switch (t) {
        case 0:
            printf("  _____\n"
                   "  |   |\n"
                   "      |\n"
                   "      |\n"
                   "      |\n"
                   "      |\n"
                   "=========\n");
            break;
        case 1:
            printf("  _____\n"
                   "  |   |\n"
                   "  O   |\n"
                   "      |\n"
                   "      |\n"
                   "      |\n"
                   "=========\n");
            break;
        case 2:
            printf("  _____\n"
                   "  |   |\n"
                   "  O   |\n"
                   "  |   |\n"
                   "      |\n"
                   "      |\n"
                   "=========\n");
            break;
        case 3:
            printf("  _____\n"
                   "  |   |\n"
                   "  O   |\n"
                   " /|   |\n"
                   "      |\n"
                   "      |\n"
                   "=========\n");
            break;
        case 4:
            printf("  _____\n"
                   "  |   |\n"
                   "  O   |\n"
                   " /|\\  |\n"
                   "      |\n"
                   "      |\n"
                   "=========\n");
            break;
        case 5:
            printf("  _____\n"
                   "  |   |\n"
                   "  O   |\n"
                   " /|\\  |\n"
                   " /    |\n"
                   "      |\n"
                   "=========\n");
            break;
        case 6:
            printf("  _____\n"
                   "  |   |\n"
                   "  O   |\n"
                   " /|\\  |\n"
                   " / \\  |\n"
                   "      |\n"
                   "=========\n");
            break;
        default:
            printf("Invalid number of tries.\n");
            break;
    }
}

// Function to print greeting message
void greetingMsg() {
    printf("Welcome to the game of HANGMAN!\n");
    printf("You will be prompted to input a guess.\n");
    printf("etc ...\n");
}

// Function to print farewell message
void farewellMsg(bool result) {
    if (result == 1) {
        printf("Congrats on your victory! Goodbye :)");
    } else {
        printf("Ooof, not so hot. The man no more. Play Again?");
    }
}

// Static function to print underscores for words to go above
void printUnderscores(int wordCount) {
    int i;
    for (i = 0; i < wordCount; i++) {
        printf(" _ ");
    }
    printf("\n");
}

char getUserGuess() {
    char guess;
    printf("Type a letter to guess: \n");
    scanf("%c", &guess);
    printf("Your guess was: '%c'", guess);
}

bool calcGuessResult(char guess, answer) {
    // iterate over word, check guess char to each word, return true or false
    bool result;
    for (i = 0; i < 5; i++) {
        if ()
    }
}

// Drive the game, calling functions
int main() {
    int t = 1;
    bool currResult;
    bool endResult;
    int wordCount = 5;
    char guess;
    bool guessResult;
    char answer[] = "Irate";

    greetingMsg();

    while (t <= 6) {

        if (t == 1) { // when first guess, print blank game above
            printHangman(0);               // or when guess was true
            printUnderscores(wordCount);
        }

        guess = getUserGuess(); // for ex, guess = 'A'
        guessResult = calcGuessResult(guess, answer);
        
        printHangman(t);

        printUnderscores(wordCount);
        t++;
    }

    farewellMsg(endResult);

    return 0;
}


