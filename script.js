document.addEventListener("DOMContentLoaded", function () {
    // Debugging userInfo
    let userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
        try {
            userInfo = JSON.parse(userInfo);
            if (userInfo.username) {
                document.querySelector(".Welcome-header").textContent = "Welcome " + userInfo.username;
            } else {
                console.error("Username not found in userInfo");
            }
        } catch (e) {
            console.error("Error parsing userInfo from localStorage", e);
        }
    } else {
        console.error("userInfo not found in localStorage");
    }

    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "line",
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
        let durationData = {
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
                let duration = parseFloat(workout.duration);
                caloriesData[workout.type] += calories;
                durationData[workout.type] += duration;
                totalCalories += calories;
            }
        });

        console.log("Calories Data:", caloriesData); // Debug log
        console.log("Duration Data:", durationData); // Debug log
        myChart.data.datasets[0].data = Object.values(caloriesData);
        myChart.data.datasets[1].data = Object.values(durationData);
        myChart.update();

        document.getElementById("totalCaloriesBurnt").value = totalCalories;
    }

    updateChart();

    let workoutForm = document.getElementById("WorkoutLoggingForm");

    workoutForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let workout = document.getElementById("SelectWorkout").value;
        let caloriesBurned = document.getElementById("caloriesBurnt").value;
        let duration = document.getElementById("duration").value; // Corrected ID
        saveWorkout(workout, caloriesBurned, duration);
        updateChart();
        console.log("Form submitted");
    });

    function saveWorkout(type, calories, duration) {
        let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

        let newWorkout = {
            type: type,
            calories: calories,
            duration: duration,
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