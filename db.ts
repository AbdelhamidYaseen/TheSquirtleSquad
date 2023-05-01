import mysql from "mysql";

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'thesquirtlesquad'
});

connection.connect((e) => {
    if(e){
        console.error(e.message);
        return;
    }
    console.log("Connectie gemaakt met de databank");
});

export default connection;