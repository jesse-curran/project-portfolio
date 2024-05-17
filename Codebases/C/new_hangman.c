#include <stdio.h>  // For input and output operations.
#include <stdlib.h> // For general-purpose functions like memory allocation, conversions, and process control.
#include <string.h> // For string manipulation functions.
#include <ctype.h>  // For character handling functions.
#include <stdbool.h>

// Function to print hangman after each try; update when unsuccessful attempt
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
            printf("Invalid number of attempts...\n");
            break;
    }
}

// Function to print greeting message
void greetingMsg() {
    printf("\n\n\nWelcome to the game of HANGMAN!\n");
    printf("You will be prompted to input a guess.\n");
    printf("etc ...\n\n\n");
}

// Function to print farewell message
void farewellMsg(bool result) {
    if (result) {
        printf("WAHOOO !!! Congrats on your victory! Goodbye :)\n\n\n");
    } else {
        printf("NOOOOOOOOO. You lost :( \nBetter luck next time.\n\n\n");
    }
}

// Function to grab user input guess
char getUserGuess() {
    char guess;
    printf("\nType a letter to guess: \n");
    scanf(" %c", &guess);
    guess = toupper(guess);
    printf("Your guess was: '%c'\n", guess);
    return guess;
}

// Function to check if the guess is in the word and update the position
bool checkGuess(char guess, char *answer, int *position) {
    for (int i = 0; i < strlen(answer); i++) {
        if (answer[i] == guess) {
            *position = i;
            return true;
        }
    }
    return false;
}

// Drive the game, calling functions
int main() {

    // Initializing Variables -------------------------------
    int t = 0;
    int position;
    char guess;
    char answer[] = "STUMP";
    int wordCount = strlen(answer);
    char userAnswer[wordCount + 1];
    bool guessResult;
    bool playing = true;
    bool gameResult = false;
    // ------------------------------------------------------

    // fill userAnswer (block of memory) with '_' to 
    memset(userAnswer, '_', wordCount);

    // mark where string length ends in memory; null terminator '\0'
    // the ending is the length of the answer text
    userAnswer[wordCount] = '\0';

    greetingMsg();

    // GAME STARTS. Begin with showing blank game canvas.
    printHangman(t);
    printf("%s\n", userAnswer);

    // PLAY THE GAME
    while (playing) {
        guess = getUserGuess();

        printf("Calculating if your guess was correct ...\n\n");

        guessResult = checkGuess(guess, answer, &position);

        if (guessResult) {
            printf("Woah, CORRECT GUESS!\n\n");

        } else {
            printf("Uh oh, INCORRECT GUESS.\n\n");
        }


        printf("Printing the updated game board ... \n\n");

        if (!guessResult) { // incorrect guess
            t++;
            printHangman(t);
            printf("%s\n", userAnswer);

        } else {    // correct guess
            userAnswer[position] = guess;
            printHangman(t);
            printf("%s\n", userAnswer);
        }

        if (t == 6 || strcmp(userAnswer, answer) == 0) {
            playing = false;    // end game when 6 tries or word guessed reached
            gameResult = (strcmp(userAnswer, answer) == 0);
        }
    }

    // GAME ENDING
    farewellMsg(gameResult);

    return 0;
}
