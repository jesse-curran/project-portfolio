/* Multithread Line Processor Program (MTP) */

#include <stdio.h>
#include <pthread.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdbool.h>
#include <ctype.h>

#define LINE_COUNT 50
#define LINE_LENGTH 1000
#define STOP_CONDITION "STOP\n"
int CHAR_TARGET = 80;

// Structure to represent a shared buffer
struct shared_buffer
{
    char shared_buffer[LINE_COUNT][LINE_LENGTH];
    pthread_mutex_t mutex;
    pthread_cond_t full;
    pthread_cond_t empty;
};

// Array of shared buffers
struct shared_buffer buffers[4];

// Initialize a shared buffer
void initialize_buffer(struct shared_buffer* shared_buffer)
{
    memset(shared_buffer->shared_buffer, 0, sizeof(shared_buffer->shared_buffer));
    shared_buffer->mutex = (pthread_mutex_t)PTHREAD_MUTEX_INITIALIZER;
    shared_buffer->full = (pthread_cond_t)PTHREAD_COND_INITIALIZER;
}

// Put an item into the shared buffer
void put_item(struct shared_buffer* shared_buffer, int line, char input[])
{
    pthread_mutex_lock(&shared_buffer->mutex);
    strcpy(shared_buffer->shared_buffer[line], input);
    pthread_cond_signal(&shared_buffer->full);
    pthread_mutex_unlock(&shared_buffer->mutex);
}

// Get an item from the shared buffer
void get_item(struct shared_buffer* shared_buffer, int line, char output[])
{
    ssize_t line_length;

    pthread_mutex_lock(&shared_buffer->mutex);
    while ((line_length = strlen(shared_buffer->shared_buffer[line])) == 0)
    {
        pthread_cond_wait(&shared_buffer->full, &shared_buffer->mutex);
    }

    pthread_cond_signal(&shared_buffer->empty);
    strcpy(output, shared_buffer->shared_buffer[line]);
    pthread_mutex_unlock(&shared_buffer->mutex);
}

// Replace a character in a line with a new character.
void replace_character(char* line, const char* curr_character, const char* new_character)
{
    char* curr_char_index = strstr(line, curr_character);
    if (curr_char_index == NULL) {
        return;
    }

    size_t curr_char_len = strlen(curr_character);
    size_t new_char_len = strlen(new_character);
    size_t len_remaining = strlen(curr_char_index + curr_char_len);

    memmove(curr_char_index + new_char_len, curr_char_index + curr_char_len, len_remaining + 1);
    memcpy(curr_char_index, new_character, new_char_len);

    replace_character(curr_char_index + new_char_len, curr_character, new_character);
}

// Handle the stop condition in the input
int handle_stop_condition(const char* input)
{
    const char* position_pointer = strstr(input, STOP_CONDITION);
    if (position_pointer == input)
    {
        int next_char_index = strlen(STOP_CONDITION);
        char next_char = input[next_char_index];
        if (!isalnum(next_char) && !ispunct(next_char))
        {
            return next_char_index;
        }
    }
    else if (position_pointer != NULL)
    {
        int position = position_pointer - input;
        char prev_char = input[position - 1];
        if (!isalnum(prev_char) && !ispunct(prev_char))
        {
            return position;
        }
    }
    return -1;
}

// Input thread function
void* input_thread(void* args)
{
    (void)args;
    char input[LINE_LENGTH] = { 0 };
    int buffer_line = 0;
    int position = -1;

    // Read input lines until the line count limit
    while (buffer_line != LINE_COUNT)
    {
        fgets(input, LINE_LENGTH, stdin);
        position = handle_stop_condition(input);
        if (position != -1)
        {
            input[position] = '\3';
            put_item(&buffers[0], buffer_line, input);
            return NULL;
        }
        put_item(&buffers[0], buffer_line, input);
        buffer_line += 1;
    }
    return NULL;
}

// Line separator thread function
void* line_separator_thread(void* args)
{
    (void)args;
    int buffer_line = 0;
    char input[LINE_LENGTH] = {0};

    // Process lines from the input thread
    while (true)
    {
        get_item(&buffers[0], buffer_line, input);
        if (strstr(input, "\3") != NULL)
        {
            put_item(&buffers[1], buffer_line, input);
            return NULL;
        }
        replace_character(input, "\n", " ");
        put_item(&buffers[1], buffer_line, input);
        buffer_line += 1;
    }
    return NULL;
}

// Plus sign thread function
void* plus_sign_thread(void* args)
{
    (void)args;
    int buffer_line = 0;
    char input[LINE_LENGTH] = { 0 };

    // Process lines from the line separator thread
    while (true)
    {
        get_item(&buffers[1], buffer_line, input);
        if (strstr(input, "\3") != NULL)
        {
            put_item(&buffers[2], buffer_line, input);
            return NULL;
        }
        replace_character(input, "++", "^");
        put_item(&buffers[2], buffer_line, input);
        buffer_line += 1;
    }
    return NULL;
}

// Output thread function
void* output_thread(void* args)
{
    (void)args;
    int buffer_line = 0;
    char input[LINE_LENGTH] = { 0 };
    char processed_lines[LINE_COUNT * LINE_LENGTH] = { 0 };
    char output[81] = { 0 };
    int remaining_chars = CHAR_TARGET;
    int i = 0;
    int j = 0;

    // Process lines from the plus sign thread
    while (true)
    {
        get_item(&buffers[2], buffer_line, input);
        strcat(processed_lines, input);
        if (strstr(input, "\3") != NULL)
        {
            int processed_lines_len = strlen(processed_lines);
            for (; j < processed_lines_len && processed_lines[j] != '\3'; ++j)
            {
                output[i] = processed_lines[j];
                i += 1;
                remaining_chars -= 1;
                if (remaining_chars == 0)
                {
                    output[i] = '\0';
                    printf("%s\n", output);
                    fflush(stdout);
                    i = 0;
                    remaining_chars = CHAR_TARGET;
                }
            }
            put_item(&buffers[3], buffer_line, input);
            return NULL;
        }
        int processed_lines_len = strlen(processed_lines);
        for (; j < processed_lines_len && processed_lines[j] != '\3'; ++j)
        {
            output[i] = processed_lines[j];
            i += 1;
            remaining_chars -= 1;
            if (remaining_chars == 0)
            {
                output[i] = '\0';
                printf("%s\n", output);
                fflush(stdout);
                memset(output, 0, sizeof(output));
                i = 0;
                remaining_chars = CHAR_TARGET;
            }
        }
        buffer_line += 1;
    }
    exit(0);
}

int main(void)
{
    srand(time(0));
    pthread_t threads[4];

    // Initialize the shared buffers
    for (int i = 0; i < 4; i++)
    {
        initialize_buffer(&buffers[i]);
    }

    // Create the threads
    pthread_create(&threads[0], NULL, input_thread, NULL);
    pthread_create(&threads[1], NULL, line_separator_thread, NULL);
    pthread_create(&threads[2], NULL, plus_sign_thread, NULL);
    pthread_create(&threads[3], NULL, output_thread, NULL);

    // Wait for the threads to finish
    for (int i = 0; i < 4; i++)
    {
        pthread_join(threads[i], NULL);
        pthread_mutex_destroy(&buffers[i].mutex);
        pthread_cond_destroy(&buffers[i].full);
    }

    return 0;
}
