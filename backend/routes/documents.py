from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.models import Document
from database.config import get_db
from backend.services.auth import get_current_user

router = APIRouter(prefix="/documents")

class DocumentResponse(BaseModel):
    id: UUID
    user_id: UUID
    filename: str
    status: str
    chunk_count: int
    created_at: str

    class Config:
        orm_mode = True

async def process_uploaded_document(file: UploadFile, user_id: UUID, db: Session):
    """
    Process the uploaded document and save it to the database.
    """
    # Placeholder implementation for processing the document
    document = Document(
        user_id=user_id,
        filename=file.filename,
        status="processing",
        chunk_count=0,
        created_at="2023-01-01T00:00:00Z"  # Example timestamp
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

def delete_document_by_id(document_id: UUID, user_id: UUID, db: Session):
    """
    Delete a document by its ID if it belongs to the user.
    """
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == user_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
    db.delete(document)
    db.commit()

@router.post("/upload", operation_id="uploadDocument", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload a document for processing.
    """
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must have a valid name.")
    
    try:
        await process_uploaded_document(file, current_user["id"], db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/", operation_id="listDocuments", response_model=List[DocumentResponse])
def list_documents(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    List all documents uploaded by the current user.
    """
    documents = db.query(Document).filter(Document.user_id == current_user["id"]).all()
    return documents

@router.delete("/{id}", operation_id="deleteDocument", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a document by its ID.
    """
    try:
        delete_document_by_id(id, current_user["id"], db)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))