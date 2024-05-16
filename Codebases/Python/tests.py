from check_pwd import check_pwd
import unittest


class TestCases(unittest.TestCase):
    def test1(self):
        """Tests for empty input."""
        input = ""
        self.assertFalse(check_pwd(input))

    def test2(self):
        """Tests for input under 8 characters."""
        input = "1"
        self.assertFalse(check_pwd(input))

    def test3(self):
        """Tests for input over 20 characters."""
        input = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM"
        self.assertFalse(check_pwd(input))

    def test4(self):
        """Tests for input containing lowercase letter."""
        input = "12345678"
        self.assertFalse(check_pwd(input))

    def test5(self):
        """Tests for input containing uppercase letter."""
        input = "abcdefghijklmnop"  # 16 characters
        self.assertFalse(check_pwd(input))

    def test6(self):
        """Tests for input where there is not at least one digit."""
        input = "aBcdefghijk"
        self.assertFalse(check_pwd(input))

    def test7(self):
        """Tests for input where a symbol is not present."""
        input = "1aBcdefghi"
        self.assertFalse(check_pwd(input))


if __name__ == "__main__":
    unittest.main()
