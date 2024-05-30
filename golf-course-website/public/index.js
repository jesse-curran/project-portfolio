document.addEventListener('DOMContentLoaded', () => {
    // Prepopulated Tee Times
    let teeTimes = [
        { id: 1, date: '2024-06-01', time: '08:00', players: 4 },
        { id: 2, date: '2024-06-01', time: '09:00', players: 3 },
        { id: 3, date: '2024-06-01', time: '10:00', players: 2 },
        { id: 4, date: '2024-06-02', time: '08:00', players: 4 },
        { id: 5, date: '2024-06-02', time: '09:00', players: 3 },
        { id: 6, date: '2024-06-02', time: '10:00', players: 2 },
    ];

    let nextId = 7; // Incremental ID for new bookings
    const teeTimesContainer = document.getElementById('teeTimesContainer');
    const searchForm = document.getElementById('searchForm');

    function displayTeeTimes(times) {
        teeTimesContainer.innerHTML = ''; // Clear previous results
        times.forEach(time => {
            const teeTimeElement = document.createElement('div');
            teeTimeElement.classList.add('tee-time');
            teeTimeElement.innerHTML = `
                <p>Date: ${time.date}</p>
                <p>Time: ${time.time}</p>
                <p>Players: ${time.players}</p>
            `;
            teeTimesContainer.appendChild(teeTimeElement);
        });
    }

    displayTeeTimes(teeTimes); // Display all tee times initially

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchDate = document.getElementById('searchDate').value;
        const searchTime = document.getElementById('searchTime').value;
        const searchPlayers = document.getElementById('searchPlayers').value;

        const filteredTeeTimes = teeTimes.filter(time => {
            return (!searchDate || time.date === searchDate) &&
                   (!searchTime || time.time === searchTime) &&
                   (!searchPlayers || time.players === parseInt(searchPlayers, 10));
        });

        displayTeeTimes(filteredTeeTimes);
    });

    // Form Validation and CRUD operations for Tee Times Booking Form
    const bookingForm = document.getElementById('bookingForm');
    const bookingId = document.getElementById('bookingId');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const id = bookingId.value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const players = document.getElementById('players').value;

            if (date && time && players) {
                if (id) {
                    // Update existing booking
                    const index = teeTimes.findIndex(t => t.id === parseInt(id, 10));
                    if (index !== -1) {
                        teeTimes[index] = { id: parseInt(id, 10), date, time, players: parseInt(players, 10) };
                    }
                } else {
                    // Create new booking
                    teeTimes.push({ id: nextId++, date, time, players: parseInt(players, 10) });
                }
                alert('Tee time saved successfully!');
                bookingForm.reset(); // Reset the form after submission
                displayTeeTimes(teeTimes);
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
});
