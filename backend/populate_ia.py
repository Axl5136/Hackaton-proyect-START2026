import os
import openai
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# Configuración
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_descriptions():
    # 1. Traer proyectos que no tengan descripción aún
    res = supabase.table("projects").select("*").is_("ai_description", "null").execute()
    projects = res.data

    if not projects:
        print("✅ Todos los proyectos ya tienen descripción de IA.")
        return

    print(f"🤖 Procesando {len(projects)} proyectos con OpenAI...")

    for p in projects:
        prompt = f"""
        Como experto en hidrología y sostenibilidad, escribe un insight técnico y motivador de máximo 200 caracteres para el proyecto '{p['name']}'.
        Datos clave:
        - Ahorro de agua: {p['water_savings_m3']} m3 anuales.
        - Nivel de riesgo hídrico en la zona: {p['risk_score']}%.
        - Ubicación: Coordenadas {p['lat']}, {p['lng']}.
        Enfócate en por qué es crítico invertir en este rancho específico para frenar el estrés hídrico.
        """

        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "Eres un analista de impacto ambiental de AquaNexus."},
                          {"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.7
            )
            
            insight = response.choices[0].message.content.strip()

            # 2. Guardar en Supabase
            supabase.table("projects").update({"ai_description": insight}).eq("id", p['id']).execute()
            print(f"✨ Descripción generada para: {p['name']}")

        except Exception as e:
            print(f"❌ Error en {p['name']}: {e}")

if __name__ == "__main__":
    generate_descriptions()