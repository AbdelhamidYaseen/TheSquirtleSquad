import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser, changePokemonName } from '../models/caughtPokemonModel';

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        try {
            const userIdLocal = 2;
            // Log the names of all the users in the array
            const user : iUser = await getUserById(userIdLocal);
            let buddyStatus = true;
            console.log(user.username)
            if(await getBuddyFromUser(userIdLocal) === null){
                console.log(`NO BUDDY - ${getBuddyFromUser(userIdLocal)}`)
                buddyStatus = false;
                res.render('home', {user:user, buddyStatus});
            }
            else{
                console.log("WE HAVE A BUDDY")
                const getBuddy = await getBuddyFromUser(userIdLocal);
                const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
                res.render('home', {user:user,buddy:apiFetchBuddy, getBuddyFromUser, changePokemonName,buddyInfo : getBuddy, buddyStatus});
            }

        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    post: (req: express.Request, res: express.Response) => {
        test();
    }
}

const test = () => {
    console.log(test);
}

export default controller;