// Mindfulness chatbot using Gemini API

document.addEventListener('DOMContentLoaded', function () {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    const exerciseModal = document.getElementById('exercise-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const completeExerciseBtn = document.getElementById('complete-exercise');

    const GEMINI_API_KEY = 'AIzaSyD1FhU0T7dAKx4vD4QTe8nsrlcK90OwMC4'; // Add your Gemini API key here
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const exercises = {
        'breathing': {
            title: "Box Breathing Exercise",
            steps: [
                "Find a comfortable seated position and relax your shoulders.",
                "Inhale deeply through your nose for 4 seconds.",
                "Hold your breath for 4 seconds.",
                "Exhale slowly through your mouth for 4 seconds.",
                "Wait for 4 seconds before taking your next breath.",
                "Repeat this cycle 4-5 times."
            ],
            tips: "This technique is great for instant stress relief. Try to focus solely on your breath during the exercise."
        },
        'meditation': {
            title: "5-Minute Mindfulness Meditation",
            steps: [
                "Sit comfortably with your back straight but not stiff.",
                "Close your eyes and take a few deep breaths.",
                "Bring your attention to your breath without changing it.",
                "When your mind wanders (it will!), gently bring focus back to your breath.",
                "Start with just 5 minutes and gradually increase."
            ],
            tips: "Don't judge yourself for wandering thoughts - it's completely normal. The practice is in returning your focus."
        },
        'body_scan': {
            title: "Progressive Muscle Relaxation",
            steps: [
                "Lie down or sit comfortably.",
                "Start with your toes - tense them for 5 seconds, then release.",
                "Move to your calves - tense, then release.",
                "Continue upward through each muscle group: thighs, glutes, abdomen, hands, arms, shoulders, neck, and face.",
                "Finish by taking 3 deep breaths and noticing how relaxed your body feels."
            ],
            tips: "This is especially helpful before bedtime or when you're feeling physically tense."
        }
    };

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex mb-4 animate-fade-in ${isUser ? 'justify-end' : ''}`;

        if (!isUser) {
            messageDiv.innerHTML = `
                <div class="flex-shrink-0 mr-3">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <i class="fas fa-spa"></i>
                    </div>
                </div>
                <div class="bg-gray-100 rounded-xl rounded-tl-none px-4 py-2 max-w-xs">
                    <p class="text-gray-800">${text}</p>
                    <p class="text-xs text-gray-500 mt-1 text-right">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="bg-purple-100 rounded-xl rounded-tr-none px-4 py-2 max-w-xs">
                    <p class="text-gray-800">${text}</p>
                    <p class="text-xs text-gray-500 mt-1 text-right">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            `;
        }

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'flex mb-4';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="flex-shrink-0 mr-3">
                <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <i class="fas fa-spa"></i>
                </div>
            </div>
            <div class="bg-gray-100 rounded-xl rounded-tl-none px-4 py-2 max-w-xs">
                <p class="text-gray-800 typing-indicator"></p>
            </div>
        `;
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    async function getGeminiResponse(input) {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: input }] }]
                })
            });
            const data = await response.json();
            return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond to that.";
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "Oops! There was a problem connecting. Try again later.";
        }
    }

    async function processUserInput(input) {
        addMessage(input, true);
        userInput.value = '';
        showTypingIndicator();

        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('breath') || lowerInput.includes('breathe')) {
            setTimeout(() => {
                hideTypingIndicator();
                showExercise('breathing');
            }, 1000);
        } else if (lowerInput.includes('meditat') || lowerInput.includes('calm')) {
            setTimeout(() => {
                hideTypingIndicator();
                showExercise('meditation');
            }, 1000);
        } else if (lowerInput.includes('relax') || lowerInput.includes('body') || lowerInput.includes('muscle')) {
            setTimeout(() => {
                hideTypingIndicator();
                showExercise('body_scan');
            }, 1000);
        } else if (lowerInput.includes('stress') || lowerInput.includes('anxious') || lowerInput.includes('overwhelm')) {
            setTimeout(() => {
                hideTypingIndicator();
                addMessage("I'm sorry to hear you're feeling stressed. Would you like to try a breathing exercise, a short meditation, or a body relaxation technique?");
            }, 1500);
        } else {
            const botResponse = await getGeminiResponse(input);
            hideTypingIndicator();
            addMessage(botResponse);
        }
    }

    function showExercise(exerciseKey) {
        const exercise = exercises[exerciseKey];
        if (!exercise) return;

        document.getElementById('exercise-title').textContent = exercise.title;
        const contentDiv = document.getElementById('exercise-content');
        contentDiv.innerHTML = '';

        const stepsDiv = document.createElement('div');
        stepsDiv.innerHTML = `
            <h4 class="font-semibold text-gray-800 mb-2">Steps:</h4>
            <ol class="list-decimal list-inside space-y-2 text-gray-700">
                ${exercise.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        `;
        contentDiv.appendChild(stepsDiv);

        const tipsDiv = document.createElement('div');
        tipsDiv.innerHTML = `
            <h4 class="font-semibold text-gray-800 mb-2">Tips:</h4>
            <p class="text-gray-700">${exercise.tips}</p>
        `;
        contentDiv.appendChild(tipsDiv);

        exerciseModal.classList.remove('hidden');
    }

    sendBtn.addEventListener('click', () => {
        const input = userInput.value.trim();
        if (input) {
            processUserInput(input);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = userInput.value.trim();
            if (input) {
                processUserInput(input);
            }
        }
    });

    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.getAttribute('data-msg');
            processUserInput(msg);
        });
    });

    closeModalBtn.addEventListener('click', () => {
        exerciseModal.classList.add('hidden');
    });

    completeExerciseBtn.addEventListener('click', () => {
        exerciseModal.classList.add('hidden');
        setTimeout(() => {
            addMessage("Great job completing the exercise! How do you feel now? Regular practice really helps.");
        }, 500);
    });

    exerciseModal.addEventListener('click', (e) => {
        if (e.target === exerciseModal) {
            exerciseModal.classList.add('hidden');
        }
    });

    setTimeout(() => {
        addMessage("I'm here to help you cultivate mindfulness and find calm in your daily life. 😊");
    }, 1500);
});

