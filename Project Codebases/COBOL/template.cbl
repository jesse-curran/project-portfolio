       IDENTIFICATION DIVISION.
       PROGRAM-ID. HelloWorld.

       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT StudentFile ASSIGN TO "students.txt"
               ORGANIZATION IS LINE SEQUENTIAL.

       DATA DIVISION.
       FILE SECTION.
       FD StudentFile.
       01 StudentRecord.
           05 StudentID      PIC 9(5).
           05 StudentName    PIC A(30).
           05 StudentGrade   PIC 99.

       WORKING-STORAGE SECTION.
       01 WS-StudentCount       PIC 9(5) VALUE 0.
       01 WS-TotalGrade         PIC 9(5) VALUE 0.
       01 WS-AverageGrade       PIC 99V9.

       PROCEDURE DIVISION.
       MAIN-PARA.
           OPEN INPUT StudentFile
           PERFORM READ-AND-PROCESS
           DISPLAY "Total Students: " WS-StudentCount
           DISPLAY "Average Grade: " WS-AverageGrade
           CLOSE StudentFile
           STOP RUN.

       READ-AND-PROCESS.
           PERFORM UNTIL WS-EOF
               READ StudentFile INTO StudentRecord
               AT END
                   SET WS-EOF TO TRUE
               NOT AT END
                   ADD 1 TO WS-StudentCount
                   ADD StudentGrade TO WS-TotalGrade
           END-PERFORM
           IF WS-StudentCount > 0
               COMPUTE WS-AverageGrade = WS-TotalGrade / WS-StudentCount
           ELSE
               MOVE 0 TO WS-AverageGrade
           END-IF.

       END PROGRAM HelloWorld.
