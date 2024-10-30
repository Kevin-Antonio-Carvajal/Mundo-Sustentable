#!/bin/bash

# Definir los puertos que usan tus aplicaciones
declare -a ports=("3000" "5000")

# Función para matar procesos que ocupan un puerto específico
kill_port() {
    echo "Liberando el puerto: $1"
    # Usar lsof para encontrar el PID del proceso que escucha en el puerto dado
    PID=$(lsof -ti:$1)
    if [ ! -z "$PID" ]; then
        # Si encontramos un PID, usamos kill para terminar el proceso
        kill -9 $PID
        echo "Proceso en puerto $1 terminado."
    else
        echo "Ningún proceso encontrado en el puerto $1."
    fi
}

# Iterar sobre cada puerto y ejecutar la función kill_port
for port in "${ports[@]}"; do
    kill_port $port
done

echo "Procesos terminados."