% load family tree
:- consult('royal.pl').

% enables piping in tests
portray(Term) :- atom(Term), format("~s", Term).

% --------- Parents ------------------

% MOTHER: Female parent of child.
% Defines the Mother rule. Mother must have a child, be a parent, 
% and be female.
mother(Mother, Child):- 
    parent(Mother,Child), 
    female(Mother).

% FATHER: Male parent of child.
% Defines the Father rule. Father must have child, be a parent, 
% and be male.
father(Father, Child):- 
    parent(Father,Child), 
    male(Father).

% ------- Immediate Family ------------

% SPOUSE: Finds if two persons are married to each other.
% If one is married to the other, and the other is married to
% the one, then they are spouses.
spouse(Partner1, Partner2) :- 
    married(Partner1, Partner2); 
    married(Partner2, Partner1).

% CHILD: Determines child of parent.
% Defines a child rule. A child has a parent.
child(Child, Parent) :- 
    parent(Parent, Child).

% SON: Male child of parent.
% Defines a son rule. They are a child, male.
son(Son, Parent) :- 
    child(Son, Parent), 
    male(Son).

% DAUGHTER: Female child of parent.
% Defines a daughter rule. They are a child, female.
daughter(Daughter, Parent) :- 
    child(Daughter, Parent), 
    female(Daughter).

% SIBLING: Determines if shared common parents.
% Defines a sibling rule. They are someone who has the same parent, and
% they are not the same person.
sibling(Person1, Person2) :- 
    parent(Parent, Person1), 
    parent(Parent, Person2), 
    Person1 \= Person2.

% BROTHER: Male sibling.
% Defined as a male sibling.
brother(Brother, Sibling) :- 
    sibling(Brother, Sibling), 
    male(Brother).

% SISTER: Female sibling.
% Defined as a female sibling.
sister(Sister, Sibling) :- 
    sibling(Sister, Sibling), 
    female(Sister).

% ---- Extended Family ------------

% UNCLE BY MARRIAGE: Effectively brother in law of parent.
% Defined as a male person with a nephew, related to a spouse.
uncle(Uncle, Nephew) :- 
    parent(Parent, Nephew), 
    sister(Sister, Parent), 
    spouse(Uncle, Sister), 
    male(Uncle).

% UNCLE BY BLOOD: The brother of the parent.
% Defined as a male with a nephew related to brother.
uncle(Uncle, Nephew) :- 
    parent(Parent, Nephew), 
    brother(Uncle, Parent).

% AUNT BY BLOOD: The sister of the parent.
% Defined as a female with a nephew related to sister.
aunt(Aunt, Nephew) :- 
    parent(Parent, Nephew), 
    sister(Aunt, Parent).

% AUNT BY MARRIAGE: Sister in law of the parent.
% Defined as a female person with a nephew, related to a spouse.
aunt(Aunt, Nephew) :- 
    parent(Parent, Nephew), 
    brother(Brother, Parent), 
    spouse(Aunt, Brother), 
    female(Aunt).

% GRANDPARENT: A parent of a parent. Simple as that.
grandparent(Grandparent, Child) :- 
    parent(Grandparent, Parent), 
    parent(Parent, Child).

% GRANDFATHER: Male grandparent.
grandfather(Grandparent, Child) :- 
    grandparent(Grandparent, Child), 
    male(Grandparent).

% GRANDMOTHER: Female Grandparent.
grandmother(Grandparent, Child) :- 
    grandparent(Grandparent, Child), 
    female(Grandparent).

% GRANDCHILD: Child of a grandparent.
grandchild(Grandchild, Grandparent) :- 
    grandparent(Grandparent, Grandchild).

% ----- Ancestors ----------------

% ANCESTORS (RECURSIVE): Defines an ancestor-descendant relation.
% Base Case
ancestor(Ancestor, Descendant) :- 
    parent(Ancestor, Descendant).
% Recursive Case - trace ancestry - parent to grandparent
ancestor(Ancestor, Descendant) :- 
    parent(Parent, Descendant), 
    ancestor(Ancestor, Parent).


% DESCENDANT (RECURSIVE): Defines a descendant-descendant relation.
% Base Case
descendant(Descendant, Ancestor) :- 
    child(Descendant, Ancestor).
% Recursive Case - trace descendancy - parent to child
descendant(Descendant, Ancestor) :- 
    child(Child, Ancestor), 
    descendant(Descendant, Child).

% ---- Numeric Comparisons

% OLDER: Defines a older person relation.
% Finds older by comparing birth years.
older(X, Y) :- 
    born(X, X_Year), 
    born(Y, Y_Year), 
    X_Year < Y_Year.

% YOUNGER: Defines a younger person relation.
% Finds younger by comparing birth years.
younger(X, Y) :- 
    born(X, X_Year), 
    born(Y, Y_Year), 
    X_Year > Y_Year.

% REGENT WHEN BORN
% Finds who was king or queen (X) when Y person was born.
regentWhenBorn(X, Y) :- 
    born(Y, Birth), 
    reigned(X, Start, End), 
    Birth < End,
    Birth >= Start.
    

% --- Extra Credit --- First Cousin ------------------

% FIRST COUSIN
% Defines first cousin relation.
% Determines whether cousins parents are siblings and not 
% the same people.
cousin(Cuz1, Cuz2) :- 
    parent(Parent1, Cuz1), 
    parent(Parent2, Cuz2), 
    sibling(Parent1, Parent2),
    Cuz1 \= Cuz2.

% ---- END of RULES --------------------------------
