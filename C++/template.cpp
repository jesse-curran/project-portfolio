#include <iostream>
#include <vector>
#include <string>

// Namespace
using namespace std;

// Global constant
const double PI = 3.14159;

// Function declaration
void printMessage(const string& message);

// Class definition
class Animal {
public:
    Animal(const string& name) : name(name) {}
    virtual void makeSound() const = 0; // Pure virtual function
    virtual ~Animal() = default;

protected:
    string name;
};

// Derived class inheriting from Animal
class Dog : public Animal {
public:
    Dog(const string& name) : Animal(name) {}
    void makeSound() const override {
        cout << name << " says: Woof!" << endl;
    }
};

// Template function
template <typename T>
T add(T a, T b) {
    return a + b;
}

// Main function
int main() {
    // Variables and basic I/O
    int age = 25;
    double height = 5.9;
    string name = "John";

    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    cout << "Height: " << height << " feet" << endl;

    // Function call
    printMessage("Hello, World!");

    // Using a class and polymorphism
    Animal* myDog = new Dog("Buddy");
    myDog->makeSound();
    delete myDog;

    // Using a vector
    vector<int> numbers = {1, 2, 3, 4, 5};
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;

    // Template function call
    int sumInt = add<int>(3, 7);
    double sumDouble = add<double>(3.5, 7.5);

    cout << "Sum (int): " << sumInt << endl;
    cout << "Sum (double): " << sumDouble << endl;

    return 0;
}

// Function definition
void printMessage(const string& message) {
    cout << message << endl;
}
