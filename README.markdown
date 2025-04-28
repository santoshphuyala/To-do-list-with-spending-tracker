# Task & Expense Manager

Task & Expense Manager is a web-based application designed to help users organize tasks, manage shopping lists, and track expenses. Built with a professional, user-friendly interface, it leverages Bootstrap 5 for responsive design, localStorage for data persistence, and libraries like jsPDF and DOMPurify for enhanced functionality. The application features a dashboard, cross-module integration, CSV/PDF import/export, and undo/redo capabilities.

## Features
- **Dashboard**: Summarizes upcoming tasks, recent expenses, and pending shopping items with quick action buttons.
- **To-Do List**: Manage tasks with due dates, completion status, and optional links to shopping items.
- **Shopping List**: Track items with quantities and purchased status, with integration to add expenses.
- **Spending Tracker**: Record income and expenses with categories, dates, and currencies.
- **Integration**: Link tasks to shopping items and convert purchased items into expenses.
- **Import/Export**: Support for CSV import and CSV/PDF export for all modules.
- **Undo/Redo**: Revert or redo changes in tasks, shopping lists, and spending entries.
- **Accessibility**: ARIA attributes, keyboard navigation, and focus management for inclusive use.
- **Professional Design**: Clean, card-based UI with collapsible sections to reduce clutter.

## Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge).
- An internet connection for loading CDN-hosted dependencies (Bootstrap, Font Awesome, jsPDF, DOMPurify).
- (Optional) A local web server for testing (e.g., Python's `http.server`).

## Installation
1. **Clone or Download the Repository**:
   - Download the project files or clone the repository to your local machine.
2. **Project Structure**:
   ```
   task-expense-manager/
   ├── index.html
   ├── utility.js
   ├── todo-list.js
   ├── shopping-list.js
   ├── spending-tracker.js
   ├── dashboard.js
   └── README.md
   ```
3. **Host the Application**:
   - Option 1: Open `index.html` directly in a browser (note: some features may require a server due to CORS).
   - Option 2: Serve the directory using a local server:
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000` in your browser.
4. **Verify Dependencies**:
   - The application loads external libraries via CDN:
     - Bootstrap 5.3.2
     - Font Awesome 6.4.2
     - jsPDF 2.5.1
     - DOMPurify 2.4.0
   - Ensure an internet connection for the initial load.

## Usage
1. **Access the Application**:
   - Open the application in a browser. The Dashboard is displayed by default.
2. **Navigate Modules**:
   - Use the sidebar to switch between Dashboard, To-Do List, Shopping List, and Spending Tracker.
3. **Manage Tasks**:
   - Click "Add Task" to open a modal, enter task details, and optionally link to a shopping item.
   - Mark tasks as completed, delete, or use undo/redo.
   - Export tasks to CSV/PDF or import from CSV.
4. **Manage Shopping List**:
   - Add items with quantities via the "Add Item" modal.
   - Mark items as purchased, which prompts adding an expense to the Spending Tracker.
   - Edit, delete, undo/redo, or import/export items.
5. **Track Spending**:
   - Add income/expense entries with amounts, categories, and dates.
   - Delete, undo/redo, or import/export entries.
6. **Use the Dashboard**:
   - View summaries of upcoming tasks, recent expenses, and pending shopping items.
   - Add expenses directly from shopping items via the "Add Expense from Shopping" button.
7. **Access Help**:
   - (Optional) Add a `help.html` file (see below) and link it from the sidebar for user guidance.

## CSV Import Format
- **Tasks**: `Text,Date,Completed,LinkedItem` (e.g., `Buy groceries,2025-05-01,false,Milk`)
- **Shopping List**: `Item,Quantity,Purchased` (e.g., `Milk,2,false`)
- **Spending Entries**: `Amount,Type,Category,Date,Currency` (e.g., `50,Expense,Food,2025-04-28,NRs`)

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure code follows the existing style (e.g., Bootstrap classes, modular JavaScript) and includes tests for new features.

## Known Limitations
- **Offline Support**: The application requires an internet connection for CDN-hosted libraries. Consider adding a Service Worker for offline caching.
- **Theme**: Currently uses a fixed light theme. Theme switching can be added by modifying `utility.js`.
- **Storage**: Uses localStorage, limited to ~5MB. Large datasets may trigger storage warnings.
- **Currency**: Fixed to NRs by default, with no dynamic conversion (can be extended).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions or feedback, contact the project maintainer at [your-email@example.com] or open an issue on the repository.