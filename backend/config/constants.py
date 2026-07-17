from enum import Enum

class PatientStatus(str, Enum):
    ICU = "ICU"
    WARD = "WARD"
    DISCHARGED = "DISCHARGED"

class LoggedInDoctor:
    ID: str = "doc_101"
    NAME: str = "Dr. Deepak Bhasin"
    SPECIALTY: str = "Pulmonologist"
    EMAIL: str = "deepak.bhasin@clinote.com"
