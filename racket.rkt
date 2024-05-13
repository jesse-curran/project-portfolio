#lang racket

(define (member? e lst)
  (cond
    [(null? lst) #f]
    [(equal? e (car lst)) #t]
    [else (member? e (cdr lst))]
  )
)

(define (set? lst)
  (cond
    [(null? lst) #t]
    [(member? (car lst) (cdr lst)) #f]
    [else (set? (cdr lst))]))

(define (union lst1 lst2)
  (append-unique (reverse lst1) lst2))

(define (append-unique lst1 lst2)
  (cond
    [(null? lst1) lst2]
    [(member? (car lst1) lst2) (append-unique (cdr lst1) lst2)]
    [else (append-unique (cdr lst1) (cons (car lst1) lst2))]))

(define (intersect lst1 lst2)
  (cond
    [(null? lst1) '()]
    [(member? (car lst1) lst2) (cons (car lst1) (intersect (cdr lst1) lst2))]
    [else (intersect (cdr lst1) lst2)]
  )
)

(define (difference lst1 lst2)
  (cond
    [(null? lst1) '()]
    [(member? (car lst1) lst2) (difference (cdr lst1) lst2)]
    [else (cons (car lst1) (difference (cdr lst1) lst2))]
  )
)

(define-namespace-anchor anc)
(define ns (namespace-anchor->namespace anc))
(let loop ()
  (define line (read-line (current-input-port) 'any))
  (if (eof-object? line)
    (display "")
    (begin (print (eval (read (open-input-string line)) ns)) (newline) (loop))))
