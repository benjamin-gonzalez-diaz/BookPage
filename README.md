# BookPage
Tarea2 Software Architecture Universidad de los andes (chile)
# ----------------------------------------------------------------------------
# La base de datos de cassandra estara lista despues de 2 minutos, de que se haya hecho el docker-compose up,
# por favor espere
# ----------------------------------------------------------------------------
# Instalacion usando Docker
> Armar las imagenes

+ `docker compose build`

> Correr las imagenes

+ `docker compose up`

> Manera recomendada de correrlo

+ `docker compose up cassandra -d` -> Esperar hasta que cassandra cree el role cassandra
+ `docker compose up book_app -d`

# posibles errores con docker-compose:
si  aparece este error:

    book_app   | Servidor Express.js escuchando en el puerto 3000
    book_app   | Puede acceder en http://localhost:3000/
    book_app   | Could't establish connection
    book_app   | NoHostAvailableError: All host(s) tried for query failed. First host tried, 172.18.0.2:9042: Error: connect ECONNREFUSED 172.18.0.2:9042
    book_app   |     at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1495:16) {
    book_app   |   errno: -111,
    book_app   |   code: 'ECONNREFUSED',
    book_app   |   syscall: 'connect',
    book_app   |   address: '172.18.0.2',
    book_app   |   port: 9042
    book_app   | }. See innerErrors.
    book_app   |     at ControlConnection._borrowFirstConnection (/app/node_modules/cassandra-driver/lib/control-connection.js:307:15)
    book_app   |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    book_app   |     at async ControlConnection._initializeConnection (/app/node_modules/cassandra-driver/lib/control-connection.js:526:7)
    book_app   |     at async ControlConnection.init (/app/node_modules/cassandra-driver/lib/control-connection.js:212:5)
    book_app   |     at async Client._connect (/app/node_modules/cassandra-driver/lib/client.js:513:5) {
    book_app   |   info: 'Represents an error when a query cannot be performed because no host is available or could be reached by the driver.',
    book_app   |   innerErrors: {
    book_app   |     '172.18.0.2:9042': Error: connect ECONNREFUSED 172.18.0.2:9042
    book_app   |         at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1495:16) {
    book_app   |       errno: -111,
    book_app   |       code: 'ECONNREFUSED',
    book_app   |       syscall: 'connect',
    book_app   |       address: '172.18.0.2',
    book_app   |       port: 9042
    book_app   |     }
    book_app   |   }
    book_app   | }

tiene que hacer lo siguiente:

    sudo docker ps -a

Esto te mostrará una lista de todos los contenedores, incluido el de Cassandra. Busca el contenedor de Cassandra y toma nota de su nombre o ID.

Luego, inicia el contenedor de Cassandra con el siguiente comando, reemplazando <nombre_contenedor> con el nombre o el ID del contenedor que encontraste:

    sudo docker start cassandra 

Una vez que hayas iniciado el contenedor de Cassandra, puedes ejecutar nuevamente el comando nodetool status para verificar el estado de Cassandra:

    sudo docker exec -it cassandra nodetool status

Deberías ver la información sobre los nodos de Cassandra y su estado. Si Cassandra está funcionando correctamente, tu aplicación Docker debería poder conectarse a ella sin problemas.

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



# para agregar nuevos datos en la tabla (por terminal)

agregar sales:

    curl -X POST -H "Content-Type: application/json" -d '{"id": 2, "book": "Nombre del libro", "year": "2023", "sales": 100}' http://localhost:3000/salesbyyear

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
si se quiere poblar las tablas debe hacer click en:

     http://localhost:3000/populate 

y esperar unos segundos para que se llenen bien


#  Nota

si quiere llenar otro keyspace debera ir al archivo:

    BookPage/db/connection.js

y cambiar esta variable:

    const keyspace = "ks96";

por otra, por ejemplo:

    const keyspace = "ks50";

es muy probable que en la pagina salesbyyear, se quede cargando mucho rato (tiene aproximadamente 1700 datos), por lo que o puede esperar o cancelar la carga de la pagina (que seria lo mejor). del CRUD, el create se muestra cuando se termina de cargar la pagina, pero como se demora bastante es probable que no se note

tambien puede verificar metiendose a la interfaz de cassandra con el siguiente comando:

    cqlsh

o:

    python3 -m cqlsh

y aqui ver si se agrego bien 

#  errores:

si es que sale este error:

    error creating Author table: ResponseError: No keyspace has been specified. USE a keyspace, or explicitly specify keyspace.tablename
    Error executing queries: ResponseError: No keyspace has been specified. USE a keyspace, or explicitly specify keyspace.tablename
        at FrameReader.readError (/home/ubuntudelete/Escritorio/software architecture/Express respaldo/BookPage/node_modules/cassandra-driver/lib/readers.js:389:17)
        at Parser.parseBody (/home/ubuntudelete/Escritorio/software architecture/Express respaldo/BookPage/node_modules/cassandra-driver/lib/streams.js:209:66)
        at Parser._transform (/home/ubuntudelete/Escritorio/software architecture/Express respaldo/BookPage/node_modules/cassandra-driver/lib/streams.js:152:10)
        at Parser.Transform._read (_stream_transform.js:191:10)
        at Parser.Transform._write (_stream_transform.js:179:12)
        at doWrite (_stream_writable.js:403:12)
        at writeOrBuffer (_stream_writable.js:387:5)
        at Parser.Writable.write (_stream_writable.js:318:11)
        at Protocol.ondata (_stream_readable.js:718:22)
        at Protocol.emit (events.js:314:20) {
    info: 'Represents an error message from the server',
    code: 8704,
    coordinator: '127.0.0.1:9042',
    query: '\n' +
        '    CREATE TABLE IF NOT EXISTS authors (\n' +
        '        id int PRIMARY KEY,\n' +
        '        nombre TEXT,\n' +
        '        dateOfBirth TEXT,\n' +
        '        country TEXT,\n' +
        '        shortDescription TEXT,\n' +
        '    )\n' +
        '    '
    }
    error creating SalesByYear table: ResponseError: No keyspace has been specified. USE a keyspace, or explicitly specify keyspace.tablename
    error creating authorbooks table: ResponseError: No keyspace has been specified. USE a keyspace, or explicitly specify keyspace.tablename
    error creating Reviews table: ResponseError: No keyspace has been specified. USE a keyspace, or explicitly specify keyspace.tablename

vuelva a usar el comando:

    node app2.js

ya que se esta intentando cargar las tablas antes de crearlas o rellenarlas
