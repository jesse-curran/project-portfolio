# inherited classes
require_relative "element"
require_relative "history"

# player.rb
# Player class
class Player
    attr_reader :name, :history

    def initialize(name, history)
        @name = name
        @history = history
    end

    def play()
        fail "This method should be overridden"
    end
end

class StupidBot < Player
    def play
        stupid_move = Rock.new("Rock")  # stupid move is just Rock, lol
        @history.log_play(stupid_move)  # log the move of the player
        return stupid_move              # returns the Rock move always
    end
end

class RandomBot < Player
    def play
        rand_move = $moves.sample   # '$' is used bc global variable, sample functions as random
        @history.log_play(rand_move)
        return rand_move            # returns the random move
    end
end

class IterativeBot < Player
    def initialize(name, history)
        super(name, history)
        @index = 0
    end

    def play
        iterative_move = $moves[@index] # iterates through each move once (five moves)
        @history.log_play(iterative_move)
        @index += 1 unless @index >= 5
        return iterative_move           # returns the ordered move
    end
end

class LastPlayBot < Player
    def play
        last_opponent_move = @history.opponent_plays.last || Rock.new("Rock")
        @history.log_play(last_opponent_move)
        return last_opponent_move
    end
end

class Human < Player
    def play
        puts "(1) Rock\n(2) Paper\n(3) Scissors\n(4) Lizard\n(5) Spock\n"
        valid_choices = ["1", "2", "3", "4", "5"]
        print "Enter your move: "
        input = gets.chomp
        while !valid_choices.include?(input)
            puts "Invalid move - try again"
            puts "(1) Rock\n(2) Paper\n(3) Scissors\n(4) Lizard\n(5) Spock\n"
            print "Enter your move: "
            input = gets.chomp
        end

        input_int = input.to_i
        human_move = $moves[input_int - 1]
        @history.log_play(human_move)
        return human_move
    end
end
