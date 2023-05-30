import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser, changePokemonName, addPokemonToUser, getAllCaughtPokemonFromuser } from '../models/caughtPokemonModel';
import { changeBuddyFromUser } from '../models/caughtPokemonModel';

const userIdLocal = 3;

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        try {
            const user : iUser = await getUserById(userIdLocal);
            let buddyStatus = true;
            const allCaughtPokemon = await getAllCaughtPokemonFromuser(userIdLocal);
            if(allCaughtPokemon.length==0){
                buddyStatus = false;
                const apiFetchBulbasaur : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${1}`).then((response) => response.json());
                const apiFetchCharmander : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${4}`).then((response) => response.json());
                const apiFetchSquirtle : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${7}`).then((response) => response.json());
                res.render('home', {user:user, buddyStatus, bulbasaur: apiFetchBulbasaur, charmander: apiFetchCharmander, squirtle: apiFetchSquirtle});
            }
            else{
                const getBuddy = await getBuddyFromUser(userIdLocal);
                const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
                res.render('home', {user:user,buddy:apiFetchBuddy, getBuddyFromUser, changePokemonName,buddyInfo : getBuddy, buddyStatus});
            }

        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    post: async(req: express.Request, res: express.Response) => {
        const starterToAdd = req.body.addSquirtle;
        
        switch (starterToAdd) {
            case "bulbasaur":
                addPokemonToUser(userIdLocal,1,true);
                break;
            case "charmander":
                addPokemonToUser(userIdLocal,4,true);
                break;
            case "squirtle":
                addPokemonToUser(userIdLocal,7,true);
                break;
            default:
              break;
          }
        //RELOAD
        // Log the names of all the users in the array
        const user : iUser = await getUserById(userIdLocal);
        let buddyStatus = true;
        if(await getBuddyFromUser(userIdLocal) === null){
            buddyStatus = false;
            const apiFetchSquirtle : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${7}`).then((response) => response.json());

            res.render('home', {user:user, buddyStatus, squirtle: apiFetchSquirtle});
        }else{
            const getBuddy = await getBuddyFromUser(userIdLocal);
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            res.render('home', {user:user,buddy:apiFetchBuddy, getBuddyFromUser, changePokemonName,buddyInfo : getBuddy, buddyStatus});
        }

    }
}

export default controller;