require_relative "element"
require_relative "player"
require_relative "history"

#########################################
#  CS 381 - Programming Lab #3		    #
#										#
#  Jesse Curran				 	        #
#  curranje@oregonstate.edu	            #
#										#
#########################################
def player_select
    """
    This method displays a lot of beginner game stuff and grabs input for
    player selection. Makes sure this player selection input is valid, then
    displays the showdown message,
    """
    puts "Welcome to Rock, Paper, Scissors, Lizard, Spock!\n\n"
    puts "Please choose two players:\n"
    puts "(1) StupidBot\n(2) RandomBot\n(3) IterativeBot\n(4) LastPlayBot\n(5) Human\n"

    print "Select player 1: "
    player_1_str = gets.chomp
    print "Select player 2: "
    player_2_str = gets.chomp

    valid_choices = ["1", "2", "3", "4", "5"]
    while !valid_choices.include?(player_1_str) || !valid_choices.include?(player_2_str)
        puts "Invalid choice(s) - start over"
        print "Select player 1: "
        player_1_str = gets.chomp
        print "Select player 2: "
        player_2_str = gets.chomp
    end
    player_1_int = player_1_str.to_i
    player_2_int = player_2_str.to_i
    
    player_options = [StupidBot, RandomBot, IterativeBot, LastPlayBot, Human]
    player_1_name = player_options[player_1_int -1].to_s
    player_2_name = player_options[player_2_int -1].to_s
    the_showdown = player_1_name + " vs. " + player_2_name
    puts the_showdown

    # player instances created and returned -> have a name like StupidBot and History func
    player_1 = player_options[player_1_int - 1].new("Player 1", History.new)
    player_2 = player_options[player_2_int - 1].new("Player 2", History.new)

    # return player instantiated objects, they have all the goodies
    return player_1, player_2
end

# play round method
def play_round(player_1, player_2, round_number)
    """
    Play round function that brings in all the game functionality
    into five bite size pieces. Uses all methods and classes.
    This is the driver method.
    Specifically, it lists the round number, plays a move for each player,
    says which player chose what move, displays results of round, updates history of
    opponent plays.
    """

    # display round number at start of each round
    puts "\nRound #{round_number}:"

    # play round using Player class functionality
    player_1_move = player_1.play
    player_2_move = player_2.play
    puts "Player 1 chose #{player_1_move.name}"
    puts "Player 2 chose #{player_2_move.name}"

    # compare move of player1 to player2, store msg and result
    result_msg, result = player_1_move.compare_to(player_2_move)
    puts result_msg

    # log opponent moves -> very useful for last play bot
    player_1.history.log_opponent_play(player_2_move)
    player_2.history.log_opponent_play(player_1_move)


    # update score each round via History class add_score to Player Object
    if result == "Win"
        player_1.history.add_score
        puts "Player 1 won the round"
    elsif result == "Lose"
        player_2.history.add_score
        puts "Player 2 won the round"
    else
        puts "Round was a tie"
    end
end

def display_end_credits(player_1, player_2)
    """
    Displays the end credits of the game.
    Every game has one of these right?
    Shows specifically the score of each player and
    who won.
    """
    # Display final score and the winner of the game
    p1_score = player_1.history.score
    p2_score = player_2.history.score
    puts "\nFinal score is #{p1_score} to #{p2_score}"

    if p1_score > p2_score
        puts "Player 1 wins"
    elsif p2_score > p1_score
        puts "Player 2 wins"
    else
        puts "Game was a draw"
    end
end

def game(rounds)
    """
    Functionally the main program method.
    Drivers the game, round at a time, for five times.
    Then displays end credits.
    """
    # display welcome msg, player select msg, and return player choices 1 & 2
    # grab the return values for player_1 and player_2
    player_1, player_2 = player_select()

    # play five rounds
    round_i = 1
    while round_i <= rounds
        play_round(player_1, player_2, round_i)
        round_i += 1
    end

    display_end_credits(player_1, player_2)
end

n_rounds = 5
# kick off the game, if you dare
game(n_rounds)
