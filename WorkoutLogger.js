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
    workoutList = document.querySelector('#workoutList');
if(workoutList.innerHTML === '') {
    let noWorkouts = document.createElement('h1');
    noWorkouts.textContent = 'No workouts found.';
    noWorkouts.style.textAlign = 'center';
    noWorkouts.style.marginTop = '20px';
    workoutList.appendChild(noWorkouts);
}
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


let workoutList = document.querySelector('#workoutList');
if(workoutList.innerHTML === '') {
    let noWorkouts = document.createElement('h1');
    noWorkouts.textContent = 'No workouts found.';
    noWorkouts.style.textAlign = 'center';
    noWorkouts.style.marginTop = '20px';
    workoutList.appendChild(noWorkouts);
}