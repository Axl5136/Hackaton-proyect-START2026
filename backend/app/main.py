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
import math
import random

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

def generate_historical_data(base_value, risk_level):
    months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    data = []
    
    volatility = 0.9 if risk_level == "Alto" else 0.5
    
    for i in range(12):
        progress = i / 11
        
        # Lógica de Riesgo (Roja): Caída y caos
        loss_factor = 1 - (progress * 0.45)
        noise = (math.sin(i * 3) * 0.12) * volatility
        actual_val = round(base_value * (loss_factor + noise))
        
        # Lógica de Éxito (Azul): Crecimiento y estabilidad
        growth_factor = 1 + (progress * 0.35)
        success_noise = (math.cos(i * 2) * 0.03)
        projected_val = round(base_value * (growth_factor + success_noise))
        
        data.append({
            "name": months[i],
            "actual": max(actual_val, 0),
            "proyectado": projected_val
        })
    return data

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"status": "AquaNexus API Online 🚀", "version": "1.0.0"}

@app.get("/api/projects")
def get_projects():
    """Trae todos los proyectos para el mapa"""
    response = supabase.table("projects").select("*").execute()
    return response.data

@app.get("/api/projects/{project_id}/chart")
def get_project_chart(project_id: str):
    """Genera la data de la gráfica para un proyecto específico"""
    res = supabase.table("projects").select("market_cap, risk").eq("id", project_id).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    project = res.data[0]
    # Limpiamos el valor de market_cap si viene como string "$1.2M" -> 1200000
    base_val = 1000000 # Valor default por si falla el parseo
    try:
        # Aquí podrías usar una lógica similar a tu parseValue de JS
        base_val = float(str(project["market_cap"]).replace('$', '').replace('M', '000000').replace(',', ''))
    except:
        pass

    chart_data = generate_historical_data(base_val, project.get("risk", "Bajo"))
    return chart_data

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