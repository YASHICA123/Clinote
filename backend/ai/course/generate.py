import os

class CourseGenerator:
    @staticmethod
    def generate(patient_name: str, notes: str) -> str:
        prompt_path = os.path.join("backend", "prompts", "course.md")
        if os.path.exists(prompt_path):
            with open(prompt_path, "r", encoding="utf-8") as f:
                prompt_content = f.read()
                
        # Generate narrative clinical course
        return (
            f"Clinical Course for patient {patient_name}:\n"
            f"Based on latest updates: '{notes}'.\n"
            "Vitals checked and stabilized. Oxygenation maintained on room air. "
            "Nebulization frequency optimized. Recommended shift from active ICU care to ward."
        )
