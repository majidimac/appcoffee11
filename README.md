# Majid's Coffee Tools

**ابزار قهوه مجید**

This is a comprehensive, single-page web application designed for café owners and coffee professionals in Iran. It provides a suite of tools to streamline daily calculations, manage pricing, and assist with technical tasks. The entire user interface is in Persian and features a modern, responsive "glassmorphism" design that works seamlessly on both desktop and mobile devices.

## Features

The application is divided into several specialized modules, each accessible from the main menu:

*   **Roast Calculation (`محاسبه رُست`):**
    *   Calculates the final cost of roasted coffee based on green bean price, roasting fees, and weight loss percentage.
    *   Provides a detailed breakdown of costs and potential profits.
    *   Generates a downloadable PNG image of the daily roast report.

*   **Cafe Revenue Calculation (`درآمد کافه`):**
    *   Analyzes daily and monthly revenue, costs, and net profit.
    *   Accounts for variables like the cost of coffee beans, sales price, consumption per shot, and daily sales volume.

*   **Bean Mix Price Calculation (`میکس دانه`):**
    *   Determines the final price of a custom coffee bean blend.
    *   Calculates the price based on the cost and percentage (or weight) of each component bean.

*   **Two-Stage Stopwatch (`کرنومتر`):**
    *   A versatile timer with two independent, programmable stages, useful for various brewing methods.

*   **Price List Image Generator (`لیست قیمت`):**
    *   Allows users to create a professional, branded price list.
    *   Users can add various coffee beans and powder products, set purchase prices and profit margins, and generate a high-quality, downloadable PNG image of the final list.

*   **Espresso Machine Backwash Timer (`بک واش`):**
    *   A specialized, pre-programmed timer to guide the user through the espresso machine backwashing process, with audible cues for each step.

### Common Features
*   **Live Clock & Date:** Displays the current time and date in the Persian calendar.
*   **Dark/Light Theme:** A theme switcher allows users to toggle between dark and light modes, with the preference saved in local storage.
*   **Responsive Design:** The layout is fully responsive and optimized for a great user experience on any device.

## Tech Stack

*   **HTML5:** For the core structure of the application.
*   **CSS3:** For styling, including the "glassmorphism" theme, responsive design, and animations.
*   **JavaScript (ES6+):** For all application logic, including calculations, DOM manipulation, and UI interactions.
*   **html2canvas:** A third-party library used to capture DOM elements and generate downloadable images for the Roast Report and Price List features.

## Setup and Usage

This is a static web application and requires no complex setup or backend server.

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/majid-coffee-tools.git
    ```
2.  **Navigate to the Project Directory:**
    ```bash
    cd majid-coffee-tools
    ```
3.  **Open in a Browser:**
    Simply open the `index.html` file in any modern web browser (like Chrome, Firefox, or Safari).

    *On some systems, you can do this from the command line:*
    ```bash
    # On macOS
    open index.html

    # On Windows
    start index.html
    ```

## File Structure

*   `index.html`: The main HTML file containing the structure for all sections of the application.
*   `style.css`: The primary stylesheet, which defines the visual appearance, including the theme colors, layout, and responsive media queries.
*   `script.js`: The core of the application. This file contains all the JavaScript logic for:
    *   Navigation between sections.
    *   All calculation logic for the different tools.
    *   Event handling for buttons and inputs.
    *   Theme switching and clock functionality.
    *   Dynamic HTML generation for features like the bean mix and price list calculators.
*   `image/`: A directory containing the SVG and PNG icons used in the main menu cards and other UI elements.
