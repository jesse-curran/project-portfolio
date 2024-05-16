#include <stdio.h>  // Standard input and output
#include <errno.h>  // Access to errno and Exxx macros
#include <stdint.h> // Extra fixed-width data types
#include <string.h> // String utilities
#include <err.h>    // Convenience functions for error reporting (non-standard)

/* Defining the Base64 alphabet */
static char const b64_alphabet[] =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  "abcdefghijklmnopqrstuvwxyz"
  "0123456789"
  "+/";

/* The main function */
int main(int argc, char *argv[])
{
    /* Declaring a file pointer */
    FILE *file_pointer;

    /* Checking for command-line arguments */
    if (argc > 2) {
        fprintf(stderr, "Usage: %s [FILE]\n", argv[0]);
        errx(1, "Too many arguments");

    /* If a filename is provided and not "-" */
    } else if (argc == 2 && strcmp(argv[1], "-")) {
        file_pointer = fopen(argv[1], "r");
        if (file_pointer == NULL){
            errx(1, "Error trying to open the file");
        }

    /* If no filename or "-" is provided, use stdin instead */
    } else {
        file_pointer = stdin;
    }


    int line_length_counter = 0;
    int output_flag = 0;

    /* Begin the encoding loop */
    for (;;) {
        
        /* Declare and initialize input buffer */
        uint8_t input_bytes[3] = {0};
        
        /* Read three bytes from the input */
        size_t n_read = fread(input_bytes, 1, 3, file_pointer);
        
        /* Process the input data if any data was read */
        if (n_read != 0) {
            
            output_flag = 1;

            /* Convert input bytes into Base64 indices */
            int alph_ind[4];
            alph_ind[0] = input_bytes[0] >> 2;
            alph_ind[1] = (input_bytes[0] << 4 | input_bytes[1] >> 4) & 0x3F;
            alph_ind[2] = (input_bytes[1] << 2 | input_bytes[2] >> 6) & 0x3F;
            alph_ind[3] = input_bytes[2] & 0x3F;
            
            /* Build the Base64-encoded output string */
            char output[5];
            output[0] = b64_alphabet[alph_ind[0]];
            output[1] = b64_alphabet[alph_ind[1]];
            output[2] = n_read > 1 ? b64_alphabet[alph_ind[2]] : '=';
            output[3] = n_read > 2 ? b64_alphabet[alph_ind[3]] : '=';
            output[4] = '\0';

            /* print the output string per each 76 char */
            for (int i = 0; i < 4; i++) {
                if (line_length_counter == 76) {
                    putchar('\n');
                    line_length_counter = 0;
                }
                putchar(output[i]);
                line_length_counter++;
            }
        }

        /* Check if fewer bytes than requested were read */
        if (n_read < 3) {

            /* Break the loop if the end of the file is reached */
            if (feof(file_pointer)) break; /* End of file */
            if (ferror(file_pointer)) err(1, "Read error");
        }
    }
    
    if (output_flag == 0) {
        fclose(file_pointer);
        return 0;
    }
    
    putchar('\n');

    /* Close the file if it is not stdin */
    if (file_pointer != stdin) fclose(file_pointer);

    /* Perform cleanup tasks if necessary */
    fflush(stdout);

    return 0;
}


