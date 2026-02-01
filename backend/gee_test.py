import ee
from google.oauth2 import service_account

# El nombre debe coincidir exactamente con tu archivo en VS Code
KEY_FILE = 'service-account.json' 

def test_gee_connection():
    try:
        # 1. Cargar credenciales desde el JSON
        creds = service_account.Credentials.from_service_account_file(
            KEY_FILE, 
            scopes=['https://www.googleapis.com/auth/earthengine']
        )
        
        # 2. Inicializar (GEE extraerá el project_id del JSON automáticamente)
        ee.Initialize(credentials=creds)
        
        # 3. Prueba de fuego: Pedir un dato simple a Google
        # Obtenemos la elevación de un punto aleatorio para verificar conexión
        dem = ee.Image('USGS/SRTMGL1_003')
        value = dem.sample(ee.Geometry.Point([-100, 25]), 30).first().get('elevation').getInfo()
        
        print(f"✅ ¡Éxito! Conexión establecida. Dato de prueba: {value}m")
        print("AquaNexus ya puede acceder a datos satelitales.")

    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        print("Revisa si habilitaste la 'Earth Engine API' en la consola de Google Cloud.")

if __name__ == "__main__":
    test_gee_connection()