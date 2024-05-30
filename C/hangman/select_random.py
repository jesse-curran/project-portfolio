import random

def select_random_words(input_file, output_file, num_words):
    # Read all words from the input file
    with open(input_file, 'r') as file:
        words = file.read().splitlines()
    
    # Ensure we don't try to select more words than are available
    if len(words) < num_words:
        raise ValueError(f"Not enough words in the input file to select {num_words} unique words.")
    
    # Randomly select num_words words
    selected_words = random.sample(words, num_words)
    
    # Write the selected words to the output file
    with open(output_file, 'w') as file:
        for word in selected_words:
            file.write(word.upper() + '\n')

    print(f"{num_words} words have been written to {output_file}.")

# File paths
input_file = 'answer.txt'
output_file = 'answer_100.txt'

# Number of words to select
num_words = 100

# Run the function
select_random_words(input_file, output_file, num_words)
