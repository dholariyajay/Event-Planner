# Event Planner Application

## Project Summary

The Event Planner is a modern, user-friendly application designed to help you organize and visualize your events. Think of it as your digital calendar with superpowers! You can create events, assign them to different tracks (like categories), and view them in two ways:

1. **Timeline View** - See your events laid out on a visual timeline, organized by tracks and color-coded by type. This gives you a bird's-eye view of what's happening when.

2. **List View** - See your events in a neat, organized list that you can sort, filter, and paginate when you have lots of events.

The app is designed to be intuitive and visually appealing, with a responsive layout that works well on both desktop and mobile devices. You can drag and drop events to reorder them, search for specific events, and filter them by type.

## Key Features

- **Easy Event Creation**: Add new events with title, type, track, start date, and end date
- **Visual Timeline**: See events organized by tracks with a clear visual representation
- **Interactive List**: View events in a sortable, filterable list with pagination
- **Drag and Drop**: Easily reorganize your events or tracks with simple drag and drop
- **Smart Filtering**: Find events quickly with type filters and text search
- **Responsive Design**: Works beautifully on any device size
- **Modern UI**: Clean, professional interface with subtle animations and visual feedback

## Tech Stack

- **Frontend**: React.js with Material UI for a polished, professional look
- **Backend**: Python Flask API for reliable data management
- **Database**: SQLite for development, easily upgradable for production
- **State Management**: React Context API for efficient data flow
- **UI Enhancements**: react-beautiful-dnd for smooth drag and drop

## About Me

Hi, I'm Jay Dholariya, a passionate developer with a keen eye for creating intuitive and visually appealing user interfaces. I built this Event Planner application to showcase my skills in:

- **Frontend Development**: Creating responsive, accessible, and aesthetically pleasing user interfaces using React and Material UI
- **Backend Integration**: Connecting frontend applications to backend APIs for seamless data flow
- **User Experience Design**: Crafting intuitive workflows and interactions that make complex tasks simple
- **Modern Web Technologies**: Implementing the latest web standards and best practices

I believe that software should be both powerful and easy to use. This Event Planner application demonstrates my commitment to creating solutions that are not only functional but also enjoyable to interact with.

Feel free to explore the application and reach out if you have any questions or feedback!

## Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.8+ and pip

### Backend Setup

1. Navigate to the backend directory:
```
cd backend
```

2. Create a virtual environment:
```
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
```
venv\Scripts\activate
```
- macOS/Linux:
```
source venv/bin/activate
```

4. Install dependencies:
```
pip install -r requirements.txt
```

5. Run the Flask application:
```
python run.py
```

The backend API will be available at http://localhost:5000/api

### Frontend Setup

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

The frontend application will be available at http://localhost:3000

## API Endpoints

- `GET /api/events`: Get all events
- `GET /api/events/<id>`: Get a specific event
- `POST /api/events`: Create a new event
- `PUT /api/events/<id>`: Update an event
- `DELETE /api/events/<id>`: Delete an event
- `PATCH /api/events/reorder`: Update event ordering

## Deployment

### Backend
The backend can be deployed to platforms like Heroku:

1. Create a Procfile:
```
web: gunicorn run:app
```

2. Add gunicorn to requirements.txt
3. Deploy to Heroku

### Frontend
The frontend can be deployed to platforms like Netlify or Vercel:

1. Build the production version:
```
npm run build
```

2. Deploy the build folder to your preferred hosting service

## License
MIT
