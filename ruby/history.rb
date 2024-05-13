# history.rb

class History
    attr_accessor :plays, :opponent_plays, :score

    def initialize
      @score = 0
      @plays = Array.new
      @opponent_plays = Array.new
    end

    def log_play(move)
      @plays << move  # '<<' appends the move to the plays array for a player move list
    end

    def log_opponent_play(move)
      @opponent_plays << move # logging opponent plays for last play bot
    end

    def add_score
      @score += 1 # adding score to a player's history -> winning moves
    end
end
