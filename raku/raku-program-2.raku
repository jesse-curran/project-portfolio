my $name = "Jesse Curran";
my $STOP_WORDS = 0;
my $DEBUG = 0;
my $SEQUENCE_LENGTH = 10;
my $FILE = "";
my @tracks = ();
my %counts = ();
my %word_history = ();

sub extract_title {
    if ($DEBUG) { say "<extracting titles>\n"; }
    my @tracktitles = ();
    for @tracks -> $track {
        if ($track ~~ /.*'<SEP>'(.*)$/) {
            @tracktitles.push: $0;
        }
    }
    return @tracktitles;
}

sub comments {
    if ($DEBUG) { say "<filtering comments>\n"; }
    my @filteredtitles = ();
    for @tracks -> $title {
        $_ = $title;
        $_ ~~ s/ \( .* //;
        $_ ~~ s/ \[ .* //;
        $_ ~~ s/ \{ .* //;
        $_ ~~ s/ \\ .* //;
        $_ ~~ s/ \/ .* //;
        $_ ~~ s/ '_' .* //;
        $_ ~~ s/ "-" .* //;
        $_ ~~ s/ \: .* //;
        $_ ~~ s/ \" .* //;
        $_ ~~ s/ \" .* //;
        $_ ~~ s/ \` .* //;
        $_ ~~ s/ \+ .* //;
        $_ ~~ s/ \= .* //;
        $_ ~~ s/ 'feat.' .* //;
        @filteredtitles.push: $_;
    }
    return @filteredtitles;
}

sub punctuation {
    if ($DEBUG) { say "<filtering punctuation>\n"; }
    my @filteredtitles = ();
    for @tracks -> $title {
        $_ = $title;
        $_ ~~ s:g/ \? //;
        $_ ~~ s:g/ \x[00BF] //;
        $_ ~~ s:g/ \! //;
        $_ ~~ s:g/ \x[00A1] //;
        $_ ~~ s:g/ \. //;
        $_ ~~ s:g/ \; //;
        $_ ~~ s:g/ \: //;
        $_ ~~ s:g/ \& //;
        $_ ~~ s:g/ \$ //;
        $_ ~~ s:g/ \* //;
        $_ ~~ s:g/ \@ //;
        $_ ~~ s:g/ \% //;
        $_ ~~ s:g/ \# //;
        $_ ~~ s:g/ \| //;
        @filteredtitles.push: $_;
    }
    return @filteredtitles;
}

sub clean {
    if ($DEBUG) { say "<filtering non-ASCII characters>\n"; }
    my @filteredtitles = ();
    for @tracks -> $title {
        $_ = $title;
        $_ ~~ s/^ \' + //;
        $_ ~~ s/ \' + $//;
        $_ ~~ s/^ \s+ //;
        $_ ~~ s/ \s+ $//;
        unless $_ ~~ / ^ <[a..z A..Z 0..9 \' \s]> + $ / {
            next;
        }
        if $title ~~ /^ \s $/ { next; }
        if $title ~~ /^ \' $/ { next; }
        $_ = $_.lc;
        @filteredtitles.push: $_;
    }
    return @filteredtitles;
}

sub stopwords {
    if ($DEBUG) { say "<filtering stopwords>\n"; }
    my @filteredtitles = ();
    for @tracks -> $title {
        $_ = $title;
        my @stop_words = <a an and by for from in of on or out the to with>;
        for @stop_words -> $stop_word {
            $_ ~~ s:g:i/ <|w> $stop_word <|w> ' ' //;
        }
        @filteredtitles.push: $_;
    }
    return @filteredtitles;
}

sub build_bigrams {
    for @tracks -> $title {
        my @words = $title.words;
        if @words.elems > 1 {
            my $i = 0;
            while $i < @words.elems - 1 {
                %counts{@words[$i]}{@words[$i+1]}++;
                $i++;
            }
        }
    }
    if ($DEBUG) { say "<bigram model built>\n"; }
}

sub mcw {
    my $word = @_[0];
    my $best_word = '';
    my $best_count = 0;
    my @sorted_words = %counts{$word}.keys.sort;
    for @sorted_words -> $next_word {
        if %word_history{$next_word} { next; }
        my $count = %counts{$word}{$next_word};
        if $count > $best_count {
            $best_count = $count;
            $best_word = $next_word;
        }
    }
    return $best_word;
}

sub sequence {
    if ($DEBUG) { say "<sequence for \'$_[0]\'>\n"; }
    my $word = @_[0];
    %word_history = ();
    %word_history{$word} = 1;
    my $sequence = $word;
    my $i = 1;
    while $i < $SEQUENCE_LENGTH {
        my $next_mcw = mcw($word);
        if $next_mcw ne "\n" || $next_mcw ne "" {
            $sequence ~= " " ~ $next_mcw;
            %word_history{$next_mcw} = 1;
            $word = $next_mcw;
            $i++;
        } else {
            last;
        }
    }
    return $sequence;
}

for lines() {
    my @input = split(/\s+/, $_);
    my $command = lc(@input[0]);
    if ($command eq "load") {
        my $file = lc(@input[1]);
        $FILE = $file;
        load($file);
    } elsif ($command eq "length") {
        if ($DEBUG) { say "<sequence length " ~ @input[1] ~ ">\n"; }
        $SEQUENCE_LENGTH = @input[1];
    } elsif ($command eq "debug") {
        if (lc(@input[1]) eq "on") {
            if ($DEBUG) { say "<debug on>\n"; }
            $DEBUG = 1;
        } elsif (lc(@input[1]) eq "off") {
            if ($DEBUG) { say "<debug off>\n"; }
            $DEBUG = 0;
        } else {
            say "**Unrecognized argument to debug: " ~ @input[1] ~ "\n";
        }
    } elsif ($command eq "count") {
        if (lc(@input[1]) eq "tracks") {
            count_lines(@tracks);
        } elsif (lc(@input[1]) eq "words") {
            count_words(@tracks);
        } elsif (lc(@input[1]) eq "characters") {
            count_characters(@tracks);
        } else {
            say "**Unrecognized argument: " ~ @input[1] ~ "\n";
        }
    } elsif ($command eq "stopwords") {
        if (lc(@input[1]) eq "on") {
            if ($DEBUG) { say "<stopwords on>\n"; }
            $STOP_WORDS = 1;
        } elsif (lc(@input[1]) eq "off") {
            if ($DEBUG) { say "<stopwords off>\n"; }
            $STOP_WORDS = 0;
        } else {
            say "**Unrecognized argument: " ~ @input[1] ~ "\n";
        }
    } elsif ($command eq "filter") {
        if (@input[1] eq "title") {
            @tracks = extract_title();
        } elsif (@input[1] eq "comments") {
            @tracks = comments();
        } elsif (@input[1] eq "punctuation") {
            @tracks = punctuation();
        } elsif (@input[1] eq "unicode") {
            @tracks = clean();
        } elsif (@input[1] eq "stopwords" && $STOP_WORDS) {
            @tracks = stopwords();
        } else {
            say "**Unrecognized argument to stopwords: " ~ @input[1] ~ "\n";
        }
    } elsif ($command eq "preprocess") {
        @tracks = extract_title();
        @tracks = comments();
        @tracks = punctuation();
        @tracks = clean();
        if ($STOP_WORDS) { @tracks = stopwords(); }
        build_bigrams();
    } elsif ($command eq "build") {
        build_bigrams();
    } elsif ($command eq "mcw") {
        say mcw(lc(@input[1]));
    } elsif ($command eq "sequence") {
        say sequence(lc(@input[1])).Str;
    } elsif ($command eq "print") {
        if (@input[1]) {
            say_some_tracks(val(@input[1]));
        } else {
            say_all_tracks(@tracks);
        }
    } elsif ($command eq "author") {
        say "Lab1 by $name run";
    } elsif ($command eq "name") {
        say sequence(lc($name));
    } elsif ($command eq "random") {
        say sequence((%counts.keys)[%counts.keys.rand]).Str;
    } else {
        say "**Unrecognized command: " ~ $command;
    }
}

sub say_some_tracks($n) {
    if ($DEBUG) { say "<printing $n tracks>\n"; }
    loop (my $i=0; $i < $n; $i++) {
        say @tracks[$i];
    }
}

sub say_all_tracks {
    if ($DEBUG) { say "<saying all tracks>\n"; }
    my $fh = open "tracks.out", :w;
    for (@_) {
        $fh.say($_);
    }
    $fh.close;
}

sub count_lines {
    if ($DEBUG) { say "<counting number of tracks>\n"; }
    say @_.elems;
}

sub count_words {
    if ($DEBUG) { say "<counting number of words>\n"; }
    my $word_count = @_.words;
    say $word_count.elems;
}

sub count_characters {
    if ($DEBUG) { say "<counting number of characters>\n"; }
    say @_.chars;
}

sub load {
    for @_.IO.lines -> $line {
        @tracks.push($line);
    }
    if ($DEBUG) { say "<loaded " ~ $FILE ~ ">"; }
}
