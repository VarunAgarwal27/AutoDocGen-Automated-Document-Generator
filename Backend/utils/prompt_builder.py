def build_prompt(project_name: str, analysis: dict) -> str:
    return f"""
You are a senior software architect.

Generate detailed, professional technical documentation for the project.

STRICT RULES:
- Use clear, complete sentences (NOT short phrases).
- Be specific to the given project analysis.
- Do NOT guess or hallucinate.
- If data is missing, say: "Not implemented in code".
- Output must be valid JSON ONLY (no markdown, no explanation).

STYLE:
- Write like real documentation.
- Each section should feel like a paragraph, not bullet fragments.

JSON FORMAT:

{{
  "system_purpose": "Explain clearly what the system does in 2-4 sentences.",

  "tech_stack": {{
    "backend": [],
    "frontend": [],
    "database": [],
    "libraries": []
  }},

  "modules": [
    {{
      "name": "",
      "responsibility": "Explain what this module does in full sentences.",
      "files": []
    }}
  ],

  "api_routes": [
    {{
      "route": "",
      "method": "",
      "description": "Explain what this endpoint does clearly."
    }}
  ],

  "data_flow": [
    "Explain step-by-step how data moves in the system."
  ],

  "architecture": "Describe system architecture in full sentences.",

  "security": [
    "Explain security implementations clearly."
  ],

  "improvements": [
    "Suggest meaningful improvements."
  ]
}}

PROJECT NAME:
{project_name}

ANALYSIS DATA:
{analysis}
"""