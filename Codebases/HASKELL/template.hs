-- Main.hs
module Main where

import Data.Char (toUpper)

-- Data Type Declaration
data Person = Person { name :: String, age :: Int } deriving (Show)

-- Function Definitions
greet :: Person -> String
greet person = "Hello, " ++ name person ++ "!"

-- Pattern Matching
describeAge :: Person -> String
describeAge (Person _ age)
  | age < 18  = "You are a minor."
  | age < 65  = "You are an adult."
  | otherwise = "You are a senior."

-- List Comprehension
squares :: [Int] -> [Int]
squares xs = [x * x | x <- xs]

-- Higher-Order Function
applyTwice :: (a -> a) -> a -> a
applyTwice f x = f (f x)

-- Recursive Function
factorial :: Int -> Int
factorial 0 = 1
factorial n = n * factorial (n - 1)

-- I/O Operations
main :: IO ()
main = do
  putStrLn "Enter your name:"
  inputName <- getLine
  putStrLn "Enter your age:"
  inputAge <- getLine
  let person = Person { name = inputName, age = read inputAge :: Int }
  putStrLn (greet person)
  putStrLn (describeAge person)
  putStrLn "Squares of the first 10 numbers:"
  print (squares [1..10])
  putStrLn "Factorial of 5:"
  print (factorial 5)
  putStrLn "Apply uppercase function twice to 'haskell':"
  print (applyTwice (map toUpper) "haskell")
