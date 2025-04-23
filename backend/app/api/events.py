from flask import request, jsonify
from app.api import api_bp
from app.models import Event
from app import db
from datetime import datetime

@api_bp.route('/events', methods=['GET'])
def get_events():
    """Get all events"""
    events = Event.query.order_by(Event.order, Event.start_date).all()
    return jsonify([event.to_dict() for event in events])

@api_bp.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    """Get a specific event by ID"""
    event = Event.query.get_or_404(id)
    return jsonify(event.to_dict())

@api_bp.route('/events', methods=['POST'])
def create_event():
    """Create a new event"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    if not data.get('event_type'):
        return jsonify({'error': 'Event type is required'}), 400
    
    if not data.get('start_date') or not data.get('end_date'):
        return jsonify({'error': 'Start and end dates are required'}), 400
    
    try:
        # Parse dates
        start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        
        # Validate date range
        if end_date < start_date:
            return jsonify({'error': 'End date must be after start date'}), 400
        
        # Get the highest order value
        max_order = db.session.query(db.func.max(Event.order)).scalar() or 0
        
        # Create new event
        event = Event(
            title=data['title'],
            event_type=data['event_type'],
            start_date=start_date,
            end_date=end_date,
            order=max_order + 1
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify(event.to_dict()), 201
    
    except ValueError as e:
        return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/events/<int:id>', methods=['PUT'])
def update_event(id):
    """Update an existing event"""
    event = Event.query.get_or_404(id)
    data = request.get_json()
    
    # Update fields if provided
    if 'title' in data and data['title']:
        event.title = data['title']
    
    if 'event_type' in data and data['event_type']:
        event.event_type = data['event_type']
    
    if 'start_date' in data and data['start_date']:
        try:
            event.start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        except ValueError as e:
            return jsonify({'error': f'Invalid start date format: {str(e)}'}), 400
    
    if 'end_date' in data and data['end_date']:
        try:
            event.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        except ValueError as e:
            return jsonify({'error': f'Invalid end date format: {str(e)}'}), 400
    
    # Validate date range
    if event.end_date < event.start_date:
        return jsonify({'error': 'End date must be after start date'}), 400
    
    try:
        db.session.commit()
        return jsonify(event.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    """Delete an event"""
    event = Event.query.get_or_404(id)
    
    try:
        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/events/reorder', methods=['PATCH'])
def reorder_events():
    """Update the order of events (for drag and drop functionality)"""
    data = request.get_json()
    
    if not data or not isinstance(data, list):
        return jsonify({'error': 'Expected a list of event IDs with order'}), 400
    
    try:
        for item in data:
            if 'id' not in item or 'order' not in item:
                return jsonify({'error': 'Each item must have id and order fields'}), 400
            
            event = Event.query.get(item['id'])
            if not event:
                return jsonify({'error': f'Event with ID {item["id"]} not found'}), 404
            
            event.order = item['order']
        
        db.session.commit()
        return jsonify({'message': 'Events reordered successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
