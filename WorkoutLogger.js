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
    updateChart();
});

function displayWorkouts() {
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    let workoutList = document.getElementById('workoutList');
    workoutList.innerHTML = '';

    if (workouts.length === 0) {
        let noWorkouts = document.createElement('h1');
        noWorkouts.textContent = 'No workouts found.';
        noWorkouts.style.textAlign = 'center';
        noWorkouts.style.marginTop = '20px';
        workoutList.appendChild(noWorkouts);
        return;
    }

    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    thead.innerHTML = `
        <tr>
            <th>Workout Type</th>
            <th>Calories Burnt</th>
            <th>Duration (minutes)</th>
            <th>Actions</th>
        </tr>
    `;

    workouts.forEach((workout, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${workout.type}</td>
            <td>${workout.calories}</td>
            <td>${workout.duration}</td>
            <td><button class="btn2" onclick="deleteWorkout(${index})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    workoutList.appendChild(table);
    
}

function deleteWorkout(index) {
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    workouts.splice(index, 1);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    displayWorkouts();
    updateChart();
}

// Initial display of workouts
displayWorkouts();

// Initialize Chart.js
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
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
                label: "Workout Duration (minutes)",
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
                fill: true
            }
        ]
    },
    options: {
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Workouts'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Values'
                }
            }
        }
    }
});

function updateChart() {
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    let caloriesData = {
        "Arms": 0,
        "Shoulders": 0,
        "Legs": 0,
        "Chest": 0,
        "Back": 0,
        "Abs": 0,
        "Cardio": 0
    };
    let durationData = {
        "Arms": 0,
        "Shoulders": 0,
        "Legs": 0,
        "Chest": 0,
        "Back": 0,
        "Abs": 0,
        "Cardio": 0
    };

    workouts.forEach(workout => {
        if (caloriesData[workout.type] !== undefined) {
            let calories = parseFloat(workout.calories);
            let duration = parseFloat(workout.duration);
            caloriesData[workout.type] += calories;
            durationData[workout.type] += duration;
        }
    });

    myChart.data.datasets[0].data = Object.values(caloriesData);
    myChart.data.datasets[1].data = Object.values(durationData);
    myChart.update();
}

// Initial chart update
updateChart();