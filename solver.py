import math
import itertools

with open("words") as f:
    dictionary = f.readlines()
# strip newline characters
dictionary = [x.strip() for x in dictionary] 


def solve_letters(letters):
    letters = letters.lower().split(",")
    longest_word = ''
    longest_word_length = 0
    
    # Loop through the dictionary to find words which we have all the letters for
    for word in dictionary:
        # If it's shorted than a word we've already found, don't even bother checking this one
        if len(word) > longest_word_length:
            # Wrap letters in list() so we pass a copy of the letters list, as it gets cut down in the function
            if word_is_valid(word, list(letters)):
                longest_word = word
                longest_word_length = len(word)

    return longest_word


def word_is_valid(word, letters):
    # first check if all the letters in word are in our letters list - this is quick and cheap
    for char in word:
        if char not in letters:
            return False
        else:
            # remove this letter from our list so we can't use it again
            for index, letter in enumerate(letters):
                if letter == char:
                    letters[index] = ""
                    break
                
    return True


def check_word(word, letters):
    word = word.lower()
    if word in dictionary:
        letters = letters.lower().split(",")
        if word_is_valid(word, letters):
            return "That's a good word."
        else:
            return "That word cannot be made from your letters."
    
    return "That's not a real word."


def solve_numbers(numbers, target):
    numbers = numbers.split(",")
    # convert the strings to integers
    numbers = list(map(int, numbers))

    for length in range(2, 6):
        for operations in get_operations(length - 1):
            for permutation in itertools.permutations(numbers, length):
                if get_value(permutation, operations) == target:
                    return permutation, operations

    return "no solution"


def get_operations(length):
    # Return a list of all permutations of operations of length n
    # Each permutation is a list of numbers representing the operators:
    # 0 = +, 1 = -, 2 = *, 3 = /
    operations = []

    # Calculate all permutations by treating them as incrementing base 4 numbers - we will
    # need to go up to 4^length - 1 to get all the different ones
    for i in range(0, 4 ** length):
        operations.append(generate_operation(i, length))

    return operations


def generate_operation(index, length):
    # get a list of operations for this index - basically convert the index to a list of integers
    # in base 4
    operation_list = []

    for position in range(length - 1, -1, -1):
        factor = 4 ** position
        key_at_position = math.floor(index/factor)
        operation_list.append(key_at_position)
        index = index - (key_at_position * factor)

    return operation_list


def get_value(permutation, operations):
    # calculate the value when operations are applied to this permutation
    value = permutation[0]

    # TODO: add postfix variations
    for index, operation in enumerate(operations):
        if operation == 0:
            value = value + permutation[index + 1]
        elif operation == 1:
            value = value - permutation[index + 1]
            # negative numbers are not allowed in intermediate stages
            if value < 0:
                return 0
        elif operation == 2:
            value = value * permutation[index + 1]
        else:
            value = value / permutation[index + 1]
            # fractions are not allowed in intermediate stages
            if not isinstance(value, int):
                return 0

    return value

if __name__ == "__main__":
    solution = solve_numbers('2,4,7,10,25,100', 647)
    print("Solution is ", solution)
