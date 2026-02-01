from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
import secrets
import datetime
from dotenv import load_dotenv
import uvicorn

# Esto le dice a Python: "busca el archivo .env en la misma carpeta donde estoy parado"
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, "../.env")) 

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("⚠️ ¡Error! Falta SUPABASE_URL o SUPABASE_KEY en el archivo .env")

supabase: Client = create_client(url, key)

app = FastAPI(title="AquaNexus API")

# 2. Configurar CORS - Vital para la conexión con el Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE DATOS ---
class BuyRequest(BaseModel):
    project_id: str
    buyer_name: str = "Empresa Demo SA de CV"

# --- UTILIDADES ---
def generate_fake_blockchain_hash():
    return "0x" + secrets.token_hex(32)

def calculate_co2(water_m3):
    # 1m3 agua ahorrada = 0.14 kg CO2e -> Convertido a Toneladas
    return round(water_m3 * 0.14 / 1000, 4)

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"status": "AquaNexus API Online 🚀", "version": "1.0.0"}

@app.get("/api/projects")
def get_projects():
    """Trae todos los proyectos para el mapa"""
    response = supabase.table("projects").select("*").execute()
    return response.data

@app.get("/api/projects/{project_id}")
def get_project_detail(project_id: str):
    """Detalle para el Modal"""
    response = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return response.data[0]

@app.post("/api/buy-credits")
def buy_credits(request: BuyRequest):
    """Proceso de compra y generación de certificado"""
    
    # Buscar proyecto
    project_res = supabase.table("projects").select("*").eq("id", request.project_id).execute()
    
    if not project_res.data:
        raise HTTPException(status_code=404, detail="Proyecto no existe")
    
    project = project_res.data[0]
    
    if project["status"] != "Available":
        raise HTTPException(status_code=400, detail="Este proyecto ya fue financiado.")

    tx_hash = generate_fake_blockchain_hash()
    
    # Actualizar proyecto
    supabase.table("projects").update({"status": "Sold", "verified_by_ai": True}).eq("id", request.project_id).execute()
    
    # Registrar transacción
    transaction_data = {
        "project_id": request.project_id,
        "buyer_company": request.buyer_name,
        "amount_paid": float(project.get("price_per_credit", 0)) * 1000,
        "transaction_hash": tx_hash,
        "timestamp": datetime.datetime.now().isoformat()
    }
    supabase.table("transactions").insert(transaction_data).execute()
    
    # ESTE ES EL BLOQUE QUE DABA ERROR, ASEGÚRATE QUE LAS LLAVES COINCIDAN
    return {
        "status": "success",
        "message": "Resiliencia Adquirida",
        "certificate": {
            "id": f"CERT-{request.project_id.upper()}-2026",
            "owner": request.buyer_name,
            "hash": tx_hash,
            "water_offset": f"{project.get('water_savings_m3', 0)} m3",
            "co2_offset": f"{calculate_co2(project.get('water_savings_m3', 0))} Ton CO2e"
        }
    } # <-- Aquí se cierran todas