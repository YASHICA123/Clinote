from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from backend.models.clinical_event import ClinicalEvent
from backend.schemas.timeline import TimelineResponse, TimelineEventItem

class TimelineService:
    @classmethod
    def get_timeline(
        cls,
        db: Session,
        patient_id: str,
        encounter_id: Optional[str] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        order: str = "desc"
    ) -> Dict[str, Any]:
        query = db.query(ClinicalEvent).filter(ClinicalEvent.patient_id == patient_id)

        if encounter_id:
            query = query.filter(ClinicalEvent.encounter_id == encounter_id)

        if from_date:
            try:
                dt_from = datetime.fromisoformat(from_date)
                query = query.filter(ClinicalEvent.created_at >= dt_from)
            except Exception:
                pass

        if to_date:
            try:
                dt_to = datetime.fromisoformat(to_date)
                query = query.filter(ClinicalEvent.created_at <= dt_to)
            except Exception:
                pass

        if order.lower() == "asc":
            events = query.order_by(ClinicalEvent.created_at.asc()).all()
        else:
            events = query.order_by(ClinicalEvent.created_at.desc()).all()

        formatted_events = []
        for evt in events:
            # Format timestamp nicely
            created_str = evt.created_at.strftime("%d %b %Y, %I:%M %p") if evt.created_at else ""
            
            # Map event type to lowercase for legacy frontend icon rendering
            evt_type_map = {
                "INITIAL_ASSESSMENT": "admission",
                "DAILY_UPDATE": "diagnosis",
                "INVESTIGATION": "investigation",
                "MEDICATION_UPDATE": "medication",
                "PROCEDURE": "procedure",
                "DISCHARGE": "discharge"
            }
            ui_type = evt_type_map.get(evt.event_type, evt.event_type.lower())

            formatted_events.append({
                "event_id": evt.id,
                "id": evt.id,
                "patient_id": evt.patient_id,
                "patientId": evt.patient_id,
                "encounter_id": evt.encounter_id,
                "event_type": evt.event_type,
                "type": ui_type,
                "title": evt.title or evt.event_type.replace("_", " ").title(),
                "subtitle": f"By {evt.created_by}" if evt.created_by else "",
                "content": evt.content,
                "details": evt.content,
                "created_by": evt.created_by,
                "created_at": evt.created_at.isoformat() if evt.created_at else "",
                "timestamp": created_str
            })

        return {
            "patient_id": patient_id,
            "events": formatted_events
        }
