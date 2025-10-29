document.addEventListener('DOMContentLoaded', () => {

    // ####################################
    // Element Selections
    // ####################################
    const sections = {
        main: document.getElementById('main-menu'),
        roast: document.getElementById('calculator-section'),
        cafe: document.getElementById('cafe-section'),
        bakwash: document.getElementById('bakwash-section'),
        stopwatch: document.getElementById('stopwatch-section'),
        mix: document.getElementById('mix-section'),
        priceList: document.getElementById('price-list-section')
    };

    const cards = {
        roast: document.getElementById('roast-card'),
        cafe: document.getElementById('cafe-card'),
        bakwash: document.getElementById('bakwash-card'),
        mix: document.getElementById('mix-card'),
        stopwatch: document.getElementById('stopwatch-card'),
        priceList: document.getElementById('price-list-card')
    };

    const buttons = {
        calculateRoast: document.getElementById('calculate-roast-btn'),
        calculateCafe: document.getElementById('calculate-cafe-btn'),
        back: document.querySelectorAll('.back-button')
    };

    const themeToggler = document.getElementById('theme-toggler');
    const clockElement = document.getElementById('live-clock');

    // ####################################
    // Clock Logic
    // ####################################
    /**
     * Updates the live clock element with the current time and date in Persian format.
     * It fetches the current time, formats it into a detailed string (including year, month, day, hour, minute, and second),
     * and updates the text content of the clock element. This function is called every second to ensure the clock is live.
     * @returns {void} This function does not return a value.
     */
    function updateClock() {
        if (!clockElement) return;
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        clockElement.textContent = new Intl.DateTimeFormat('fa-IR', options).format(now);
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ####################################
    // Theme Switcher Logic
    // ####################################
    /**
     * Retrieves the stored theme from local storage.
     * This function checks for a 'theme' key in the browser's local storage and returns its value.
     * This allows the user's theme preference to persist across sessions.
     * @returns {string|null} The stored theme ('light' or 'dark'), or null if no theme is set.
     */
    const getStoredTheme = () => localStorage.getItem('theme');
    /**
     * Stores the selected theme in local storage.
     * This function takes a theme as a string and saves it under the 'theme' key in the browser's local storage.
     * @param {string} theme - The theme to store, typically 'light' or 'dark'.
     * @returns {void} This function does not return a value.
     */
    const setStoredTheme = theme => localStorage.setItem('theme', theme);

    /**
     * Determines the preferred theme by checking local storage first, then system settings.
     * If a theme is stored in local storage, it is used. Otherwise, it checks the user's
     * operating system's preferred color scheme.
     * @returns {string} The preferred theme, either 'dark' or 'light'.
     */
    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) return storedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    /**
     * Applies the selected theme to the document and updates the theme toggler icon.
     * It sets the `data-theme` attribute on the `<html>` element, which triggers CSS changes.
     * It also updates the SVG icon in the theme toggler button to reflect the current theme (sun for dark, moon for light).
     * @param {string} theme - The theme to apply, either 'dark' or 'light'.
     * @returns {void} This function does not return a value.
     */
    const setTheme = theme => {
        const isDark = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        const sunIcon = "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707-.707M6.343 17.657l-.707-.707m12.728 0l-.707.707M6.343 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z";
        const moonIcon = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
        if (themeToggler) themeToggler.querySelector('path').setAttribute('d', isDark ? sunIcon : moonIcon);
    };

    setTheme(getPreferredTheme());

    if (themeToggler) {
        themeToggler.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setStoredTheme(newTheme);
            setTheme(newTheme);
        });
    }

    // ####################################
    // Navigation Logic
    // ####################################
    /**
     * Displays a specific section of the application while hiding all others.
     * This function iterates through all main sections, sets their display to 'none',
     * and then sets the display of the target section to 'block', creating a single-page navigation effect.
     * @param {string} sectionId - The ID of the HTML element for the section to be displayed.
     * @returns {void} This function does not return a value.
     */
    function showSection(sectionId) {
        Object.values(sections).forEach(section => {
            if(section) section.style.display = 'none';
        });
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) sectionToShow.style.display = 'block';
    }

    if (cards.roast) cards.roast.addEventListener('click', () => showSection('calculator-section'));
    if (cards.cafe) cards.cafe.addEventListener('click', () => showSection('cafe-section'));
    if (cards.stopwatch) cards.stopwatch.addEventListener('click', () => showSection('stopwatch-section'));
    if (cards.mix) cards.mix.addEventListener('click', () => showSection('mix-section'));
    if (cards.bakwash) cards.bakwash.addEventListener('click', () => showSection('bakwash-section'));
    if (cards.priceList) cards.priceList.addEventListener('click', () => showSection('price-list-section'));

    buttons.back.forEach(button => {
        button.addEventListener('click', () => showSection('main-menu'));
    });

    // ####################################
    // Helper Functions
    // ####################################
    /**
     * Formats a number into a Persian currency string.
     * It uses the `toLocaleString` method to format the number with 'fa-IR' locale settings,
     * which includes grouping separators and Persian numerals. It also handles invalid number inputs.
     * @param {number} number - The number to be formatted.
     * @returns {string} The formatted currency string, or '0' if the input is not a valid number.
     */
    function formatCurrency(number) {
        if (isNaN(number)) return '0';
        return number.toLocaleString('fa-IR', { maximumFractionDigits: 0 });
    }

    /**
     * Retrieves and parses the numeric value from an input field.
     * It gets the element by its ID, parses its value as a float, and returns it.
     * If the element doesn't exist or the value is not a valid number, it returns a default value.
     * @param {string} elementId - The ID of the input element.
     * @param {*} [defaultValue=0] - The value to return if the input is not a valid number.
     * @returns {number} The numeric value of the input field.
     */
    function getInputValue(elementId, defaultValue = 0) {
        const input = document.getElementById(elementId);
        if (!input) return defaultValue;
        const value = parseFloat(input.value);
        return isNaN(value) ? defaultValue : value;
    }
    // #####################################################
