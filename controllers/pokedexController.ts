import express from 'express';
import { getAllCaughtPokemonFromuser, getBuddyFromUser } from '../models/caughtPokemonModel';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';

const controller = {
    get: async (req: express.Request, res: express.Response) => {
        try {
            const pageNumber = 1;
            const pageSize = 18;
            let buddyStatus = true;
            // TODO: Change parameters of these functions to the actual userid that gets send when the login/register system is done
            const pokemonInDB = await getAllCaughtPokemonFromuser(1);
            const user : iUser = await getUserById(1);



            const apiRes: iPokemon[] = await Promise.all(
                // Fetch 151 pokémon
                Array.from({ length: 151 }, (_,i) =>
                    
                    fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((response) =>
                        response.json()
                    )
                )
            );
            const pokemonData = await Promise.all(apiRes);

            const paginatedEntries: iPokemon[] = pokemonData.filter((apiData) => apiData !== null).map((apiData) => {
                const caught = pokemonInDB.some((pokemon) => pokemon.pokemon_id === apiData.id);
                return {
                    id: apiData.id,
                    name: apiData.name,
                    sprites: apiData.sprites,
                    caught: caught,
                };
            }).slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

            
            if (pageNumber > Math.ceil(pokemonData.length / pageSize)) {
                return res.status(500).send('Internal Server Error');
            }
            const getBuddy = await getBuddyFromUser(1);
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            return res.render('pokedex', { user: user, pokemon: paginatedEntries, currentPageNumer: pageNumber, totalPages: Math.ceil(pokemonData.length / pageSize), buddy: apiFetchBuddy ,getBuddyFromUser, buddyInfo : getBuddy, buddyStatus})
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    },
    getPage: async (req: express.Request, res: express.Response) => {
        try {
            const user : iUser = await getUserById(1);
            let buddyStatus = true;
            const pageNumber = parseInt(req.params.pagenumber);
            const pageSize = 18;
            const pokemonInDB = await getAllCaughtPokemonFromuser(1);

            const apiRes: iPokemon[] = await Promise.all(
                Array.from({ length: 151 }, (_, i) =>
                    fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((response) =>
                        response.json()
                    )
                )
            );
            const getBuddy = await getBuddyFromUser(1);
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            const pokemonData = await Promise.all(apiRes);
            let pokemon: iPokemon;
            const paginatedEntries: iPokemon[] = pokemonData.filter((apiData) => apiData !== null).map((apiData) => {
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

            if (pageNumber > Math.ceil(pokemonData.length / pageSize)) {
                return res.status(500).send('Internal Server Error');
            }
            return res.render('pokedex', { user: user, pokemon: paginatedEntries, currentPageNumer: pageNumber, totalPages: Math.ceil(pokemonData.length / pageSize), buddy: apiFetchBuddy, getBuddyFromUser, buddyStatus, buddyInfo : getBuddy});
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    },
    // post: (req: express.Request, res: express.Response) => {
    //     test();
    // }
}

export default controller;