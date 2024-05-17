import nltk
from nltk.corpus import words
import random
import answer.txt






# Download the words dataset if not already downloaded
nltk.download('words')

# Get the list of English words
word_list = words.words()

# Filter words to have a length of no more than 10 characters
filtered_words = [word for word in word_list if len(word) <= 10]

# Randomly select 100 words from the filtered list
selected_words = random.sample(filtered_words, 100)

# Write the selected words to answer.txt
with open('answer_py.txt', 'w') as file:
    for word in selected_words:
        file.write(word + '\n')

print("answer.txt file has been created with 100 words.")