// 🔹 منطق بخش کرنومتر بک‌واش (bakwash-section)
// #####################################################

if (sections.bakwash) {

    const backwashDisplay = document.getElementById('backwash-display');
    const backwashStatus = document.getElementById('backwash-status');
    const backwashBeep = document.getElementById('backwash-beep');

    const start10Btn = document.getElementById('backwash-start10');
    const start5Btn = document.getElementById('backwash-start5');
    const resetBtn = document.getElementById('backwash-reset');

    let backwashTimer = null;

    /**
     * Formats a given number of seconds into a "mm:ss" time string.
     * This function is used for display purposes in timers and stopwatches.
     * It ensures both minutes and seconds are two digits by padding with a leading zero if necessary.
     * @param {number} sec - The total number of seconds to format.
     * @returns {string} The formatted time string in "mm:ss" format.
     */
    function formatTime(sec) {
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${m}:${s}`;
    }

    /**
     * Plays a short beep sound for the backwash timer.
     * It resets the audio to the beginning and plays it. This function is used to provide an audible cue
     * at the start and end of backwash cycles. It includes error handling in case the audio playback fails.
     * @returns {void} This function does not return a value.
     */
    function playBackwashBeep() {
        backwashBeep.currentTime = 0;
        backwashBeep.play().catch(() => {});
    }

    /**
     * Runs a complete backwash cycle with specified "on" and "off" phases.
     * This function manages the timer for a backwash sequence, alternating between a running phase and a resting phase
     * for a set number of rounds. It updates the display and status message throughout the cycle.
     * @param {number} onTime - The duration in seconds for the "on" phase of each round.
     * @param {number} offTime - The duration in seconds for the "off" phase of each round.
     * @param {number} totalRounds - The total number of rounds in the cycle.
     * @param {string} label - A descriptive label for the cycle being run (e.g., "10-second cycle").
     * @returns {void} This function does not return a value.
     */
    function runBackwashCycle(onTime, offTime, totalRounds, label) {
        clearInterval(backwashTimer);
        let round = 0;

        backwashStatus.innerText = `شروع ${label}...`;

        function nextRound() {
            if (round >= totalRounds) {
                backwashStatus.innerText = `✅ ${label} تمام شد.`;
                backwashDisplay.innerText = "00:00";
                return;
            }

            // 🔥 مرحله روشن
            playBackwashBeep();
            let sec = onTime;
            backwashStatus.innerText = `🔥 ${label} - دوره ${round + 1} (روشن)`;
            backwashDisplay.innerText = formatTime(sec);

            backwashTimer = setInterval(() => {
                sec--;
                backwashDisplay.innerText = formatTime(sec);
                if (sec <= 0) {
                    clearInterval(backwashTimer);

                    // 💧 مرحله خاموش
                    playBackwashBeep();
                    let rest = offTime;
                    backwashStatus.innerText = `💧 ${label} - دوره ${round + 1} (خاموش)`;
                    backwashDisplay.innerText = formatTime(rest);

                    backwashTimer = setInterval(() => {
                        rest--;
                        backwashDisplay.innerText = formatTime(rest);
                        if (rest <= 0) {
                            clearInterval(backwashTimer);
                            round++;
                            nextRound();
                        }
                    }, 1000);
                }
            }, 1000);
        }

        nextRound();
    }

    // 🎯 دکمه‌ها
    if (start10Btn) start10Btn.addEventListener('click', () => {
        runBackwashCycle(10, 10, 5, 'مرحله ۱۰ ثانیه‌ای');
    });

    if (start5Btn) start5Btn.addEventListener('click', () => {
        runBackwashCycle(5, 5, 10, 'مرحله ۵ ثانیه‌ای');
    });

    if (resetBtn) resetBtn.addEventListener('click', () => {
        clearInterval(backwashTimer);
        backwashStatus.innerText = 'وضعیت: آماده';
        backwashDisplay.innerText = '00:00';
        backwashBeep.pause();
        backwashBeep.currentTime = 0;
    });
}


    // ####################################
    // Roast Calculator Logic
    // ####################################
    /**
     * Calculates and displays roast analysis results based on user inputs.
     * This function retrieves data on green bean price, roast wage, batch input/output, and total green coffee.
     * It calculates key metrics like weight loss percentage, cost of roasted coffee, and total profit,
     * and then displays these results in the UI. It also handles input validation.
     * @returns {void} This function does not return a value.
     */
    function calculateRoast() {
        const batchInputElement = document.getElementById('batchInput');
        const batchOutputElement = document.getElementById('batchOutput');
        const resultsDiv = document.getElementById('results');
        const generateBtn = document.getElementById('generate-roast-image-btn');

        batchInputElement.classList.remove('invalid-input');
        batchOutputElement.classList.remove('invalid-input');

        const batchInput = getInputValue('batchInput', NaN);
        const batchOutput = getInputValue('batchOutput', NaN);
        let isValid = true;
        if (isNaN(batchInput) || batchInput <= 0) { isValid = false; batchInputElement.classList.add('invalid-input'); }
        if (isNaN(batchOutput) || batchOutput < 0 || batchOutput > batchInput) { isValid = false; batchOutputElement.classList.add('invalid-input'); }

        if (!isValid) {
            resultsDiv.innerHTML = '<p style="color: red;">!لطفاً فیلدهای مشخص‌شده را با مقادیر معتبر پر کنید</p>';
            generateBtn.style.display = 'none';
            return;
        }

        const greenPrice = getInputValue('greenPrice');
        const roastWage = getInputValue('roastWage');
        const totalGreen = getInputValue('totalGreen');

        // Corrected logic based on user feedback
        const totalRawGreenCost = greenPrice * totalGreen;
        const totalProductionCost = totalRawGreenCost + (roastWage * totalGreen);

        const weightLossPercent = ((batchInput - batchOutput) / batchInput) * 100;
        const totalRoastedOutput = totalGreen * (1 - (weightLossPercent / 100));

        let costOfRoastedCoffee = 0;
        if (totalRoastedOutput > 0) {
            costOfRoastedCoffee = totalProductionCost / totalRoastedOutput;
        }

        const totalRoastedValue = totalProductionCost; // The "value" is the total cost of production

        // Per user request, "profit" is the difference between total value and raw green cost
        const profit = totalRoastedValue - totalRawGreenCost;


        resultsDiv.innerHTML = `
            <p><strong>درصد افت وزن:</strong> ${weightLossPercent.toFixed(2)} %</p>
            <p><strong>قیمت تمام شده رُست شده:</strong> ${formatCurrency(costOfRoastedCoffee)} تومان/کیلوگرم</p>
            <p><strong>مقدار قهوه خروجی در بچ:</strong> ${batchOutput.toFixed(2)} گرم</p>
            <p><strong>کل قهوه رُست شده امروز:</strong> ${totalRoastedOutput.toFixed(2)} کیلوگرم</p>
            <hr>
            <p><strong>قیمت کل دانه سبز:</strong> ${formatCurrency(totalRawGreenCost)} تومان</p>
            <p><strong>ارزش کل قهوه رُست شده:</strong> ${formatCurrency(totalRoastedValue)} تومان</p>
            <p style="color: var(--primary-color);"><strong>سود نهایی: ${formatCurrency(profit)} تومان</strong></p>
        `;
        generateBtn.style.display = 'block';
    }
    if (buttons.calculateRoast) buttons.calculateRoast.addEventListener('click', calculateRoast);

    const generateRoastImageBtn = document.getElementById('generate-roast-image-btn');
    if (generateRoastImageBtn) {
        generateRoastImageBtn.addEventListener('click', () => {
            const template = document.getElementById('roast-image-output-template');
            document.getElementById('roast-report-date').textContent = new Date().toLocaleDateString('fa-IR');

            const inputs = {
                "قیمت دانه سبز": formatCurrency(getInputValue('greenPrice')) + ' تومان/کیلوگرم',
                "اجرت رُست": formatCurrency(getInputValue('roastWage')) + ' تومان/کیلوگرم',
                "مقدار دانه سبز ورودی": getInputValue('batchInput') + ' گرم',
                "مقدار دانه خروجی": getInputValue('batchOutput') + ' گرم',
                "کل دانه سبز روز": getInputValue('totalGreen') + ' کیلوگرم',
            };

            const inputsSummary = document.getElementById('roast-inputs-summary');
            inputsSummary.innerHTML = '';
            for (const [key, value] of Object.entries(inputs)) {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${key}:</strong> ${value}`;
                inputsSummary.appendChild(p);
            }

            const resultsText = document.getElementById('results').innerHTML;
            document.getElementById('roast-outputs-summary').innerHTML = resultsText;

            template.style.display = 'block';
            html2canvas(template, { scale: 2 }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'roast-report.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                template.style.display = 'none';
            });
        });
    }
    // ####################################
    // Cafe Revenue Logic
    // ####################################
    /**
     * Calculates and displays the cafe's daily and monthly revenue and profit.
     * This function gathers inputs related to coffee costs, sales prices, consumption per shot,
     * and daily sales volume. It then computes total revenue, costs, and profit for both a single day
     * and a 30-day month, updating the UI with the detailed financial summary.
     * @returns {void} This function does not return a value.
     */
    function calculateCafeRevenue() {
        const costPerKGElement = document.getElementById('costPerKG');
        const costSingleShotElement = document.getElementById('costSingleShot');
        const resultsDiv = document.getElementById('cafe-results');

        costPerKGElement.classList.remove('invalid-input');
        costSingleShotElement.classList.remove('invalid-input');

        const costPerKG = getInputValue('costPerKG', NaN);
        const costSingleShot = getInputValue('costSingleShot', NaN);

        let isValid = true;
        if (isNaN(costPerKG) || costPerKG <= 0) { isValid = false; costPerKGElement.classList.add('invalid-input'); }
        if (isNaN(costSingleShot) || costSingleShot <= 0) { isValid = false; costSingleShotElement.classList.add('invalid-input'); }

        if (!isValid) {
            resultsDiv.innerHTML = '<p style="color: red;">!لطفاً فیلدهای مشخص‌شده را با مقادیر معتبر پر کنید</p>';
            return;
        }

        const sellPriceKG = getInputValue('sellPriceKG'), costDoubleShot = getInputValue('costDoubleShot'), gramSingle = getInputValue('gramSingle'), gramDouble = getInputValue('gramDouble'), otherCostPerShot = getInputValue('otherCostPerShot'), salesSingle = getInputValue('salesSingle'), salesDouble = getInputValue('salesDouble'), salesMixKG = getInputValue('salesMixKG');
        const revenueSingle = salesSingle * costSingleShot, revenueDouble = salesDouble * costDoubleShot, revenueMix = salesMixKG * sellPriceKG, totalDailyRevenue = revenueSingle + revenueDouble + revenueMix;
        const totalGramUsed = (salesSingle * gramSingle) + (salesDouble * gramDouble) + (salesMixKG * 1000), totalKGUsed = totalGramUsed / 1000, costOfCoffeeUsed = totalKGUsed * costPerKG;
        const totalSalesShots = salesSingle + salesDouble, totalOtherCost = totalSalesShots * otherCostPerShot, totalDailyCost = costOfCoffeeUsed + totalOtherCost, totalDailyProfit = totalDailyRevenue - totalDailyCost;
        const daysInMonth = 30, totalMonthlyRevenue = totalDailyRevenue * daysInMonth, totalMonthlyProfit = totalDailyProfit * daysInMonth, totalMonthlyKGUsed = totalKGUsed * daysInMonth;

        resultsDiv.innerHTML = `<h3>خلاصه روزانه</h3><p><strong>کل درآمد فروش روزانه:</strong> ${formatCurrency(totalDailyRevenue)} تومان</p><p><strong>کل هزینه (مواد + جانبی):</strong> ${formatCurrency(totalDailyCost)} تومان</p><p><strong>سود خالص روزانه:</strong> <span style="color: var(--primary-color); font-weight: bold;">${formatCurrency(totalDailyProfit)} تومان</span></p><p><strong>مقدار قهوه مصرفی روزانه:</strong> <strong>${totalKGUsed.toFixed(2)} کیلوگرم</strong></p><hr style="border-top: 1px dashed var(--accent-color); margin: 15px 0;"><h3>خلاصه ماهانه (30 روز)</h3><p><strong>کل درآمد ماهانه:</strong> ${formatCurrency(totalMonthlyRevenue)} تومان</p><p><strong>سود خالص ماهانه:</strong> <span style="color: var(--primary-color); font-weight: bold;">${formatCurrency(totalMonthlyProfit)} تومان</span></p><p><strong>مقدار قهوه مصرفی ماهانه:</strong> <strong>${totalKGUsed.toFixed(2)} کیلوگرم</strong></p>`;
    }
    if (buttons.calculateCafe) buttons.calculateCafe.addEventListener('click', calculateCafeRevenue);

    // ####################################
    // Stopwatch Logic
    // ####################################
    if (sections.stopwatch) {
        const stopwatchDisplay = sections.stopwatch.querySelector('.stopwatch-display');
        const startPauseBtn = sections.stopwatch.querySelector('#start-pause-btn');
        const resetBtn = sections.stopwatch.querySelector('#reset-btn');
        const stage1MinutesInput = sections.stopwatch.querySelector('#stage1-minutes');
        const stage1SecondsInput = sections.stopwatch.querySelector('#stage1-seconds');
        const stage2MinutesInput = sections.stopwatch.querySelector('#stage2-minutes');
        const stage2SecondsInput = sections.stopwatch.querySelector('#stage2-seconds');
        const stageIndicator = sections.stopwatch.querySelector('#stage-indicator');

        let timerInterval = null;
        let isRunning = false;
        let currentStage = 1;
        let timeRemaining = 0;
        const stageDurations = [0, 0];

        /**
         * Plays a simple, short beep sound using the Web Audio API.
         * This function creates a temporary audio context and an oscillator to generate a sine wave,
         * which is heard as a beep. It's used for audio cues in the stopwatch. Includes error handling.
         * @returns {void} This function does not return a value.
         */
        function playBeep() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.connect(audioContext.destination);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) { console.error("Could not play beep:", e); }
        }

        /**
         * Updates the stopwatch's time display.
         * It takes the `timeRemaining` in seconds, calculates the minutes and seconds,
         * formats them to a "mm:ss" string, and updates the stopwatch's display element.
         * @returns {void} This function does not return a value.
         */
        function updateDisplay() {
            const minutes = Math.floor(Math.abs(timeRemaining) / 60);
            const seconds = Math.abs(timeRemaining) % 60;
            stopwatchDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        /**
         * Stops the stopwatch timer.
         * This function clears the interval, sets the `isRunning` flag to false,
         * and updates the start/pause button text to "Continue". It also hides the stage indicator.
         * @returns {void} This function does not return a value.
         */
        function stopTimer() {
            clearInterval(timerInterval);
            isRunning = false;
            startPauseBtn.textContent = 'ادامه';
            if (stageIndicator) stageIndicator.style.display = 'none';
        }

        /**
         * Represents a single "tick" of the stopwatch, executed every second.
         * This function decrements the remaining time and updates the display. When the time for a stage
         * runs out, it plays a beep and transitions to the next stage or stops the timer if all stages are complete.
         * @returns {void} This function does not return a value.
         */
        function tick() {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateDisplay();
            }
            if (timeRemaining <= 0) {
                playBeep();
                if (currentStage === 1) {
                    currentStage = 2;
                    timeRemaining = stageDurations[1];
                    if (stageIndicator) stageIndicator.textContent = `مرحله ${currentStage} در حال اجرا`;
                    updateDisplay();
                    if (timeRemaining <= 0) stopTimer();
                } else {
                    stopTimer();
                }
            }
        }

        /**
         * Starts the stopwatch timer if it's not already running.
         * It sets up the timer to call the `tick` function every second. It also updates
         * the UI to reflect that the timer is running (e.g., changes button text to "Pause").
         * @returns {void} This function does not return a value.
         */
        function startTimer() {
            if (isRunning) return;
            if (timeRemaining <= 0) resetTimer();
            if (timeRemaining <= 0) return;

            if (stageIndicator) {
                stageIndicator.textContent = `مرحله ${currentStage} در حال اجرا`;
                stageIndicator.style.display = 'block';
            }
            isRunning = true;
            startPauseBtn.textContent = 'توقف';
            timerInterval = setInterval(tick, 1000);
        }

        /**
         * Toggles the stopwatch between running and paused states.
         * If the timer is running, it calls `stopTimer()`. If it's paused, it calls `startTimer()`.
         * @returns {void} This function does not return a value.
         */
        function toggleTimer() {
            if (isRunning) {
                stopTimer();
            } else {
                startTimer();
            }
        }

        /**
         * Resets the stopwatch to its initial state.
         * It stops the timer, resets the current stage and time remaining based on the input fields,
         * and updates the display and button text accordingly.
         * @returns {void} This function does not return a value.
         */
        function resetTimer() {
            stopTimer();
            currentStage = 1;
            stageDurations[0] = (parseInt(stage1MinutesInput.value, 10) || 0) * 60 + (parseInt(stage1SecondsInput.value, 10) || 0);
            stageDurations[1] = (parseInt(stage2MinutesInput.value, 10) || 0) * 60 + (parseInt(stage2SecondsInput.value, 10) || 0);
            timeRemaining = stageDurations[0];
            startPauseBtn.textContent = 'شروع';
            if (stageIndicator) stageIndicator.style.display = 'none';
            updateDisplay();
        }

        startPauseBtn.addEventListener('click', toggleTimer);
        resetBtn.addEventListener('click', resetTimer);

        [stage1MinutesInput, stage1SecondsInput, stage2MinutesInput, stage2SecondsInput].forEach(input => {
            input.addEventListener('input', resetTimer);
        });

        resetTimer();
    }

    // ####################################
    // Bean Mix Calculator Logic (Final Corrected Version)
    // ####################################
    if (sections.mix) {
        const beanRowsContainer = sections.mix.querySelector('#bean-rows-container');
        const addBeanBtn = sections.mix.querySelector('#add-bean-btn');
        const calculateMixBtn = sections.mix.querySelector('#calculate-mix-btn');
        const mixResults = sections.mix.querySelector('#mix-results');
        const totalPercentageSpan = sections.mix.querySelector('#total-percentage');
        let beanRowCount = 0;

        /**
         * Creates and adds a new row to the bean mix calculator UI.
         * Each row contains input fields for bean name, price, percentage, and weight.
         * It also includes a "Remove" button. The function ensures a maximum of 5 rows can be added.
         * @returns {void} This function does not return a value.
         */
        function createBeanRow() {
            if (beanRowsContainer.children.length >= 5) {
                addBeanBtn.style.display = 'none';
                return;
            }
            beanRowCount++;
            const rowWrapper = document.createElement('div');
            rowWrapper.className = 'bean-row-wrapper';

            // Add separator for all but the first row
            if (beanRowsContainer.children.length > 0) {
                rowWrapper.innerHTML += '<hr>';
            }

            rowWrapper.innerHTML += `
                <div class="bean-row cafe-grid four-cols">
                    <div class="input-group"><input type="text" class="bean-name" placeholder="نوع دانه ${beanRowCount}"></div>
                    <div class="input-group"><input type="number" class="bean-price" placeholder="قیمت (تومان/کیلو)"></div>
                    <div class="input-group"><input type="number" class="bean-percentage" placeholder="درصد (%)" min="0" max="100"></div>
                    <div class="input-group"><input type="number" class="bean-weight" placeholder="وزن (گرم)"></div>
                </div>
                <button class="calc-button remove-bean-btn" style="background: var(--danger-color); font-size: 0.9rem; padding: 0.5rem; width: auto; margin-top: -1rem; align-self: center;">حذف</button>
            `;

            beanRowsContainer.appendChild(rowWrapper);

            rowWrapper.querySelector('.remove-bean-btn').addEventListener('click', () => {
                rowWrapper.remove();
                if (beanRowsContainer.children.length < 5) {
                    addBeanBtn.style.display = 'block';
                }
                updateTotalPercentage();
            });

            rowWrapper.querySelector('.bean-percentage').addEventListener('input', updateTotalPercentage);
        }

        /**
         * Calculates and updates the total percentage of all beans in the mix calculator.
         * It reads the percentage value from each bean row, sums them up, and displays the total.
         * The total is colored green if it's 100% and red otherwise.
         * @returns {void} This function does not return a value.
         */
        function updateTotalPercentage() {
            const percentages = beanRowsContainer.querySelectorAll('.bean-percentage');
            let total = 0;
            percentages.forEach(input => {
                total += parseFloat(input.value) || 0;
            });
            totalPercentageSpan.textContent = total.toFixed(0);
            totalPercentageSpan.style.color = (Math.round(total) === 100) ? '#28a745' : 'var(--danger-color)';
        }

        /**
         * Calculates the final price of the coffee bean mix based on weight and percentage.
         * It processes each bean row to calculate the price per kilogram based on two methods:
         * 1. Based on the total weight and cost of the beans entered.
         * 2. Based on the percentage composition if the percentages sum to 100.
         * The results are then displayed in the UI.
         * @returns {void} This function does not return a value.
         */
        function calculateMixPrice() {
            const rows = beanRowsContainer.querySelectorAll('.bean-row-wrapper');
            let totalPercentage = 0;
            let totalWeight = 0;
            let totalCostFromWeight = 0;
            let finalPriceFromPercentage = 0;

            rows.forEach(row => {
                const percentage = parseFloat(row.querySelector('.bean-percentage').value) || 0;
                const price = parseFloat(row.querySelector('.bean-price').value) || 0;
                const weight = parseFloat(row.querySelector('.bean-weight').value) || 0;

                totalPercentage += percentage;

                if (weight > 0 && price > 0) {
                    totalWeight += weight;
                    totalCostFromWeight += (weight / 1000) * price;
                }

                if (percentage > 0 && price > 0) {
                    finalPriceFromPercentage += (percentage / 100) * price;
                }
            });

            let resultHTML = '';

            // Calculation based on weight
            if (totalWeight > 0) {
                const pricePerKgFromWeight = totalCostFromWeight / (totalWeight / 1000);
                resultHTML += `<p><strong>قیمت نهایی (بر اساس وزن):</strong> ${formatCurrency(pricePerKgFromWeight)} تومان/کیلوگرم</p>`;
            }

            // Calculation based on percentage
            if (Math.round(totalPercentage) === 100) {
                resultHTML += `<p><strong>قیمت نهایی (بر اساس درصد):</strong> ${formatCurrency(finalPriceFromPercentage)} تومان/کیلوگرم</p>`;
            } else {
                resultHTML += `<p style="font-size: 0.9rem; color: var(--danger-color);">(برای محاسبه بر اساس درصد، مجموع درصدها باید 100 باشد)</p>`;
            }

            if (resultHTML === '') {
                mixResults.innerHTML = `<p style="color: var(--danger-color);">لطفاً مقادیر را برای محاسبه وارد کنید.</p>`;
            } else {
                mixResults.innerHTML = resultHTML;

                const oneMonthButton = document.createElement('button');
                oneMonthButton.textContent = 'قیمت نهایی برای خرید یک ماهه';
                oneMonthButton.className = 'calc-button';
                oneMonthButton.style.marginTop = '1rem';

                oneMonthButton.addEventListener('click', () => {
                    const priceWithIncreasePerc = priceFromPercentage * 1.06;
                    const priceWithIncreaseWeight = pricePerKgFromWeight * 1.06;

                    const increaseHTML = `<hr><p style="color: var(--primary-color);">با 6% افزایش:</p>`;
                    let increaseResults = '';
                    if (pricePerKgFromWeight > 0) {
                       increaseResults += `<p><strong>بر اساس وزن:</strong> ${formatCurrency(priceWithIncreaseWeight)} تومان/کیلوگرم</p>`;
                    }
                     if (Math.round(totalPercentage) === 100) {
                       increaseResults += `<p><strong>بر اساس درصد:</strong> ${formatCurrency(priceWithIncreasePerc)} تومان/کیلوگرم</p>`;
                    }

                    mixResults.innerHTML += increaseHTML + increaseResults;
                    oneMonthButton.remove();
                }, { once: true });

                mixResults.appendChild(oneMonthButton);
            }
        }

        addBeanBtn.addEventListener('click', createBeanRow);
        calculateMixBtn.addEventListener('click', calculateMixPrice);

        // Add initial row
        createBeanRow();
    }

    // ####################################
    // Price List Image Generation Logic (Redesigned with Modal)
    // ####################################
    if (sections.priceList) {
        const coffeeListContainer = sections.priceList.querySelector('#coffee-list-container');
        const powderListContainer = sections.priceList.querySelector('#powder-list-container');
        const generateImageBtn = sections.priceList.querySelector('#generate-image-btn');
        const coffeeSearchInput = sections.priceList.querySelector('#coffee-search');
        const powderSearchInput = sections.priceList.querySelector('#powder-search');

        // Modal Elements
        const roastModal = document.getElementById('roast-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalRoastTypeSelect = document.getElementById('modal-roast-type');
        const modalPurchasePriceInput = document.getElementById('modal-purchase-price');
        const modalProfitPercentInput = document.getElementById('modal-profit-percent');
        const modalConfirmBtn = document.getElementById('modal-confirm-btn');
        const closeModalBtn = roastModal.querySelector('.close-button');

        let currentRowForModal = null;

        const coffeeTypes = [
            "ویتنام","برزیل","چری","کلمبیا","اندونزی","PB","اوگاندا",
            "اتیوپی","کنیا","یمن","گواتمالا","هندوراس","پرو","مکزیک",
            "پاناما","کاستاریکا","اندونزی عربیکا","جاوا عربیکا","بوربون",
            "تیپیکا","اندونزی روبوستا","برزیل روبوستا","هند روبوستا",
            " 70/30 میکس عربیکا","50/50 میکس","100 عربیکا ","100 ربوستا ","70/30 میکس ربوستا"
        ];
        const powderTypes = [
            "شکلات داغ","شکلات سفید","چای ماسالا","ثعلب","کاپوچینو","کافی میکس"
        ];
        const roastTypes = ["مدیوم", "شکلاتی", "دارک"];

        // Populate modal roast types
        roastTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            modalRoastTypeSelect.appendChild(option);
        });

        /**
         * Displays a modal dialog for entering coffee or powder product details.
         * This function makes the modal visible and populates it with information about the selected product.
         * It adjusts the modal's fields based on whether the product is a coffee bean or a powder.
         * @param {HTMLElement} rowElement - The list row element that the modal is for.
         * @param {string} coffeeType - The name of the coffee or powder type.
         * @param {string} [productType='coffee'] - The type of product, either 'coffee' or 'powder'.
         * @returns {void} This function does not return a value.
         */
        function showModal(rowElement, coffeeType, productType = 'coffee') {
            currentRowForModal = rowElement;
            currentRowForModal.dataset.productType = productType; // Store the type
            modalTitle.textContent = `اطلاعات: ${coffeeType}`;
            modalPurchasePriceInput.value = '';
            modalProfitPercentInput.value = '';

            // Show or hide the roast type selector based on the product type
            const roastTypeGroup = document.getElementById('roast-type-group');
            if (productType === 'powder') {
                roastTypeGroup.style.display = 'none';
            } else {
                roastTypeGroup.style.display = 'block';
                modalRoastTypeSelect.selectedIndex = 0;
            }

            roastModal.style.display = 'block';
        }

        /**
         * Hides the product details modal.
         * This function sets the modal's display style to 'none' and clears the reference to the current row.
         * @returns {void} This function does not return a value.
         */
        function hideModal() {
            roastModal.style.display = 'none';
            currentRowForModal = null;
        }

        /**
         * Handles the confirmation action from the product details modal.
         * It reads the purchase price and profit percentage from the modal's inputs, validates them,
         * calculates the final price, and updates the corresponding row in the price list with the new data.
         * @returns {void} This function does not return a value.
         */
        function handleModalConfirm() {
            if (!currentRowForModal) return;

            const purchasePrice = parseFloat(modalPurchasePriceInput.value);
            const profitPercent = parseFloat(modalProfitPercentInput.value);

            if (isNaN(purchasePrice) || isNaN(profitPercent) || purchasePrice <= 0 || profitPercent < 0) {
                alert('لطفاً قیمت خرید و درصد سود را به درستی وارد کنید.');
                return;
            }

            // Store raw values in data attributes
            currentRowForModal.dataset.purchasePrice = purchasePrice;
            currentRowForModal.dataset.profitPercent = profitPercent;

            const finalPrice = purchasePrice * (1 + (profitPercent / 100));
            currentRowForModal.querySelector('.price-display').textContent = `${formatCurrency(finalPrice)} تومان`;

            // Only handle roast type for coffee products
            if (currentRowForModal.dataset.productType === 'coffee') {
                const roastType = modalRoastTypeSelect.value;
                currentRowForModal.dataset.roastType = roastType;
                const roastDisplay = currentRowForModal.querySelector('.roast-display');
                if (roastDisplay) {
                    roastDisplay.textContent = `(${roastType})`;
                }
            }

            hideModal();
        }

        modalConfirmBtn.addEventListener('click', handleModalConfirm);
        closeModalBtn.addEventListener('click', hideModal);
        window.addEventListener('click', (event) => {
            if (event.target === roastModal) hideModal();
        });

        /**
         * Creates and adds a new row for a coffee type to the price list.
         * This function dynamically generates the HTML for a new coffee entry, appends it to the list,
         * and then calls `showModal` to let the user input the price and roast details.
         * @param {string} coffeeType - The name of the coffee to add.
         * @returns {void} This function does not return a value.
         */
        function createCoffeeRow(coffeeType) {
            const row = document.createElement('div');
            row.className = 'price-list-dynamic-row';

            const coffeeName = document.createElement('span');
            coffeeName.textContent = coffeeType;

            const priceDisplay = document.createElement('span');
            priceDisplay.className = 'price-display';

            const roastDisplay = document.createElement('span');
            roastDisplay.className = 'roast-display';

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'حذف';
            removeBtn.className = 'calc-button remove-row-btn';
            removeBtn.onclick = () => row.remove();

            row.append(coffeeName, priceDisplay, roastDisplay, removeBtn);
            coffeeListContainer.appendChild(row);

            showModal(row, coffeeType);
        }

        /**
         * Creates and adds a new row for a powder product to the price list.
         * This function dynamically generates the HTML for a new powder entry, appends it to the list,
         * and then calls `showModal` to let the user input the price details.
         * @param {string} powderType - The name of the powder product to add.
         * @returns {void} This function does not return a value.
         */
        function createPowderRow(powderType) {
            const row = document.createElement('div');
            row.className = 'price-list-dynamic-row';
            const powderName = document.createElement('span');
            powderName.textContent = powderType;
            const priceDisplay = document.createElement('span');
            priceDisplay.className = 'price-display';
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'حذف';
            removeBtn.className = 'calc-button remove-row-btn';
            removeBtn.onclick = () => row.remove();
            row.append(powderName, priceDisplay, removeBtn);
            powderListContainer.appendChild(row);

            showModal(row, powderType, 'powder');
        }


        /**
         * Generates and triggers a download for an image of the current price list.
         * This function gathers all the price list data, populates a hidden HTML template with it,
         * and then uses the `html2canvas` library to render this template as a PNG image,
         * which is then downloaded by the user. It handles cases with no content and provides alerts.
         * @returns {void} This function does not return a value.
         */
        function generateImage() {
            const brandName = document.getElementById('brand-name').value || 'کافه شما';
            const socialId = document.getElementById('social-id').value || '@your_cafe';

            document.getElementById('image-brand-name').textContent = brandName;
            document.getElementById('image-social-id').textContent = socialId;

            const imageTemplate = document.getElementById('image-output-template');
            const imageCoffeeList = imageTemplate.querySelector('#image-coffee-list');
            const imagePowderList = imageTemplate.querySelector('#image-powder-list');

            imageCoffeeList.innerHTML = '<h3>دانه‌های قهوه</h3>';
            imagePowderList.innerHTML = '<h3>محصولات پودری</h3>';

            let hasContent = false;
            coffeeListContainer.querySelectorAll('.price-list-dynamic-row').forEach(row => {
                const coffee = row.querySelector('span').textContent;
                const roast = row.dataset.roastType;
                const price = parseFloat(row.dataset.purchasePrice);
                const percent = parseFloat(row.dataset.profitPercent);

                if (coffee && roast && !isNaN(price) && !isNaN(percent)) {
                    hasContent = true;
                    const finalPrice = price * (1 + (percent / 100));
                    const item = document.createElement('div');
                    item.className = 'image-item-row';
                    item.innerHTML = `<span class="item-name">${coffee} (${roast})</span><span class="item-price">${formatCurrency(finalPrice)} تومان</span>`;
                    imageCoffeeList.appendChild(item);
                }
            });
            if (imageCoffeeList.children.length <= 1) imageCoffeeList.innerHTML = '';


            powderListContainer.querySelectorAll('.price-list-dynamic-row').forEach(row => {
                const powder = row.querySelector('span').textContent;
                const price = parseFloat(row.dataset.purchasePrice);
                const percent = parseFloat(row.dataset.profitPercent);

                if (powder && !isNaN(price) && !isNaN(percent)) {
                    hasContent = true;
                    const finalPrice = price * (1 + (percent / 100));
                    const item = document.createElement('div');
                    item.className = 'image-item-row';
                    item.innerHTML = `<span class="item-name">${powder}</span><span class="item-price">${formatCurrency(finalPrice)} تومان</span>`;
                    imagePowderList.appendChild(item);
                }
            });

            if (imagePowderList.children.length <= 1) imagePowderList.innerHTML = '';


            if (!hasContent) {
                alert('لطفا حداقل یک مورد را برای ایجاد تصویر وارد کنید.');
                return;
            }

            imageTemplate.style.display = 'block';

            html2canvas(imageTemplate, { useCORS: true, scale: 2 }).then(canvas => {
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `${brandName.replace(/\s+/g, '-')}-price-list.png`;
                link.click();
                imageTemplate.style.display = 'none';
            }).catch(err => {
                console.error("Error generating image:", err);
                imageTemplate.style.display = 'none';
                alert("متاسفانه در ایجاد تصویر مشکلی پیش آمد.");
            });
        }

        coffeeSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const suggestions = coffeeTypes.filter(type => type.toLowerCase().startsWith(lowerCaseSearchTerm));
            const suggestionBox = document.getElementById('autocomplete-suggestions');
            if (suggestionBox) {
                suggestionBox.remove();
            }
            if (searchTerm.length > 0) {
                const newSuggestionBox = document.createElement('div');
                newSuggestionBox.id = 'autocomplete-suggestions';
                newSuggestionBox.className = 'autocomplete-suggestions';
                if (suggestions.length > 0) {
                    suggestions.forEach(suggestion => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.textContent = suggestion;
                        suggestionItem.addEventListener('click', () => {
                            createCoffeeRow(suggestion);
                            coffeeSearchInput.value = '';
                            newSuggestionBox.remove();
                        });
                        newSuggestionBox.appendChild(suggestionItem);
                    });
                } else {
                    const createItem = document.createElement('div');
                    createItem.innerHTML = `ایجاد: <strong>${searchTerm}</strong>`;
                    createItem.addEventListener('click', () => {
                        createCoffeeRow(searchTerm);
                        coffeeSearchInput.value = '';
                        newSuggestionBox.remove();
                    });
                    newSuggestionBox.appendChild(createItem);
                }
                coffeeSearchInput.parentNode.appendChild(newSuggestionBox);
            }
        });
        powderSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const suggestions = powderTypes.filter(type => type.toLowerCase().startsWith(lowerCaseSearchTerm));
            const suggestionBox = document.getElementById('autocomplete-suggestions-powder');
            if (suggestionBox) {
                suggestionBox.remove();
            }
            if (searchTerm.length > 0) {
                const newSuggestionBox = document.createElement('div');
                newSuggestionBox.id = 'autocomplete-suggestions-powder';
                newSuggestionBox.className = 'autocomplete-suggestions';
                if (suggestions.length > 0) {
                    suggestions.forEach(suggestion => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.textContent = suggestion;
                        suggestionItem.addEventListener('click', () => {
                            createPowderRow(suggestion);
                            powderSearchInput.value = '';
                            newSuggestionBox.remove();
                        });
                        newSuggestionBox.appendChild(suggestionItem);
                    });
                } else {
                    const createItem = document.createElement('div');
                    createItem.innerHTML = `ایجاد: <strong>${searchTerm}</strong>`;
                    createItem.addEventListener('click', () => {
                        createPowderRow(searchTerm);
                        powderSearchInput.value = '';
                        newSuggestionBox.remove();
                    });
                    newSuggestionBox.appendChild(createItem);
                }
                powderSearchInput.parentNode.appendChild(newSuggestionBox);
            }
        });

        generateImageBtn.addEventListener('click', generateImage);
    }
});