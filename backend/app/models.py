from app import db
from datetime import datetime

class Event(db.Model):
    """Event model for storing event data"""
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    event_type = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Event {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'event_type': self.event_type,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'order': self.order,
            'created_at': self.created_at.isoformat()
        }
