# BookPage
Tarea1 Software Architecture Universidad de los andes (chile)

# acuerdese de instalar las dependencia:
npm install

# para instalar cassandra en linux (ubuntu 22.04L) :
# pre instalacion de cassandra

agregue los siguiente comando para añadir cassandra:

    echo "deb https://debian.cassandra.apache.org 41x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
    
    deb https://debian.cassandra.apache.org 41x main
    curl https://downloads.apache.org/cassandra/KEYS | sudo apt-key add -

paso 1:

    sudo apt update

paso 2:

    sudo apt install cassandra

paso 3:

    sudo service cassandra start

ya en el paso 3 estara activo cassandra

paso 4:

    sudo service cassandra status

Si ves un mensaje similar a "Active (running)", eso significa que Cassandra se ha instalado y está en funcionamiento correctamente.

para detener cassandra:

    sudo service cassandra stop

# librerìa para fake data
npm install express faker
npm install faker moment

# acuerdese 

de que en el app.js  y el app2.js debe estar el: const cassandra = require('cassandra-driver'); 

sino instalelo con el npm install cassandra-drive (o algo asi)

# para activar la pagina web
 debe ejecutar el siguiente comando en donde este el app2.js (dentro del proyecto):

    node app2.js

# para agregar un keyspace:

debe ejecutar el siguiente comando:

    cqlsh

Si tienes instalado Python, pero cqlsh no lo reconoce, intenta utilizar python3 en lugar de python para ejecutar cqlsh. Puedes hacerlo con el siguiente comando:

    python3 -m cqlsh

Si eso no funciona, también puedes intentar instalar cqlsh utilizando el administrador de paquetes pip, asegurándote de usar el mismo intérprete de Python que esté configurado para pip:

    pip install cqlsh

o:

    pip3 install cqlsh

ya dentro de la interfaz, escriba lo siguiente:

    CREATE KEYSPACE IF NOT EXISTS mi_keyspace
    WITH replication = {'class':'SimpleStrategy', 'replication_factor': 1};

si quiere verificar, que este correcto, ejecute el siguiente comando:

    DESCRIBE KEYSPACES;

para salir de la interfaz, simplemente escriba: 

    exit


si le sale esto:

    Servidor Express.js escuchando en el puerto 3000
    Conexión a Cassandra establecida
    Keyspace creado o ya existente
    Tabla creada o ya existente

es que ya esta correcto



# para agregar nuevos datos en la tabla (momentaneo)

agregar sales:

    curl -X POST -H "Content-Type: application/json" -d '{"id": 2, "book": "Nombre del libro", "year": "2023", "sales": 100}' http://localhost:3000/sales

agregar Authors:

    curl -X POST -H "Content-Type: application/json" -d '{"id": 2, "nombre": "Julio", "dateOfBirth": "18_de_gosto", "country": "Brasil", "shortDescription": "esunbuentipo"}' http://localhost:3000/Authors

agregar Reviews:

    curl -X POST -H "Content-Type: application/json" -d '{"id": 2, "book": "Nombre del libro", "review": "Reseña del libro", "score": 5, "numberOfVotes": 10}' http://localhost:3000/reviews

agregar Books:

    curl -X POST -H "Content-Type: application/json" -d '{"id": 2, "nombre": "Nombre del libro", "summary": "Resumen del libro", "dateOfPublication": "Fecha de publicación", "numberOfSales": 100}' http://localhost:3000/books


# navegacion

esta en el (en forma de tabla):

    http://localhost:3000/

tambien en el app2.js se pueden ver las distintas url

