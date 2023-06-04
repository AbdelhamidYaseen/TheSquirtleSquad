import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { getBuddyFromUser } from '../models/caughtPokemonModel';
import { iPokemon } from '../types';

let userId: number=0;
const controller = {
    get: async (req: express.Request, res: express.Response) => {
        try {
            // Get user id from cookies
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
            // Retrieve user information from the database
            const user : iUser = await getUserById(userId);
            // Retrieve all caught pokémon for the user from the database
            const getBuddy = await getBuddyFromUser(userId);
            let buddyStatus = true;
            // Fetch the buddy Pokémon details from the PokeAPI
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            // Check for invalid Pokemon query parameter
            const invalidPokemon = req.query.invalidPokemon === "true";
            // Retrieve query parameters for Pokemon 1 and Pokemon 2
            const queryPokemon1 = req.query.pokemon1;
            const queryPokemon2 = req.query.pokemon2;

            if(queryPokemon1 && queryPokemon2){
                // Fetch Pokemon 1 details from the PokeAPI
                const pokemon1FromApi = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${queryPokemon1}`)).json();
                 // Prepare the updated Pokemon 1 object with necessary details
                const pokemon1Updated: iPokemon = {
                    id: pokemon1FromApi.id,
                    name: pokemon1FromApi.name,
                    sprites: pokemon1FromApi.sprites,
                    ability: pokemon1FromApi.abilities,
                    baseStats: pokemon1FromApi.stats.map((stat: any) => {
                        let modifiedName: string;
                        switch (stat.stat.name) {
                            case 'hp':
                                modifiedName = 'HP';
                                break;
                            case 'attack':
                                modifiedName = 'ATK';
                                break;
                            case 'defense':
                                modifiedName = 'DEF';
                                break;
                            case 'special-attack':
                                modifiedName = 'SATK';
                                break;
                            case 'special-defense':
                                modifiedName = 'SDEF';
                                break;
                            case 'speed':
                                modifiedName = 'SPD';
                                break;
                            default:
                                modifiedName = stat.statName;
                                break;
                        }
                        return {
                            ...stat,
                            statName: modifiedName,
                        };
                    }),
                    height: pokemon1FromApi.height / 10,
                    weight: pokemon1FromApi.weight / 10,
                    types: pokemon1FromApi.types,
                };

                // Fetch Pokemon 2 details from the PokeAPI
                const pokemon2FromApi = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${queryPokemon2}`)).json();
                // Prepare the updated Pokemon 2 object with necessary details
                const pokemon2Updated: iPokemon = {
                    id: pokemon2FromApi.id,
                    name: pokemon2FromApi.name,
                    sprites: pokemon2FromApi.sprites,
                    ability: pokemon2FromApi.abilities,
                    baseStats: pokemon2FromApi.stats.map((stat: any) => {
                        let modifiedName: string;
                        switch (stat.stat.name) {
                            case 'hp':
                                modifiedName = 'HP';
                                break;
                            case 'attack':
                                modifiedName = 'ATK';
                                break;
                            case 'defense':
                                modifiedName = 'DEF';
                                break;
                            case 'special-attack':
                                modifiedName = 'SATK';
                                break;
                            case 'special-defense':
                                modifiedName = 'SDEF';
                                break;
                            case 'speed':
                                modifiedName = 'SPD';
                                break;
                            default:
                                modifiedName = stat.statName;
                                break;
                        }
                        return {
                            ...stat,
                            statName: modifiedName,
                        };
                    }),
                    height: pokemon2FromApi.height / 10,
                    weight: pokemon2FromApi.weight / 10,
                    types: pokemon2FromApi.types,
                };
                // Render the "vergelijken" view with user, Pokemon 1, Pokemon 2, buddy, and buddy status information
                res.render('vergelijken', {user: user, pokemon1FromApi: pokemon1Updated, pokemon2FromApi: pokemon2Updated, buddy : apiFetchBuddy, getBuddyFromUser, buddyInfo : getBuddy, buddyStatus});
            }else if(queryPokemon1){
                // Fetch Pokemon 1 details from the PokeAPI
                const pokemon1FromApi = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${queryPokemon1}`)).json();
                // Prepare the updated Pokemon 1 object with necessary details
                const pokemon1Updated: iPokemon = {
                    id: pokemon1FromApi.id,
                    name: pokemon1FromApi.name,
                    sprites: pokemon1FromApi.sprites,
                    ability: pokemon1FromApi.abilities,
                    baseStats: pokemon1FromApi.stats.map((stat: any) => {
                        let modifiedName: string;
                        switch (stat.stat.name) {
                            case 'hp':
                                modifiedName = 'HP';
                                break;
                            case 'attack':
                                modifiedName = 'ATK';
                                break;
                            case 'defense':
                                modifiedName = 'DEF';
                                break;
                            case 'special-attack':
                                modifiedName = 'SATK';
                                break;
                            case 'special-defense':
                                modifiedName = 'SDEF';
                                break;
                            case 'speed':
                                modifiedName = 'SPD';
                                break;
                            default:
                                modifiedName = stat.statName;
                                break;
                        }
                        return {
                            ...stat,
                            statName: modifiedName,
                        };
                    }),
                    height: pokemon1FromApi.height / 10,
                    weight: pokemon1FromApi.weight / 10,
                    types: pokemon1FromApi.types,
                };

                // Render the "vergelijken" view with user, Pokemon 1, buddy, and buddy status information
                res.render('vergelijken', {user: user, pokemon1FromApi: pokemon1Updated, buddy : apiFetchBuddy, getBuddyFromUser, buddyInfo : getBuddy, buddyStatus});

            }else{
                // Render the "vergelijken" view with user, invalidPokemon, buddy, and buddy status information
                res.render('vergelijken', { user: user, invalidPokemon, buddy : apiFetchBuddy, getBuddyFromUser, buddyInfo : getBuddy, buddyStatus });
            }
        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    changePokemon: async (req: express.Request, res: express.Response) => {
        // Get the new Pokemon name from the request body
        const pokemonName = req.body.pokemonName;
        // Fetch the Pokemon details from the PokeAPI
        const pokemonFromApi: iPokemon = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)).json().catch((e) => {
            // If there is an error, redirect back to the "vergelijken" page with invalidPokemon query parameter
            res.redirect("/vergelijken?invalidPokemon=true");
        });
        if (pokemonFromApi) {
            const pokemon1 = req.body.urlParam1;
            const pokemon2 = req.body.urlParam1;
            const index = req.body.index;
            // console.log(index);
            // Check the index and the presence of Pokemon 1 and Pokemon 2 in the request body to construct the redirect URL
            if(index == 0 && pokemon2 === undefined){
                return res.redirect(`/vergelijken?pokemon1=${pokemonFromApi.id}`);
            }else if(index == 0 && pokemon2 != undefined){
                return res.redirect(`/vergelijken?pokemon1=${pokemonFromApi.id}&pokemon2=${pokemon2}`);
            }else if(index == 1 && pokemon1 != undefined){
                return res.redirect(`/vergelijken?pokemon1=${pokemon1}&pokemon2=${pokemonFromApi.id}`);
            }
        }
    }
}

export default controller;