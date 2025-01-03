from spellchecker import SpellChecker
import re
from nltk.corpus import wordnet

def preprocess_prompt(prompt):
   
    # Step 1: Text Cleaning
    prompt = clean_text(prompt)

    # Step 2: Spell Checking
    prompt = correct_spelling(prompt)

    # Step 3: Synonym Replacement
    prompt = replace_synonyms(prompt)

    # Step 4: Keyword Highlighting
    prompt = highlight_keywords(prompt)

    return prompt

def clean_text(prompt):
    
    # Remove special characters
    prompt = re.sub(r'[^a-zA-Z0-9\s]', '', prompt)
    # Remove extra spaces
    prompt = re.sub(r'\s+', ' ', prompt).strip()
    # Convert to lowercase
    return prompt.lower()

def correct_spelling(prompt):
   
    spell = SpellChecker()
    words = prompt.split()
    corrected_words = [spell.correction(word) if word in spell.unknown(words) else word for word in words]
    return ' '.join(corrected_words)

def replace_synonyms(prompt):
    
    words = prompt.split()
    replaced_words = []

    for word in words:
        # Get synonyms for the word using WordNet
        synonyms = wordnet.synsets(word)
        if synonyms:
            # Use the first synonym's lemma as a replacement
            synonym = synonyms[0].lemmas()[0].name()
            replaced_words.append(synonym if synonym != word else word)
        else:
            replaced_words.append(word)

    return ' '.join(replaced_words)

def highlight_keywords(prompt):
    
    # Define a list of keywords to highlight
    keywords = {'astronaut', 'horse', 'moon', 'space'}
    words = prompt.split()
    highlighted_words = [
        f"[{word}]" if word in keywords else word for word in words
    ]
    return ' '.join(highlighted_words)

# Main function to run the preprocessing pipeline dynamically
if __name__ == "__main__":
    # Dynamically take the prompt as input from the user
    input_prompt = input("Enter your prompt: ").strip()
    preprocessed_prompt = preprocess_prompt(input_prompt)
    print("\n--- Preprocessing Results ---")
    print("Original Prompt:", input_prompt)
    print("Preprocessed Prompt:", preprocessed_prompt)
