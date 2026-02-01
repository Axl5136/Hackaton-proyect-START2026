import ee
from google.oauth2 import service_account

# 1. Configuración de Acceso
KEY_FILE = 'service-account.json'
PROJECT_ID = "gee-backend-access"

try:
    creds = service_account.Credentials.from_service_account_file(
        KEY_FILE, scopes=['https://www.googleapis.com/auth/earthengine']
    )
    ee.Initialize(credentials=creds, project=PROJECT_ID)
    print("✅ Conexión establecida con Google Earth Engine")
except Exception as e:
    print(f"❌ Error al inicializar GEE: {e}")

# 2. Función para obtener la Serie de Tiempo (The Proof Maker)
def get_agricultural_metrics(lat, lon):
    point = ee.Geometry.Point([lon, lat])
    
    # Rango de fechas: últimos 6 meses para mostrar la evolución
    collection = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterBounds(point)
                  .filterDate('2025-08-01', '2026-01-31')
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .sort('system:time_start'))

    def process_image(img):
        # NDWI = (Verde - NIR) / (Verde + NIR) -> Sentinel-2: B3 y B8
        ndwi = img.normalizedDifference(['B3', 'B8']).rename('ndwi')
        # Reducción a la zona del rancho (buffer de 50m)
        stats = ndwi.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=point.buffer(50),
            scale=10
        )
        return ee.Feature(None, {
            'date': img.date().format('YYYY-MM-DD'),
            'ndwi': stats.get('ndwi')
        })

    # Ejecutar procesamiento en GEE
    raw_data = collection.map(process_image).getInfo()
    
    # Limpieza de datos para el Frontend
    time_series = []
    for feature in raw_data['features']:
        val = feature['properties']['ndwi']
        if val is not None:
            time_series.append({
                "date": feature['properties']['date'],
                "ndwi": round(val, 4)
            })

    # Resultado final para el Auditor (Inversionista)
    latest_val = time_series[-1]['ndwi'] if time_series else 0
    return {
        "location": {"lat": lat, "lon": lon},
        "current_metrics": {
            "ndwi": latest_val,
            "status": "Ahorro Verificado" if latest_val < 0.3 else "Riesgo de Desperdicio",
            "verification_date": "2026-01-31"
        },
        "history": time_series  # Esto es lo que alimenta la gráfica de Arturo
    }

# 3. Datos de los 5 Ranchos Críticos (Responsabilidad Rol 2)
RANCHOS_SEED = [
    {"name": "Rancho El Bajío (GTO)", "lat": 20.5235, "lon": -100.8157},
    {"name": "Agrícola Galeana (NL)", "lat": 24.8250, "lon": -100.0711},
    {"name": "Cítricos Montemorelos (NL)", "lat": 25.1872, "lon": -99.8251},
    {"name": "Parcela Pénjamo (GTO)", "lat": 20.4300, "lon": -101.7200},
    {"name": "Desierto Dr. Arroyo (NL)", "lat": 23.6732, "lon": -100.1812}
]

if __name__ == "__main__":
    print("\n--- AUDITORÍA SATELITAL AQUANEXUS ---")
    # Probamos con el primer rancho de la lista
    rancho = RANCHOS_SEED[0]
    reporte = get_agricultural_metrics(rancho['lat'], rancho['lon'])
    
    print(f"Proyecto: {rancho['name']}")
    print(f"Estado Actual: {reporte['current_metrics']['status']}")
    print(f"Puntos detectados para la gráfica: {len(reporte['history'])}")
    print(f"Último JSON de historia: {reporte['history'][-1]}")