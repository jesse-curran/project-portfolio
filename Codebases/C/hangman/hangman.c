#include <stdio.h>  // For input and output operations.
#include <stdlib.h> // For general-purpose functions like memory allocation, conversions, and process control.
#include <string.h> // For string manipulation functions.
#include <ctype.h>  // For character handling functions.
#include <stdbool.h>
#include <time.h>   // For random number generation

/* INSTRUCTIONS:
    Go into your terminal.
    Have a C compiler installed.
    e.g. run clang -o hangman_exe new_hangman.c  
    then run ./hangman_exe
    play the game
    voila          
*/

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
    printf("The mystery answer is a five letter word.\n");
    printf("These words were randomly pulled from Wordle words.\n");
    printf("Good Luck!\n\n\n");
}

// Function to print farewell message
void farewellMsg(bool result, char *answer) {
    if (result) {
        printf("WAHOOO !!! Congrats on your victory! Goodbye :)\n\n\n");
    } else {
        printf("\n\nNOOOOOOOOO. You lost :( \n\n Correct answer was %s\n\n\n", answer);
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
    for (unsigned long i = 0; i < strlen(answer); i++) {
        if (answer[i] == guess) {
            *position = i;
            return true;
        }
    }
    return false;
}

// Function to grab a random wordle word from answer.txt file each time
char* grabTextAnswer() {
    static char answer[100];
    char words[100][100];
    int count = 0;
    FILE *file = fopen("answer_100.txt", "r");
    if (file == NULL) {
        printf("Error opening file!\n");
        exit(1);
    }

    while (fgets(words[count], sizeof(words[count]), file)) {
        words[count][strcspn(words[count], "\n")] = '\0'; // Remove newline character
        count++;
    }
    fclose(file);

    srand(time(NULL));
    int randomIndex = rand() % count;
    strcpy(answer, words[randomIndex]);

    return answer;
}

// Function to print the alphabet and mark guessed letters
void printAlphabet(bool guessed[26]) {
    printf("\n'[]' indicates prior guessed letters \n\n");
    for (char c = 'A'; c <= 'Z'; c++) {
        if (guessed[c - 'A']) {
            printf("[%c] ", c);
        } else {
            printf(" %c  ", c);
        }
    }
    printf("\n");
}

// Drive the game, calling functions
int main() {

    // Initializing Variables -------------------------------
    int t = 0;
    int position;
    char guess;
    char *answer = grabTextAnswer();
    int wordCount = strlen(answer);
    char userAnswer[wordCount + 1];
    bool guessResult;
    bool playing = true;
    bool gameResult = false;
    bool guessed[26] = {false}; // Track guessed letters
    // ------------------------------------------------------

    // fill userAnswer (block of memory) with '_' to 
    memset(userAnswer, '_', wordCount);

    // mark where string length ends in memory; null terminator '\0'
    // the ending is the length of the answer text
    userAnswer[wordCount] = '\0';

    greetingMsg();

    // GAME STARTS. Begin with showing blank game canvas.
    printHangman(t);
    printf("Mystery Word => ");
    printf("%s\n", userAnswer);
    printAlphabet(guessed);

    // PLAY THE GAME
    while (playing) {
        guess = getUserGuess();

        printf("\nCalculating if your guess was correct ...\n\n");

        guessResult = checkGuess(guess, answer, &position);

        if (guessResult) {
            printf("Woah, CORRECT GUESS!\n\n");

        } else {
            printf("Uh oh, INCORRECT GUESS.\n\n");
        }

        // Mark the letter as guessed
        guessed[guess - 'A'] = true;

        printf("Printing the updated game board ... \n\n");

        if (!guessResult) { // incorrect guess
            t++;
            printHangman(t);
            printf("Mystery Word => ");
            printf("%s\n", userAnswer);

        } else {    // correct guess
            userAnswer[position] = guess;
            printHangman(t);
            printf("Mystery Word => ");
            printf("%s\n", userAnswer);
        }

        printAlphabet(guessed);

        if (t == 6 || strcmp(userAnswer, answer) == 0) {
            playing = false;    // end game when 6 tries or word guessed reached
            gameResult = (strcmp(userAnswer, answer) == 0);
        }
    }

    // GAME ENDING
    farewellMsg(gameResult, answer);

    return 0;
}
