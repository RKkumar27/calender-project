document.addEventListener('DOMContentLoaded', function () {
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const calendarBody = document.getElementById('calendarBody');
    
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();

    function updateCalendar() {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        currentMonthYear.textContent = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        let day = 1;
        let calendarHtml = '';

        for (let i = 0; i < 6; i++) {
            let rowHtml = '<tr>';
            for (let j = 0; j < 7; j++) {
                if ((i === 0 && j < firstDayOfMonth.getDay()) || day > daysInMonth) {
                    rowHtml += '<td></td>';
                } else {
                    rowHtml += `<td>${day}</td>`;
                    day++;
                }
            }
            rowHtml += '</tr>';
            calendarHtml += rowHtml;
        }

        calendarBody.innerHTML = calendarHtml;
    }

    prevMonthBtn.addEventListener('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        updateCalendar();
    });

    updateCalendar();

    const todayBtn = document.getElementById('todayBtn');

    todayBtn.addEventListener('click', function () {
        const currentDate = new Date();
        currentYear = currentDate.getFullYear();
        currentMonth = currentDate.getMonth();
        updateCalendar();
    });

    const eventList = document.getElementById('eventList');

    function addEventToList(date, eventText) {
        const eventItem = document.createElement('li');
        eventItem.innerHTML = `
            <span class="event-date">${date}:</span> <span class="event-text">${eventText}</span>
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
        `;
        eventList.appendChild(eventItem);

        const editBtn = eventItem.querySelector('.editBtn');
        editBtn.addEventListener('click', () => {
            // Open the edit event modal and populate it with current event data
            openEditModal(date, eventText);
        });

        const deleteBtn = eventItem.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', () => {
            // Add your delete event functionality here
            eventList.removeChild(eventItem);
        });
    }

    // Example: Adding a dummy event to the list
    addEventToList('2023-09-08', 'Dummy Event 1');
    addEventToList('2023-09-15', 'Dummy Event 2');

    // Get references to modal elements
    const eventModal = document.getElementById('eventModal');
    const closeModal = document.getElementById('closeModal');
    const eventInput = document.getElementById('eventInput');
    const addEventBtn = document.getElementById('addEventBtn');

    // Function to open the modal
    function openModal() {
        eventModal.style.display = 'block';
    }

    // Function to close the modal
    function closeModalFn() {
        eventModal.style.display = 'none';
        // Reset the input field and button text
        eventInput.value = '';
        eventInput.dataset.editDate = '';
        addEventBtn.textContent = 'Add Event';
    }

    // Function to open the edit event modal and pre-fill data
    function openEditModal(date, eventText) {
        openModal();
        eventInput.value = eventText;
        eventInput.dataset.editDate = date; // Store the date as a data attribute
        addEventBtn.textContent = 'Update Event'; // Change button text to "Update Event"
    }

    // Event listener to open the modal when clicking on a td
    calendarBody.addEventListener('click', (event) => {
        if (event.target.tagName === 'TD') {
            openModal();

            // Set the date in the modal's input based on the clicked TD's date
            const selectedDate = new Date(currentYear, currentMonth, parseInt(event.target.textContent));
            eventInput.value = selectedDate.toISOString().split('T')[0]; // Set date in YYYY-MM-DD format
            addEventBtn.textContent = 'Add Event'; // Reset button text to "Add Event" for adding new events
        }
    });

    // Event listener to close the modal when clicking the close button
    closeModal.addEventListener('click', () => {
        closeModalFn();
    });

    // Event listener to close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === eventModal) {
            closeModalFn();
        }
    });

    // Event listener to add or update an event when clicking the "Add Event" or "Update Event" button
    addEventBtn.addEventListener('click', () => {
        const eventText = eventInput.value.trim();
        if (eventText !== '') {
            const selectedDate = eventInput.value;
            const editDate = eventInput.dataset.editDate; // Get the date to edit (if any)
            
            if (editDate) {
                // Update an existing event
                updateEvent(editDate, selectedDate, eventText);
            } else {
                // Add a new event
                addEventToList(selectedDate, eventText);
            }
            closeModalFn(); // Close the modal after adding or updating the event
        }
    });

    // Function to update an event by date
    function updateEvent(oldDate, newDate, eventText) {
        const eventItems = document.querySelectorAll('.event-list li');
        eventItems.forEach((item) => {
            const eventDate = item.querySelector('.event-date').textContent.split(':')[0].trim();
            if (eventDate === oldDate) {
                item.querySelector('.event-date').textContent = newDate;
                item.querySelector('.event-text').textContent = eventText;
            }
        });
    }
});
