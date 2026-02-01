from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
import secrets
import datetime
from dotenv import load_dotenv
import uvicorn
import uuid
import datetime

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
    """
    Proceso de compra: Cambia estatus, genera hash y registra la transacción
    """
    # 1. Verificar si el proyecto existe y está disponible
    project_res = supabase.table("projects").select("*").eq("id", request.project_id).execute()
    
    if not project_res.data:
        raise HTTPException(status_code=404, detail="El proyecto no existe en la base de datos.")
    
    project = project_res.data[0]
    
    if project["status"] == "Sold":
        raise HTTPException(status_code=400, detail="Este proyecto ya ha sido financiado por otra entidad.")

    # 2. SIMULACIÓN DE BLOCKCHAIN: Generar un Hash único de transacción
    # Usamos un UUID + un prefijo para que parezca un hash de Ledger/Ethereum
    tx_hash = f"0x{uuid.uuid4().hex}{uuid.uuid4().hex[:8]}"
    
    # 3. ACTUALIZACIÓN EN SUPABASE (El momento crítico)
    # Cambiamos status a 'Sold' y marcamos como verificado por IA
    update_res = supabase.table("projects").update({
        "status": "Sold", 
        "verified_by_ai": True
    }).eq("id", request.project_id).execute()
    
    # 4. REGISTRAR LA TRANSACCIÓN (Para el historial)
    transaction_data = {
        "project_id": request.project_id,
        "buyer_company": request.buyer_name,
        "amount_paid": float(project.get("price_per_credit", 0)) * project.get("water_savings_m3", 0),
        "transaction_hash": tx_hash,
        "timestamp": datetime.datetime.now().isoformat()
    }
    supabase.table("transactions").insert(transaction_data).execute()
    
    # 5. RESPUESTA PARA EL FRONTEND
    # Enviamos todo lo necesario para que Arturo cambie el color del pin y muestre el éxito
    return {
        "status": "success",
        "message": f"¡Créditos adquiridos para {project['name']}!",
        "data": {
            "project_id": request.project_id,
            "new_status": "Sold",
            "transaction_hash": tx_hash,
            "certificate_id": f"CERT-{request.project_id.upper()}-{datetime.datetime.now().year}",
            "impact_m3": project.get("water_savings_m3", 0),
            "co2_offset": f"{calculate_co2(project.get('water_savings_m3', 0))} Ton CO2e"
        }
    }