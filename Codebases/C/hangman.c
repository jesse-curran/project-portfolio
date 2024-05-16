#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_TRIES 6

void printHangman(int tries) {
    switch (tries) {
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
    }
}

int main() {
    char word[] = "programming";
    int wordLen = strlen(word);
    char guessedWord[wordLen + 1];
    int tries = 0;
    char guess;
    int correctGuess;

    for (int i = 0; i < wordLen; i++) {
        guessedWord[i] = '_';
    }
    guessedWord[wordLen] = '\0';

    printf("Welcome to Hangman!\n");

    while (tries < MAX_TRIES) {
        correctGuess = 0;
        printf("\nWord: %s\n", guessedWord);
        printHangman(tries);
        printf("Guess a letter: ");
        scanf(" %c", &guess);
        guess = tolower(guess);

        for (int i = 0; i < wordLen; i++) {
            if (word[i] == guess) {
                guessedWord[i] = guess;
                correctGuess = 1;
            }
        }

        if (!correctGuess) {
            tries++;
        }

        if (strcmp(word, guessedWord) == 0) {
            printf("\nCongratulations! You've guessed the word: %s\n", word);
            break;
        }
    }

    if (tries == MAX_TRIES) {
        printf("\nYou've been hanged! The word was: %s\n", word);
    }

    return 0;
}
