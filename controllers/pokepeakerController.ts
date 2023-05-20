import express from 'express';
import { changeBuddyFromUser, getAllCaughtPokemonFromUser, getBuddyFromUser, getCaughtPokemonFromUser } from '../models/caughtPokemonModel';
import { getUserById, iUser } from '../models/usersModel';
import { iCaughtPokemon, iPokemon, iBaseStats } from '../types';

const controller = {
    get: async (req: express.Request, res: express.Response) => {
        try {
            // TODO: Get the user from req header stuff when authentication system is done
            const user: iUser = await getUserById(1);
            const pokemonId = parseInt(req.params.pokemonId);
            const pokemon = await getCaughtPokemonFromUser(1, pokemonId);
            const buddy : iCaughtPokemon | null = await getBuddyFromUser(1);
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
            res.render('pokepeaker', { user: user, pokemon: pokemonUpdated, evolutions: evolutions, buddy: buddy });
        } catch (err: any) {
            // console.error(err.message);
            // TODO: Make actual error pages
            res.status(500).send('Internal Server Error');
        }
    },
    setBuddy: async (req: express.Request, res: express.Response) => {
        const newPokemonBuddy = parseInt(req.params.pokemonId);
        const userId = 1;
        changeBuddyFromUser(userId, newPokemonBuddy);
        res.redirect(`/pokepeaker/${newPokemonBuddy}`);
    }
    
}

export default controller;