import { useEffect, useState } from 'react' // Importa esto arriba
import { supabase } from './supabase'       // Importa tu cliente

function App() {
  const [conexion, setConexion] = useState('Comprobando conexión...')

  useEffect(() => {
    async function checkSupabase() {
      // Intentamos pedir la sesión actual (aunque no haya usuario logueado, esto prueba la conexión)
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setConexion('Error al conectar con Supabase 🔴')
        console.error(error)
      } else {
        setConexion('¡Conectado a Supabase correctamente! 🟢')
        console.log('Supabase responde:', data)
      }
    }
    checkSupabase()
  }, [])
  return (
    <div className="mt-6 text-xs text-slate-400">
      {conexion}

      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200">

          {/* Ícono o Logo simulado */}
          <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-3xl">
            💧
          </div>

          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
            AquaNexus
          </h1>

          <p className="text-slate-500 mb-6">
            Frontend configurado con éxito. <br />
            <span className="text-blue-500 font-medium">React + Tailwind v3</span>
          </p>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md shadow-blue-500/30">
              Iniciar Sesión
            </button>

            <button className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-300 transition-colors">
              Crear Cuenta
            </button>
          </div>

          <div className="mt-6 text-xs text-slate-400">
            Esperando conexión con FastAPI...
          </div>
        </div>
      </div>
    </div>
  )
}

export default App