# semantic_analyzer.py

def semantic_summary(project_name: str, analysis: dict) -> dict:
    """
    Prepares structured semantic data for LLM input.
    Avoids guessing or keyword-based assumptions.
    Only passes real extracted information.
    """

    return {
        "project_name": project_name,

        # Core structure
        "folders": analysis.get("folders", []),
        "files": analysis.get("files", []),

        # Tech signals
        "languages": analysis.get("languages", []),

        # Code-level insights
        "functions": analysis.get("functions", []),
        "classes": analysis.get("classes", []),

        # Keep full raw analysis for deeper reasoning
        "raw_analysis": analysis
    }