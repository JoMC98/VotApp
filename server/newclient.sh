rutaIP="/etc/openvpn/gesOVPN/server-VotApp/cld"
cd openvpn/clients

echo -e "----> START <----\n"
echo "---- Creando perfil opvn ----"
bucle=true
while $bucle
do
    gesovpn
    for file in ./*.ovpn; do 
        if [ -f "${file}" ]; then 
            bucle=false
            break
        fi
    done
done
echo -e "---- Perfil creado ----\n"

echo "---- Generando zip de configuración ----"
while true
do
    zip -P VotApp1234 votapp.zip *.ovpn ca.crt > /dev/null
    if [ -f votapp.zip ]; then 
        break
    fi
done
chmod 777 votapp.zip
rm *.ovpn
echo -e "---- Zip generado ----\n"

# echo "---- Guardando datos en BBDD ----"
# while true
# do
#     echo "Introduce el DNI: "
#     read DNI
#     IP=$(cat $rutaIP/$DNI | cut -d" " -f2)
#     if [ "$IP" != "" ]; then
#         node ../storeIP.js $DNI $IP
#         res=$(echo $?)
#         if [ $res == '0' ]; then
#             break;
#         fi
#     fi
#     echo "***** ERROR AL INTRODUCIR EL DNI *****"
# done
# echo -e "---- Datos guardados en BBDD ----\n"

echo "---- Enviando correo ----"

while true
do
    echo "Introduce el DNI: "
    read DNI
    node ../mail.js $DNI
    res=$(echo $?)

    if [[ "$res" == '0' ]]; then
        break
    fi
    echo "***** ERROR AL INTRODUCIR EL DNI *****"
done
echo -e "---- Correo enviado ----\n"

echo "---- Eliminando ficheros ----"
rm *.zip
echo -e "---- Ficheros eliminados ----\n"
echo "----> END <----"