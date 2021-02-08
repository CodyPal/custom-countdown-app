// Selecting html elements
const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');
const todaysDate = document.getElementById('todays-date');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

// global variables
let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min with todays date
const today = new Date().toISOString().split('T')[0];

// make it so you cant pick a date that already happened
dateEl.setAttribute('min', today);

// Show todays date
const d = new Date();
const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
todaysDate.textContent = `${da}-${mo}-${ye}`;

// Update DOM function
function updateDOM(){
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) /  hour);
    const minutes = Math.floor((distance % hour) /  minute);
    const seconds = Math.floor((distance % minute) /  second);

     // Hide input
     inputContainer.hidden = true;

    //  if the countdown has ended, show complete
    if(distance < 0){
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    }else{
      // else, show the countdown in progress. 
      // populating countdown
    countdownElTitle.textContent = `${countdownTitle}`;
    timeElements[0].textContent = `${days}`;
    timeElements[1].textContent = `${hours}`;
    timeElements[2].textContent = `${minutes}`;
    timeElements[3].textContent = `${seconds}`;
    completeEl.hidden = true;
    countdownEl.hidden = false;
    }
  }, second);
}

// take values from form input
function updateCoundown(e){
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
      title: countdownTitle,
      date: countdownDate,
    };
    // save 'savedCountdown' to local storage
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
 
    // Get number version of current date, update dom
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
}

// reset countdown
function reset(){
    // Hide countdowns and show inputs
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // stop countdown
    clearInterval(countdownActive);
    // reset the values for our countdown title
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown(){
  // get coundown from local storage if available
  if(localStorage.getItem('countdown')){
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event Listener
countdownForm.addEventListener('submit', updateCoundown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load, check local storage
restorePreviousCountdown();