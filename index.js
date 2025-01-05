const startTime = 60; // Initial countdown time in seconds
const timeVariation = 100; // Time variation in milliseconds for the update interval
const shortTexts = ["Bananas are berries, but strawberries aren't. Botanical classifications can surprise;",
                    "Octopuses have three hearts. Two pump blood to the gills, and one pumps it to the rest of the body.",
                    "The shortest war in history lasted just 38 to 45 minutes between Britain and Zanzibar on August 27, 1896."
                    ]; // Array of short text snippets for the game

const longTexts = ['Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible. The long shelf life is due to its low moisture content and acidic pH, creating an inhospitable environment for bacteria and microorganisms.', 
                    "In space, there's a giant diamond star named BPM 37093, located 50 light-years away from Earth. Dubbed 'Lucy' after the Beatles song 'Lucy in the Sky with Diamonds,' it's a crystallized white dwarf with a core of carbon and oxygen, estimated to be ten billion trillion trillion carats, making it the largest diamond ever discovered.",
                    "Quantum computers can perform complex calculations at unimaginable speeds due to the principles of superposition and entanglement. Unlike classical bits, which can only exist in states of 0 or 1, quantum bits (qubits) can exist in both states simultaneously, exponentially increasing computational power. This enables quantum computers to solve certain problems much faster than traditional computers."
                    ]; // Array of long text snippets for the game

var choicedTexts = longTexts; // Default choice of texts for the game
var timer = startTime; // Initialize the timer with the start time
var isGameRunning = false; // Flag to track whether the game is running
var isGamePrepered = false; // Flag to track whether the game is prepared to start
var words = 1; // Count of words typed by the player
var wpm = 0; // Words per minute (WPM) counter
var accurancy = 100; // Accuracy percentage
var points = 0; // Points earned by the player
var textMap = []; // Array to store correctness of each character typed
var interval; // Variable to store the interval ID for the countdown and update functions

// DOM elements
const targetTextElement = $("#target-text"); // Element where the target text is displayed
const textInputElement = $("#text-input"); // Element where the player inputs text

// Function to start or reset the game
function start(){
    isGamePrepered = true; // Mark the game as prepared to start
    isGameRunning = false; // Ensure the game is not running yet
    clearInterval(interval); // Clear any existing interval

    choicedTexts = choiceTexts(); // Choose text based on user selection
    targetTextElement.text(choicedTexts[Math.floor(Math.random() * choicedTexts.length)]); // Set a random text as the target
    textInputElement.val(''); // Clear the input field
    timer = startTime; // Reset the timer
    words = 1; // Reset the word count
    wpm = 0; // Reset the WPM
    textMap = []; // Clear the text map

    // Reset the position of the target text
    targetTextElement.css({
        "transform": "translateX(" + -(textMap.length) * 15 + "px)",
    });
}

// Function to update the game state
function update(){
    interval = setInterval(() => {
        countdown(); // Decrease the timer
        calcWPM(); // Calculate the WPM
        if(!isGameRunning){
            clearInterval(interval); // Stop the interval if the game is not running
        }
        calcPoints(); // Calculate the player's points
    }, timeVariation);
}

// Function to manage the countdown timer
function countdown(){
    timer -= timeVariation / 1000; // Decrease the timer based on the time variation
    $("#timer").text(timer.toFixed(1) + "s"); // Update the timer display
    if(timer <= 0){
        isGameRunning = false; // Stop the game if the timer reaches 0
    }
}

// Function to compare the input with the target text
function compare(){
    var currentIndex = textInputElement.val().length - 1; // Get the current index of the input
    var input = textInputElement.val(); // Get the current input value
    var target = targetTextElement.text(); // Get the target text

    // If the input length exceeds the text map length, add correctness to the map
    if(input.length > textMap.length){
        textMap.push(input[currentIndex] == target[currentIndex]);
    }

    // If the entire input has been compared, style the target text based on correctness
    if(textMap.length === input.length){
        var last = -1;
        var styledText = "";
        for(var current = 0; current < textMap.length; current++){
            if(textMap[current] == textMap[current + 1] && current + 1 != textMap.length) continue;

            if(textMap[current] == true){
                styledText += '<span style="color: #4fb;">' +  target.substring(last + 1, current + 1) + "</span>";
            }else{
                styledText += '<span style="color: #a77; text-decoration-line: underline;">' +  target.substring(last + 1, current + 1) + "</span>";
            }

            last = current;
        }
        
        styledText += target.substring(current); // Add the remaining unstyled part of the target text
        targetTextElement.html(styledText); // Display the styled text
        calcAcurrancy(); // Calculate the accuracy
    }

    // Stop the game if the player reaches the end of the target text
    if(target.length - 1 <= currentIndex){
        isGameRunning = false;
    }
}

// Function to calculate words per minute (WPM)
function calcWPM(){
    wpm = (words * 60) / (startTime - timer); // WPM is calculated based on the number of words and elapsed time
    $("#wpm-count").text(wpm.toFixed(2)); // Update the WPM display
}

// Function to calculate the accuracy percentage
function calcAcurrancy(){
    var correctQtd = 0;
    textMap.forEach((value) => { if(value == true) correctQtd++; }); // Count correct characters
    accurancy = (correctQtd * 100) / textMap.length; // Calculate accuracy as a percentage
    $("#accurancy-count").text(accurancy.toFixed(2)); // Update the accuracy display
}

// Function to calculate the player's points
function calcPoints(){
    points = wpm * accurancy**3; // Points are based on WPM and accuracy, with accuracy weighted heavily
    $("#points-count").text((points/1000).toFixed()); // Update the points display
}

// Function to choose the text length based on user selection
function choiceTexts(){
    switch($("#length-choices").val()){
        case "short":
            return shortTexts; // Return short texts if the user selects "short"
        default:
            return longTexts; // Default to long texts
    }
}

// Event listener for keydown events in the text input field
textInputElement.on("keydown", (value) => {
    if(isGameRunning){
        if(value.key == "Backspace") {
            if(textInputElement.val()[textMap.length - 1] == " "){
                words--; // Decrement the word count if a space is deleted
            }
            textMap.pop(); // Remove the last character's correctness from the map
            setTimeout(() => { compare(); }, 1); // Recompare after a short delay
        } else if(value.key == " "){
            words++; // Increment the word count if a space is typed
        }
        setTimeout(() => { compare(); }, 1); // Recompare after a short delay
        setTimeout(() => { compare(); }, 10); // Recompare after a longer delay

        // Adjust the position of the target text as the player types
        targetTextElement.css({
            "transform": "translateX(" + -(textMap.length) * 11 + "px)",
        });
    } else if(isGamePrepered){
        isGamePrepered = false; // Mark the game as no longer prepared, but running
        isGameRunning = true; // Start the game
        update(); // Start the update loop
    }
});
