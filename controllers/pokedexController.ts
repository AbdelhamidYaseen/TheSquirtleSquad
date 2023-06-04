import express from 'express';
import { getAllCaughtPokemonFromUser, getBuddyFromUser } from '../models/caughtPokemonModel';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';

let userId: number=0;
const controller = {
    get: async (req: express.Request, res: express.Response) => {
        try {
            // get user id from cookies
            const cookie  = req.headers.cookie;
            // Split the cookie string and extract the user ID from the 'userid' cookie
            if (cookie) {
                const cookies = cookie.split(';').map((cookieString) => cookieString.trim());
                const userIdCookie = cookies.find((cookieString) => cookieString.startsWith('userid='));
                
                if (userIdCookie) {
                    const userIdCookieValue = userIdCookie.split('=')[1];
                    userId = parseInt(userIdCookieValue);
                }
            }
            const pageNumber = 1;
            const pageSize = 18;
            let buddyStatus = true;
            
            // Retrieve all caught pokémon for the user from the database
            const pokemonInDB = await getAllCaughtPokemonFromUser(userId);
            // Retrieve user information from the database
            const user : iUser = await getUserById(userId);

            const apiRes: iPokemon[] = await Promise.all(
                // Fetch data for 151 pokémon from the PokeAPI
                Array.from({ length: 151 }, (_,i) =>
                    fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((response) =>
                        response.json()
                    )
                )
            );

            const pokemonData = await Promise.all(apiRes);

            // Filter and map the fetched pokémon data to create a paginated list
            const paginatedEntries: iPokemon[] = pokemonData.filter((apiData) => apiData !== null).map((apiData) => {
                // Check if the pokémon is caught by the user
                const caught = pokemonInDB.some((pokemon) => pokemon.pokemon_id === apiData.id);
                return {
                    id: apiData.id,
                    name: apiData.name,
                    sprites: apiData.sprites,
                    caught: caught,
                };
            }).slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
            
            // Check if the requested page number is valid
            if (pageNumber > Math.ceil(pokemonData.length / pageSize)) {
                return res.status(500).send('Internal Server Error');
            }
            // Retrieve the user's buddy pokémon from the database
            const getBuddy = await getBuddyFromUser(userId);

            // Fetch data for the user's buddy pokémon from the PokeAPI
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            // Render the 'pokedex' template with the necessary data
            return res.render('pokedex', { user: user, pokemon: paginatedEntries, currentPageNumer: pageNumber, totalPages: Math.ceil(pokemonData.length / pageSize), buddy: apiFetchBuddy ,getBuddyFromUser, buddyInfo : getBuddy, buddyStatus})
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    },
    getPage: async (req: express.Request, res: express.Response) => {
        try {
            // Retrieve user information from the database.
            const cookie  = req.headers.cookie;
            // Split the cookie string and extract the user ID from the 'userid' cookie
            if (cookie) {
                const cookies = cookie.split(';').map((cookieString) => cookieString.trim());
                const userIdCookie = cookies.find((cookieString) => cookieString.startsWith('userid='));
                
                if (userIdCookie) {
                    const userIdCookieValue = userIdCookie.split('=')[1];
                    userId = parseInt(userIdCookieValue);
                }
            }
            const user : iUser = await getUserById(userId);
            let buddyStatus = true;
            const pageNumber = parseInt(req.params.pagenumber);
            const pageSize = 18;
            const pokemonInDB = await getAllCaughtPokemonFromUser(userId);

            // Fetch data for 151 pokémon from the PokeAPI
            const apiRes: iPokemon[] = await Promise.all(
                Array.from({ length: 151 }, (_, i) =>
                    fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((response) =>
                        response.json()
                    )
                )
            );

            // Retrieve the user's buddy pokémon from the database
            const getBuddy = await getBuddyFromUser(userId);
            // Fetch data for the user's buddy pokémon from the PokeAPI
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            const pokemonData = await Promise.all(apiRes);
            
            // Filter and map the fetched pokémon data to create a paginated list
            const paginatedEntries: iPokemon[] = pokemonData.filter((apiData) => apiData !== null).map((apiData) => {
                // Check if the pokémon is caught by the user
                const caught = pokemonInDB.some(
                    (pokemon) => pokemon.pokemon_id === apiData.id
                );
                return {
                    id: apiData.id,
                    name: apiData.name,
                    sprites: apiData.sprites,
                    caught: caught,
                };
            }).slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

            // Check if the requested page number is valid
            if (pageNumber > Math.ceil(pokemonData.length / pageSize)) {
                return res.status(500).send('Internal Server Error');
            }
            // Render the 'pokedex' template with the necessary data
            return res.render('pokedex', { user: user, pokemon: paginatedEntries, currentPageNumer: pageNumber, totalPages: Math.ceil(pokemonData.length / pageSize), buddy: apiFetchBuddy, getBuddyFromUser, buddyStatus, buddyInfo : getBuddy});
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    },
}

export default controller;