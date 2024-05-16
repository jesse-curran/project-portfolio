import string


def check_pwd(pwd_string):
    # Password string requirements:
    lower_case = string.ascii_lowercase
    upper_case = string.ascii_uppercase
    digits = string.digits
    symbols = "~`!@#$%^&*()_+-="

    # Boolean variables:
    lower_case_flag = False
    upper_case_flag = False
    digits_flag = False
    symbols_flag = False

    if pwd_string == "":
        return False

    if len(pwd_string) < 8 or len(pwd_string) > 20:
        return False

    for i in range(0, len(pwd_string)):
        if pwd_string[i] in lower_case:
            lower_case_flag = True

        if pwd_string[i] in upper_case:
            upper_case_flag = True

        if pwd_string[i] in digits:
            digits_flag = True

        if pwd_string[i] in symbols:
            symbols_flag = True

    if not all([lower_case_flag, upper_case_flag, digits_flag, symbols_flag]):
        return False

    return True
