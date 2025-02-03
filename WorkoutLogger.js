document.getElementById('workoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let type = document.getElementById('type').value;
    let calories = document.getElementById('calories').value;
    let duration = document.getElementById('duration').value;
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    let workout = { type, calories, duration, date: new Date().toISOString() };
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    displayWorkouts();
});

function displayWorkouts() {
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    let workoutList = document.getElementById('workoutList');
    workoutList.innerHTML = '';
    workouts.forEach((workout, index) => {
        let workoutEntry = document.createElement('div');
        workoutEntry.className = 'workout-entry';
        workoutEntry.innerHTML = `
            <div>
                <strong>${workout.type}</strong> - ${workout.calories} calories - ${workout.duration} minutes
            </div>
            <button class="btn2" onclick="deleteWorkout(${index})">Delete</button>
        `;
        workoutList.appendChild(workoutEntry);
    });
}

function deleteWorkout(index) {
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    workouts.splice(index, 1);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    displayWorkouts();
}

// Initial display of workouts
displayWorkouts();