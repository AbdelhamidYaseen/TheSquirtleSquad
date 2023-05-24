import express from 'express';
import { iPokemon } from '../types';
import { getBuddyFromUser } from '../models/caughtPokemonModel';
import { getAllUsers, getUserById, iUser } from '../models/usersModel';
import * as crypto from "crypto-js";
const session = require('express-session');


const controller = {
    get: async (req: express.Request, res : express.Response) => {
        const user : iUser = await getUserById(1);

        const getBuddy = await getBuddyFromUser(1);
        const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());

        /*buddy oproepen doordat deze in template staat. Zonder buddy = crash */
        res.render('index',{buddy:apiFetchBuddy,user:user, getBuddyFromUser});
    },
    post: async (req: express.Request, res: express.Response) => {
        const username = req.body.username;
        const password = req.body.password;

        console.log(username);
        console.log(password);

        let inputPasswordHash = crypto.SHA1(password).toString();

        console.log(inputPasswordHash);
        
        const allUsers: iUser[] = await getAllUsers();

        for (let i = 0; i < allUsers.length; i++) {
            const user : iUser = allUsers[i];

            if (username == user.username){
                if (inputPasswordHash == user.password){
                    console.log("goedzo, da werikt");
                    res.cookie('userid',user.id,{
                        path: '/',
                        maxAge: 864000000, /*10 dagen lang cookie levend*/
                    })
                    const getBuddy = await getBuddyFromUser(user.id);
                    const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            
                    /*buddy oproepen doordat deze in template staat. Zonder buddy = crash */
                    res.render('index',{buddy:apiFetchBuddy,user:user, getBuddyFromUser});
                }
            }
            
        }

    }
}

export default controller;