import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { getBuddyFromUser } from '../models/caughtPokemonModel';
import { iPokemon } from '../types';

const controller = {
    get: async (req: express.Request, res: express.Response) => {
        try {
            // Log the names of all the users in the array
            const user : iUser = await getUserById(1);
            const getBuddy = await getBuddyFromUser(1);
            let buddyStatus = true;
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            const invalidPokemon = req.query.invalidPokemon === "true";
            const queryPokemon1 = req.query.pokemon1;
            const queryPokemon2 = req.query.pokemon2;
            if(queryPokemon1 && queryPokemon2){
                const pokemon1FromApi = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${queryPokemon1}`)).json();
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


                const pokemon2FromApi = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${queryPokemon2}`)).json();
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
                
                res.render('vergelijken', {user: user, pokemon1FromApi: pokemon1Updated, pokemon2FromApi: pokemon2Updated, buddy : apiFetchBuddy, getBuddyFromUser, buddyInfo : getBuddy, buddyStatus});
            }else if(queryPokemon1){
                const pokemon1FromApi = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${queryPokemon1}`)).json();
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


                res.render('vergelijken', {user: user, pokemon1FromApi: pokemon1Updated, buddy : apiFetchBuddy, getBuddyFromUser, buddyInfo : getBuddy, buddyStatus});

            }else{
                res.render('vergelijken', { user: user, invalidPokemon, buddy : apiFetchBuddy, getBuddyFromUser, buddyInfo : getBuddy, buddyStatus });
            }

        } catch (err: any) {
            res.render('vergelijken', {user:user});
        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    changePokemon: async (req: express.Request, res: express.Response) => {
        const pokemonName = req.body.pokemonName;
        const pokemonFromApi: iPokemon = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)).json().catch((e) => {
            res.redirect("/vergelijken?invalidPokemon=true");
        });
        if (pokemonFromApi) {
            const pokemon1 = req.body.urlParam1;
            const pokemon2 = req.body.urlParam1;
            const index = req.body.index;
            console.log(index);
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