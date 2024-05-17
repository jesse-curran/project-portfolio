#include <stdio.h>  // For input and output operations.
#include <stdlib.h> // For general-purpose functions like memory allocation, conversions, and process control.
#include <string.h> // For string manipulation functions.
#include <ctype.h>  // For character handling functions.
#include <stdbool.h>

// Function to print hangman after each try
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

void printWordProgress(int wordCount, char guess, int position, bool guessResult, int tryNumber, char *userAnswer) {
    
    
    for (int i = 0; i < wordCount; i++) {
        if (tryNumber == 0) {
            printf(" _ ");
        } else if (userAnswer[i] != '_') {
            printf(" %c ", userAnswer[i]);
        } else {
            printf(" _ ");
        }
    }
    printf("\n");
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
        printf("WAHOOO !!! Congrats on your victory! Goodbye :)\n");
    } else {
        printf("NOOOOOOOOO. You lost :( \nBetter luck next time.");
    }
}

char getUserGuess() {
    char guess;
    printf("\nType an UPPERCASE letter to guess: \n");
    scanf(" %c", &guess);
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
    int t = 0;
    int wordCount = 5;
    char guess;
    bool guessResult;
    char answer[] = "STUMP";
    bool playing = true;
    bool gameResult = false;
    int position;
    char userAnswer[wordCount + 1];
    memset(userAnswer, '_', wordCount);
    userAnswer[wordCount] = '\0';

    greetingMsg();

    // play hangman

    // begin with showing user blank game canvas
    printHangman(t);
    //printWordProgress(wordCount, guess, position, guessResult, t, userAnswer);
    printf("%s\n", userAnswer);

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
            //printWordProgress(wordCount, guess, position, guessResult, t, userAnswer);
            printf("%s\n", userAnswer);
        } else {    // correct guess
            userAnswer[position] = guess;
            //printf("User answer text array is now %s\n", userAnswer);
            printHangman(t);
            //printWordProgress(wordCount, guess, position, guessResult, t, userAnswer);
            printf("%s\n", userAnswer);
        }

        if (t == 6 || strcmp(userAnswer, answer) == 0) {
            playing = false;    // end game when 6 tries or word guessed
            gameResult = (strcmp(userAnswer, answer) == 0);
        }
    }

    farewellMsg(gameResult);

    return 0;
}
