from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File, Form
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
import os
import uuid
import zipfile
import json

from database import SessionLocal
from models import Project, User
from security import decode_access_token

from utils.file_reader import group_files_by_language
from utils.file_content_reader import read_project_files
from utils.code_structure_analyzer import analyze_project_files
from utils.prompt_builder import build_prompt
from utils.llm_client import generate_documentation
from utils.doc_exporter import export_pdf, export_docx
from services.github_service import clone_github_repo

router = APIRouter(prefix="/projects", tags=["Projects"])


# ================= DATABASE =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================= AUTH =================
def get_current_user(authorization: str, db: Session):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = authorization.split(" ")[1]
    email = decode_access_token(token)

    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# ✅ CLEAN DEPENDENCY WRAPPER (IMPORTANT FIX)
def get_current_user_dep(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    return get_current_user(authorization, db)


# ================= HELPERS =================
def clean_llm_json(docs: str) -> str:
    if docs.startswith("```"):
        docs = docs.replace("```json", "").replace("```", "").strip()

    start = docs.find("{")
    end = docs.rfind("}")

    if start != -1 and end != -1:
        return docs[start:end + 1]

    raise HTTPException(status_code=500, detail="Invalid AI response format")


def parse_docs(docs: str) -> dict:
    try:
        return json.loads(docs)
    except:
        raise HTTPException(status_code=500, detail="JSON parsing failed")


def format_docs_text(data: dict) -> str:
    text = ""

    text += f"SYSTEM PURPOSE:\n{data.get('system_purpose', '')}\n\n"

    text += "TECH STACK:\n"
    for k, v in data.get("tech_stack", {}).items():
        text += f"- {k}: {', '.join(v) if v else 'Not implemented'}\n"
    text += "\n"

    text += "MODULES:\n"
    for m in data.get("modules", []):
        text += f"{m.get('name')}:\n"
        text += f"  {m.get('responsibility')}\n"
        text += f"  Files: {', '.join(m.get('files', []))}\n\n"

    text += "API ROUTES:\n"
    for api in data.get("api_routes", []):
        text += f"- {api.get('method')} {api.get('route')}: {api.get('description')}\n"
    text += "\n"

    text += "DATA FLOW:\n"
    for d in data.get("data_flow", []):
        text += f"- {d}\n"
    text += "\n"

    text += f"ARCHITECTURE:\n{data.get('architecture', '')}\n\n"

    text += "SECURITY:\n"
    for s in data.get("security", []):
        text += f"- {s}\n"
    text += "\n"

    text += "IMPROVEMENTS:\n"
    for i in data.get("improvements", []):
        text += f"- {i}\n"

    return text


# ================= ROUTES =================

@router.post("/create")
def create_project(
    name: str = Form(...),
    repo_url: str = Form(None),
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(authorization, db)

    project = Project(name=name, repo_url=repo_url, user_id=user.id)
    db.add(project)
    db.commit()
    db.refresh(project)

    return {"message": "Project created 🚀", "project_id": project.id}


@router.get("/my")   # ✅ FIXED ROUTE
def get_my_projects(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_dep)
):
    projects = db.query(Project).filter(Project.user_id == user.id).all()

    return [
        {
            "id": p.id,
            "name": p.name,
            "repo_url": p.repo_url,
        }
        for p in projects
    ]


@router.post("/github/{project_id}")
def clone_github_project(
    project_id: int,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(authorization, db)

    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user.id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    repo_path = clone_github_repo(project.repo_url)
    project.extracted_path = repo_path
    db.commit()

    return {"message": "Repo cloned 🚀"}


@router.post("/upload/{project_id}")
async def upload_project_zip(
    project_id: int,
    file: UploadFile = File(...),
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(authorization, db)

    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user.id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    os.makedirs("uploads/projects", exist_ok=True)
    os.makedirs("uploads/extracted", exist_ok=True)

    uid = str(uuid.uuid4())
    zip_path = f"uploads/projects/{uid}.zip"
    extract_path = f"uploads/extracted/{uid}"

    with open(zip_path, "wb") as f:
        f.write(await file.read())

    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(extract_path)

    project.zip_path = zip_path
    project.extracted_path = extract_path
    db.commit()

    return {"message": "ZIP uploaded 📦"}


@router.get("/{project_id}/analysis")
def analyze_project(
    project_id: int,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(authorization, db)

    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user.id
    ).first()

    if not project or not project.extracted_path:
        raise HTTPException(status_code=404, detail="Project not ready")

    grouped = group_files_by_language(project.extracted_path)
    files = read_project_files(grouped)
    analysis = analyze_project_files(files)

    return {"analysis": analysis}


@router.get("/{project_id}/docs")
def generate_docs(
    project_id: int,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(authorization, db)

    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user.id
    ).first()

    if not project or not project.extracted_path:
        raise HTTPException(status_code=404, detail="Project not ready")

    from utils.code_analyzer import analyze_codebase

    analysis = analyze_codebase(project.extracted_path)
    prompt = build_prompt(project.name, analysis)

    docs = generate_documentation(prompt)
    cleaned = clean_llm_json(docs)

    return {
        "project_id": project.id,
        "documentation": cleaned
    }


@router.get("/{project_id}/export")
def export_docs(
    project_id: int,
    format: str,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(authorization, db)

    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user.id
    ).first()

    if not project or not project.extracted_path:
        raise HTTPException(status_code=404, detail="Project not ready")

    from utils.code_analyzer import analyze_codebase

    analysis = analyze_codebase(project.extracted_path)
    prompt = build_prompt(project.name, analysis)

    docs = generate_documentation(prompt)
    cleaned = clean_llm_json(docs)
    parsed = parse_docs(cleaned)
    formatted_text = format_docs_text(parsed)

    os.makedirs("exports", exist_ok=True)

    if format == "pdf":
        path = f"exports/{project.id}.pdf"
        export_pdf(project.name, formatted_text, path)

    elif format == "docx":
        path = f"exports/{project.id}.docx"
        export_docx(project.name, formatted_text, path)

    else:
        raise HTTPException(status_code=400, detail="Invalid format")

    return FileResponse(path, filename=os.path.basename(path))