from flask import Flask, jsonify
from flask_cors import CORS
import requests
from datetime import datetime
import pytz

app = Flask(__name__)
CORS(app)

# Coordenadas de Presidente Prudente, SP
LATITUDE  = -22.1256
LONGITUDE = -51.4193
TIMEZONE  = "America/Sao_Paulo"

# Mapa de códigos de clima para descrição e emoji
WEATHER_MAP = {

    0:  {"description": "Céu limpo", "icon": "☀️", "emoji": "01d"},
    1:  {"description": "Principalmente claro", "icon": "🌤️", "emoji": "02d"},
    2:  {"description": "Parcialmente nublado", "icon": "⛅", "emoji": "03d"},
    3:  {"description": "Nublado", "icon": "☁️", "emoji": "04d"},
    45: {"description": "Neblina", "icon": "🌫️", "emoji": "50d"},
    48: {"description": "Neblina com geada", "icon": "🌫️", "emoji": "50d"},
    51: {"description": "Garoa leve", "icon": "🌦️", "emoji": "09d"},
    53: {"description": "Garoa moderada", "icon": "🌦️", "emoji": "09d"},
    55: {"description": "Garoa densa", "icon": "🌧️", "emoji": "09d"},
    61: {"description": "Chuva leve", "icon": "🌦️", "emoji": "10d"},
    63: {"description": "Chuva moderada", "icon": "🌧️", "emoji": "10d"},
    65: {"description": "Chuva forte", "icon": "⛈️", "emoji": "10d"},
    71: {"description": "Neve leve", "icon": "❄️", "emoji": "13d"},
    73: {"description": "Neve moderada", "icon": "❄️", "emoji": "13d"},
    75: {"description": "Neve forte", "icon": "❄️", "emoji": "13d"},
    77: {"description": "Granizo", "icon": "🌨️", "emoji": "13d"},
    80: {"description": "Chuva leve", "icon": "🌦️", "emoji": "10d"},
    81: {"description": "Chuva moderada", "icon": "🌧️", "emoji": "10d"},
    82: {"description": "Chuva forte", "icon": "⛈️", "emoji": "10d"},
    85: {"description": "Neve leve", "icon": "❄️", "emoji": "13d"},
    86: {"description": "Neve forte", "icon": "❄️", "emoji": "13d"},
    95: {"description": "Tempestade", "icon": "⛈️", "emoji": "11d"},
    96: {"description": "Tempestade com granizo", "icon": "⛈️", "emoji": "11d"},
    99: {"description": "Tempestade forte", "icon": "⛈️", "emoji": "11d"},
}

def get_day_name(date_string):

    """Retorna o nome do dia da semana em português"""
    date = datetime.fromisoformat(date_string)
    days = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]

    return days[date.weekday()]

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """
    Retorna previsão do tempo para os próximos 7 dias
    """
    try:
        # Buscar dados da Open-Meteo
        url    = f"https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": LATITUDE,
            "longitude": LONGITUDE,
            "daily": "weather_code,temperature_2m_max,temperature_2m_min",
            "timezone": TIMEZONE
        }
        
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data     = response.json()
        
        # Processar dados para formato mais simples
        daily         = data.get("daily", {})
        weather_codes = daily.get("weather_code", [])
        temps_max     = daily.get("temperature_2m_max", [])
        temps_min     = daily.get("temperature_2m_min", [])
        dates         = daily.get("time", [])
        
        forecast = []
        for i in range(min(6, len(dates))):  # Próximos 6 dias

            code = weather_codes[i]
            weather_info = WEATHER_MAP.get(code, WEATHER_MAP[3])  # Default: nublado
            
            forecast.append({

                "day":          get_day_name(dates[i]),
                "date":         dates[i],
                "temp_max":     round(temps_max[i]),
                "temp_min":     round(temps_min[i]),
                "weather_code": code,
                "description":  weather_info["description"],
                "icon":         weather_info["icon"],
                "emoji":        weather_info["emoji"]
            })
        
        return jsonify({

            "status":    "success",
            "location":  "Presidente Prudente, SP",
            "latitude":  LATITUDE,
            "longitude": LONGITUDE,
            "forecast":  forecast
        })
    
    except requests.exceptions.RequestException as e:

        return jsonify({

            "status":  "error",
            "message": f"Erro ao buscar dados: {str(e)}"
        }), 500
    
    except Exception as e:

        return jsonify({

            "status":  "error",
            "message": f"Erro interno: {str(e)}"
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
