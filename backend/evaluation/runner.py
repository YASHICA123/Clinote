from typing import List, Dict, Any

class EvaluationRunner:
    @staticmethod
    def calculate_precision_recall(extracted: List[str], ground_truth: List[str]) -> Dict[str, float]:
        if not ground_truth:
            return {"precision": 0.0, "recall": 0.0, "f1": 0.0}
            
        true_positives = len(set(extracted) & set(ground_truth))
        precision = true_positives / len(extracted) if extracted else 0.0
        recall = true_positives / len(ground_truth)
        
        f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
        return {"precision": precision, "recall": recall, "f1": f1}

    @classmethod
    def run_benchmark(cls, test_dataset: List[Dict[str, Any]]) -> Dict[str, Any]:
        results = []
        for item in test_dataset:
            extracted = item.get("extracted_medications", [])
            ground_truth = item.get("ground_truth_medications", [])
            scores = cls.calculate_precision_recall(extracted, ground_truth)
            results.append(scores)
            
        avg_precision = sum(r["precision"] for r in results) / len(results) if results else 0.0
        avg_recall = sum(r["recall"] for r in results) / len(results) if results else 0.0
        avg_f1 = sum(r["f1"] for r in results) / len(results) if results else 0.0
        
        return {
            "cases_evaluated": len(results),
            "avg_precision": avg_precision,
            "avg_recall": avg_recall,
            "avg_f1": avg_f1
        }
