import connection from "../db";

// Declareer een interface voor een gebruiker; dit zou gelijk moeten zijn met welke kolommen er zijn in de database.
interface iUserExample {
    id: number; // er is dus een id veld in de database
    name: string; // en een name veld in de database
}

// Maak de functie aan die je nodig hebt in dit geval om alle gebruikers uit de database op te vragen
const getAllUsers = (): Promise<iUserExample[]> => {
    return new Promise((resolve, reject) => {
        // Hier schrijf je dus gewoon je sql statement
        connection.query('SELECT * FROM users', (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

// Exporteer hier al je funcites en interfaces die je hier hebt aangemaakt
export { iUserExample, getAllUsers };