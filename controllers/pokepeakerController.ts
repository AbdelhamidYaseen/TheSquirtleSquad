import express from 'express';
import { changeBuddyFromUser, getAllCaughtPokemonFromUser, getBuddyFromUser, getCaughtPokemonFromUser } from '../models/caughtPokemonModel';
import { getUserById, iUser } from '../models/usersModel';
import { iCaughtPokemon, iPokemon, iBaseStats } from '../types';

let userId: number=0;
const controller = {
    get: async (req: express.Request, res: express.Response) => {
        try {
            // get user id from cookies
            const cookie = req.headers.cookie;
            if(typeof(cookie) !== 'undefined'){
                const cookiesplit = cookie?.split("=");
                userId = +cookiesplit[1];
            }
            const user: iUser = await getUserById(userId);
            const pokemonId = parseInt(req.params.pokemonId);
            const pokemon = await getCaughtPokemonFromUser(userId, pokemonId);
            const buddy : iCaughtPokemon | null = await getBuddyFromUser(userId);

            const apiFetchBuddy : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${buddy?.pokemon_id}`).then((response) => response.json());
            const buddyStats : iPokemon = {
                id: apiFetchBuddy.id,
                name: apiFetchBuddy.name,
                sprites: apiFetchBuddy.sprites,
                ability: apiFetchBuddy.ability,
                baseStats: apiFetchBuddy.stats,
            }
            let buddyStatus = true;
            if (!pokemon) {
                // TODO: Make actual error pages
                return res.status(500).send("Internal Server Error");
            }
    
            const pokemonFromApi = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)).json();
            const pokemonSpecies = await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)).json();

            const evolutionLine = await (await fetch(pokemonSpecies.evolution_chain.url)).json();
            let evolutions: iPokemon[] = [];

            const retrieveEvolutions = async (evolutionChain: any) => {
            const evolutionSpeciesFromApi: any = await (await fetch(evolutionChain.species.url)).json();
            const evolutionWithAllDetails: any = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionSpeciesFromApi.id}`)).json();
            const allCaughtPokemon: iCaughtPokemon[] = await getAllCaughtPokemonFromUser(1);
            const caught = allCaughtPokemon.some((pokemon) => pokemon.pokemon_id === evolutionWithAllDetails.id);
            const tempEvolutionPokemon = {
                id: evolutionWithAllDetails.id,
                name: evolutionWithAllDetails.name,
                sprites: evolutionWithAllDetails.sprites,
                caught: caught,
            };
            evolutions.push(tempEvolutionPokemon);

            if (evolutionChain.evolves_to.length > 0) {
                await Promise.all(evolutionChain.evolves_to.map(async (nextEvolution: any) => {
                await retrieveEvolutions(nextEvolution);
                }));
            }
            };
            await retrieveEvolutions(evolutionLine.chain);

            const pokemonUpdated: iPokemon = {
                id: pokemonFromApi.id,
                name: pokemonFromApi.name,
                sprites: pokemonFromApi.sprites,
                ability: pokemonFromApi.abilities,
                baseStats: pokemonFromApi.stats.map((stat: any) => {
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
                height: pokemonFromApi.height / 10,
                weight: pokemonFromApi.weight / 10,
                types: pokemonFromApi.types,
            };
            res.render('pokepeaker', { user: user, pokemon: pokemonUpdated, evolutions: evolutions, buddy: buddyStats, buddyStatus, buddyInfo: buddyStats });
        } catch (err: any) {
            // console.error(err.message);
            // TODO: Make actual error pages
            res.status(500).send('Internal Server Error');
        }
    },
    setBuddy: async (req: express.Request, res: express.Response) => {
        const newPokemonBuddy = parseInt(req.params.pokemonId);
        changeBuddyFromUser(userId, newPokemonBuddy);
        res.redirect(`/pokepeaker/${newPokemonBuddy}`);
    }
    
}

export default controller;