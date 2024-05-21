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
bool checkGuess(char guess, char *answer, bool *positions) {
    bool found = false;
    for (unsigned long i = 0; i < strlen(answer); i++) {
        if (answer[i] == guess) {
            positions[i] = true;
            found = true;
        }
    }
    return found;
}


// Function to grab a random word from answer.txt file each time
char* grabTextAnswer() {
    static char answer[3000]; // Buffer to store the selected word.
    char lines[3000][6]; // 2D array storing up to 3000 words, each of length 5 + null terminator
    int numWords = 0;   // number of words read in the file
    char line[50];  // buffer to read each line from the file

    FILE *file = fopen("wordle_answers.txt", "r");  // open file, read. 
    if (file == NULL) {
        printf("Error opening file!\n");
        exit(1);
    }

    // strcpy(destination, source);
    // Read words from the file. each loop is one word read, into the lines array.
    while (fgets(line, sizeof(line), file) != NULL && numWords < 3000) {
        line[strcspn(line, "\n")] = 0; // Remove all newline characters, one word at a time. GRAB ANSWER.
        strcpy(lines[numWords], line);  // copy the line word answers minus newline, put into answer array lines
        numWords++; // used to count words read and iterate to next word
    }

    fclose(file);

    // If no words were read, return an empty string
    if (numWords == 0) {
        printf("No words found in file.\n");
        return answer;
    }

    // Initialize random seed and choose a random word from the array
    srand((unsigned)time(NULL));
    strcpy(answer, lines[rand() % numWords]); // Copy a random word to answer
    
    // quick convert answer characters to upper
    for (int i = 0; answer[i] != '\0'; i++) {
        answer[i] = toupper(answer[i]);
    }

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
    char guess;
    char *answer = grabTextAnswer();
    int wordCount = strlen(answer);
    char userAnswer[wordCount + 1];
    bool guessResult;
    bool playing = true;
    bool gameResult = false;
    bool guessed[26] = {false}; // Track guessed letters
    bool positions[wordCount]; // Track positions of correctly guessed letters
    // ------------------------------------------------------

    // fill userAnswer (block of memory) with '_' to 
    memset(userAnswer, '_', wordCount);
    memset(positions, false, wordCount); // Initialize positions array

    // mark where string length ends in memory; null terminator '\0'
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

        guessResult = checkGuess(guess, answer, positions);

        if (guessResult) {
            printf("Woah, CORRECT GUESS!\n\n");
        } else {
            printf("Uh oh, INCORRECT GUESS.\n\n");
        }

        // Mark the letter as guessed
        guessed[guess - 'A'] = true; // A = 65, Z = 90, difference finds alphabet corresponding index 

        printf("Printing the updated game board ... \n\n");

        if (!guessResult) { // incorrect guess
            t++;
            printHangman(t);
        } else {    // correct guess
            for (int i = 0; i < wordCount; i++) {
                if (positions[i]) {
                    userAnswer[i] = answer[i];
                }
            }
            printHangman(t);
        }

        printf("Mystery Word => ");
        printf("%s\n", userAnswer);
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
