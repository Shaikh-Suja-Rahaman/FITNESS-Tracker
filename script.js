document.querySelector(".Welcome-header").textContent = "Welcome " + JSON.parse(localStorage.getItem("userInfo")).username + "! ";

document.addEventListener("DOMContentLoaded", function () {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Arms", "Shoulders", "Legs", "Chest", "Back", "Abs", "Cardio"],
            datasets: [{
                label: "Calories Burned",
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
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
                        text: 'Calories Burnt'
                    }
                }
            }
        }
    });

    function updateChart() {
        let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
        let caloriesData = {
            "Arms": 0,
            "Shoulders": 0,
            "Legs": 0,
            "Chest": 0,
            "Back": 0,
            "Abs": 0,
            "Cardio": 0
        };

        let totalCalories = 0;

        workouts.forEach(workout => {
            if (caloriesData[workout.type] !== undefined) {
                let calories = parseFloat(workout.calories);
                caloriesData[workout.type] += calories;
                totalCalories += calories;
            }
        });

        console.log("Calories Data:", caloriesData); // Debug log
        myChart.data.datasets[0].data = Object.values(caloriesData);
        myChart.update();

        document.getElementById("totalCaloriesBurnt").value = totalCalories;
    }

    updateChart();

    let workoutForm = document.getElementById("WorkoutLoggingForm");

    workoutForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let workout = document.getElementById("SelectWorkout").value;
        let caloriesBurned = document.getElementById("caloriesBurnt").value;
        saveWorkout(workout, caloriesBurned);
        updateChart();
        console.log("Form submitted");
    });

    function saveWorkout(type, calories) {
        let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

        let newWorkout = {
            type: type,
            calories: calories,
            date: new Date().toISOString().split('T')[0]
        };

        workouts.push(newWorkout);
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }

    function getWorkouts() {
        let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
        return workouts;
    }

    console.log(getWorkouts());
});