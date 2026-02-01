from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
import secrets
import datetime
from dotenv import load_dotenv

# 1. Configuración Inicial
load_dotenv() # Carga las claves del archivo .env

# OJO: Dile a tu dev que ponga esto en su archivo .env
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI()

# 2. Configurar CORS (Para que el Frontend de Arturo no sea bloqueado)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción esto se cambia, para hackathon déjalo así
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE DATOS (Pydantic) ---
class BuyRequest(BaseModel):
    project_id: str
    buyer_name: str = "Empresa Demo SA de CV"

# --- UTILIDADES ---
def generate_fake_blockchain_hash():
    """Genera un string hexadecimal que parece un hash de Ethereum"""
    return "0x" + secrets.token_hex(32)

def calculate_co2(water_m3):
    """Simulación de Climatiq: 1m3 agua ahorrada (bombeo) = 0.14 kg CO2e"""
    # Factor hardcodeado basado en promedio de energía de bombeo en México
    return round(water_m3 * 0.14 / 1000, 2) # Retorna Toneladas

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"status": "AquaNexus API Online 🚀"}

@app.get("/api/projects")
def get_projects():
    """Trae todos los ranchos para pintar el mapa"""
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
    """
    EL ENDPOINT CRÍTICO:
    1. Verifica que esté disponible.
    2. Lo marca como 'Sold'.
    3. Genera el Hash.
    4. Guarda la transacción.
    """
    
    # Paso A: Buscar el proyecto
    project_res = supabase.table("projects").select("*").eq("id", request.project_id).execute()
    
    if not project_res.data:
        raise HTTPException(status_code=404, detail="Proyecto no existe")
    
    project = project_res.data[0]
    
    if project["status"] != "Available":
        raise HTTPException(status_code=400, detail="Este proyecto ya fue financiado por otra empresa.")

    # Paso B: Generar el Hash "Blockchain"
    tx_hash = generate_fake_blockchain_hash()
    
    # Paso C: Actualizar estado del proyecto a 'Sold' (o 'Funded')
    supabase.table("projects").update({"status": "Sold", "verified_by_ai": True}).eq("id", request.project_id).execute()
    
    # Paso D: Guardar la transacción
    transaction_data = {
        "project_id": request.project_id,
        "buyer_company": request.buyer_name,
        "amount_paid": float(project["price_per_credit"]) * 1000, # Simulación de monto total
        "transaction_hash": tx_hash,
        "timestamp": datetime.datetime.now().isoformat()
    }
    supabase.table("transactions").insert(transaction_data).execute()
    
    # Paso E: Respuesta triunfal al Frontend
    return {
        "status": "success",
        "message": "Resiliencia Adquirida",
        "certificate": {
            "id": f"CERT-{request.project_id.upper()}-2026",
            "owner": request.buyer_name,
            "hash": tx_hash,
            "water_offset": f"{project['water_savings_m3']} m3",
            "co2_offset": f"{calculate_co2(project['water_savings_m3'])} Ton CO2e"
        }
    }