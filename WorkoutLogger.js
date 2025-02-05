document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('date').value = `${yyyy}-${mm}-${dd}`;
});

document.getElementById('workoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const type = document.getElementById('type').value;
    const calories = document.getElementById('calories').value;
    const duration = document.getElementById('duration').value;
    const dateValue = document.getElementById('date').value;
    
    // Create date in local timezone
    const [year, month, day] = dateValue.split('-');
    const workoutDate = new Date(year, month - 1, day);
    workoutDate.setHours(0, 0, 0, 0);
    
    // Create workout object
    const workout = { 
        id: Date.now(),
        type, 
        calories, 
        duration, 
        date: workoutDate.toISOString() 
    };
    
    // Save to localStorage
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    
    // Update UI
    displayWorkouts();
    updateChart();
    // this.reset();
});

function getFilteredWorkouts() {
    const filter = document.getElementById('filter').value;
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    
    if (filter === 'all') return workouts;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 6);
    
    return workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        const workoutDay = new Date(workoutDate.getFullYear(), workoutDate.getMonth(), workoutDate.getDate());
        
        if (filter === 'today') {
            return workoutDay.getTime() === today.getTime();
        }
        if (filter === 'week') {
            return workoutDay >= oneWeekAgo;
        }
        return true;
    });
}

function displayWorkouts() {
    const workouts = getFilteredWorkouts().reverse();
    const workoutList = document.getElementById('workoutList');
    workoutList.innerHTML = '';

    if (workouts.length === 0) {
        workoutList.innerHTML = '<h2 style="text-align:center; margin-top:20px;">No workouts found</h2>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Type</th>
                <th>Calories</th>
                <th>Duration</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody class="workout-table-body">
            ${workouts.map(workout => `
                <tr>
                    <td>${workout.type}</td>
                    <td>${workout.calories}</td>
                    <td>${workout.duration}</td>
                    <td>${new Date(workout.date).toLocaleDateString()}</td>
                    <td><button class="btn2" onclick="deleteWorkout(${workout.id})">Delete</button></td>
                </tr>
            `).join('')}
        </tbody>
    `;
    workoutList.appendChild(table);
}

function deleteWorkout(id) {
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    workouts = workouts.filter(workout => workout.id !== id);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    displayWorkouts();
    updateChart();
}

// Chart initialization
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Arms", "Shoulders", "Legs", "Chest", "Back", "Abs", "Cardio"],
        datasets: [
            {
                label: "Calories Burned",
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                fill: true
            },
            {
                label: "Duration (minutes)",
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true }
        },
        scales: {
            x: { title: { display: true, text: 'Workout Type' } },
            y: { beginAtZero: true, title: { display: true, text: 'Value' } }
        }
    }
});

function updateChart() {
    const workouts = getFilteredWorkouts();
    const categories = ["Arms", "Shoulders", "Legs", "Chest", "Back", "Abs", "Cardio"];
    
    const calorieData = categories.map(cat => 
        workouts.filter(w => w.type === cat)
                .reduce((sum, w) => sum + Number(w.calories), 0)
    );
    
    const durationData = categories.map(cat => 
        workouts.filter(w => w.type === cat)
                .reduce((sum, w) => sum + Number(w.duration), 0)
    );
    
    myChart.data.datasets[0].data = calorieData;
    myChart.data.datasets[1].data = durationData;
    myChart.update();
}

// Event listeners
document.getElementById('filter').addEventListener('change', () => {
    displayWorkouts();
    updateChart();
});

// Initial display
displayWorkouts();
updateChart();