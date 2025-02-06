let userInfo = JSON.parse(localStorage.getItem('userInfo'));
let name = userInfo.username;
document.querySelector('.Welcome-header').textContent = `Welcome ${name}`;
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
    updateTotalCalories();
    updateTotalDuration()
});

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
    const now = new Date(); // gonna give me today's date in ist
    const dateValue = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toISOString().split('T')[0];;
    console.log(dateValue);
    
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
    // displayWorkouts();
    updateChart();
    updateTotalCalories();
    updateTotalDuration()
    // this.reset();
});

function getFilteredWorkouts() {
    const filter = 'today';
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

// function displayWorkouts() {
//     const workouts = getFilteredWorkouts().reverse();
//     const workoutList = document.getElementById('workoutList');
//     workoutList.innerHTML = '';

//     if (workouts.length === 0) {
//         workoutList.innerHTML = '<h2 style="text-align:center; margin-top:20px;">No workouts found</h2>';
//         return;
//     }

//     const table = document.createElement('table');
//     table.innerHTML = `
//         <thead>
//             <tr>
//                 <th>Type</th>
//                 <th>Calories</th>
//                 <th>Duration</th>
//                 <th>Date</th>
//                 <th>Actions</th>
//             </tr>
//         </thead>
//         <tbody class="workout-table-body">
//             ${workouts.map(workout => `
//                 <tr>
//                     <td>${workout.type}</td>
//                     <td>${workout.calories}</td>
//                     <td>${workout.duration}</td>
//                     <td>${new Date(workout.date).toLocaleDateString()}</td>
//                     <td><button class="btn2" onclick="deleteWorkout(${workout.id})">Delete</button></td>
//                 </tr>
//             `).join('')}
//         </tbody>
//     `;
//     workoutList.appendChild(table);
// }

// function deleteWorkout(id) {
//     let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
//     workouts = workouts.filter(workout => workout.id !== id);
//     localStorage.setItem('workouts', JSON.stringify(workouts));
//     displayWorkouts();
//     updateChart();
// }

// Chart initialization
// Replace Chart.js initialization with ApexCharts
let chart;

function initializeChart() {
    const options = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: false }
        },
        series: [
            {
                name: "Calories Burned",
                data: []
            },
            {
                name: "Duration (minutes)",
                data: []
            }
        ],
        xaxis: {
            categories: ["Arms", "Shoulders", "Legs", "Chest", "Back", "Abs", "Cardio"]
        },
        yaxis: {
            title: {
                text: 'Calories (kcal) & Duration (min)'
            },
            min: 0
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        stroke: {
            width: 2
        },
        fill: {
            opacity: 0.2
        },
        colors: ['#FF4560', '#008FFB']
    };

    chart = new ApexCharts(document.querySelector("#myChart"), options);
    chart.render();
}

// Remove the old updateChart function and replace with:
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

    chart.updateOptions({
        series: [
            { name: "Calories Burned", data: calorieData },
            { name: "Duration (minutes)", data: durationData }
        ],
        xaxis: {
            categories: categories
        }
    });
}
initializeChart();
// Event listeners
// document.getElementById('filter').addEventListener('change', () => {
//     // displayWorkouts();
//     updateChart();
// });

// Initial display
// displayWorkouts();
updateChart();

const API_KEY = 'AIzaSyDcTKPG-1ZEA6eG98aCM9KorvCrIyBXVis';
const chatHistory = [];

function openModal() {
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;

    addMessageToChat('user', message);
    chatHistory.push({ role: 'user', parts: [{ text: "Keep your messages breif, you are a fitness advisor chat bot and you will respond to the following message : "+message }] });

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: chatHistory,
                generationConfig: {
                    temperature: 0.7, 
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 1000  // Reduced to generate shorter responses
                }
            })
        });

        const data = await response.json();
        let botResponse = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a response.";

        botResponse = formatResponse(botResponse);
        addMessageToChat('bot', botResponse);
        chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });

    } catch (error) {
        console.error('Error:', error);
        addMessageToChat('bot', "Sorry, I'm having trouble responding.");
    }
    
    userInput.value = '';
}

function formatResponse(text) {
    return text
        .replace(/\*/g, "")  // Replace asterisks with bullet points
        .replace(/(\n|\r)/g, "<br>") // Ensure proper line breaks
        .trim();
}

function addMessageToChat(sender, text) {
    const chatDiv = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = text;  // Use innerHTML to preserve formatting
    chatDiv.appendChild(messageDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}


function updateTotalCalories() { //To update Calories
    const workouts = getFilteredWorkouts();
    const total = workouts.reduce((sum, workout) => sum + Number(workout.calories), 0);
    document.getElementById('totalCalories').textContent = total+" kcal";
}

function updateTotalDuration() { //To update Calories
    const workouts = getFilteredWorkouts();
    const total = workouts.reduce((sum, workout) => sum + Number(workout.duration), 0);
    document.getElementById('totalDuration').textContent = total + " min";
}