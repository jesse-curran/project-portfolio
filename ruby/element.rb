# element.rb
# class Element
class Element
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def compare_to(other_element)
    fail "This method should be overridden"
  end
end

# subclass instances of Element class
class Rock < Element
  def compare_to(other_element)
    if ["Scissors", "Lizard"].include?(other_element.name)
      ["Rock crushes #{other_element.name}", "Win"]
    elsif other_element.name == "Rock"
      ["Rock equals Rock", "Tie"]
    else
      if other_element.name == "Paper"
        ["#{other_element.name} covers Rock", "Lose"]
      else
        ["#{other_element.name} vaporizes Rock", "Lose"]
      end
    end
  end
end

class Paper < Element
  def compare_to(other_element)
    if other_element.name == "Rock"
      ["Paper covers #{other_element.name}", "Win"]
    elsif other_element.name == "Spock"
      ["Paper disproves #{other_element.name}", "Win"]
    elsif other_element.name == "Paper"
      ["Paper equals Paper", "Tie"]
    else
      if other_element.name == "Scissors"
        ["#{other_element.name} cut Paper", "Lose"]
      else
        ["#{other_element.name} eats Paper", "Lose"]
      end
    end
  end
end

class Scissors < Element
  def compare_to(other_element)
    if other_element.name == "Paper"
      ["Scissors cut #{other_element.name}", "Win"]
    elsif other_element.name == "Lizard"
      ["Scissors decapitate #{other_element.name}", "Win"]
    elsif other_element.name == "Scissors"
      ["Scissors equals Scissors", "Tie"]
    else
      if other_element.name == "Rock"
          ["#{other_element.name} crushes Scissors", "Lose"]
      else
          ["#{other_element.name} smashes Scissors", "Lose"]
      end
    end
  end
end

class Lizard < Element
  def compare_to(other_element)
    if other_element.name == "Spock"
      ["Lizard poisons #{other_element.name}", "Win"]
    elsif other_element.name == "Paper"
      ["Lizard eats #{other_element.name}", "Win"]
    elsif other_element.name == "Lizard"
      ["Lizard equals Lizard", "Tie"]
    else
      if other_element.name == "Rock"
        ["#{other_element.name} crushes Lizard", "Lose"]
      else
        ["#{other_element.name} decapitate Lizard", "Lose"]
      end
    end
  end
end

class Spock < Element
  def compare_to(other_element)
    if other_element.name == "Rock"
      ["Spock vaporizes #{other_element.name}", "Win"]
    elsif other_element.name == "Scissors"
      ["Spock smashes #{other_element.name}", "Win"]
    elsif other_element.name == "Spock"
      ["Spock equals Spock", "Tie"]
    else
      if other_element.name == "Lizard"
        ["#{other_element.name} poisons Spock", "Lose"]
      else
        ["#{other_element.name} disproves Spock", "Lose"]
      end
    end
  end
end

# Global list of moves to utilize -> instance of each Element class
$moves = [Rock.new("Rock"), Paper.new("Paper"), Scissors.new("Scissors"), Lizard.new("Lizard"), Spock.new("Spock")]
