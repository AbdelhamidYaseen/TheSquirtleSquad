import express from 'express';
import { iPokemon } from '../types';
import { getBuddyFromUser } from '../models/caughtPokemonModel';
import { getAllUsers, getUserById, iUser } from '../models/usersModel';
import * as crypto from "crypto-js";
const session = require('express-session');
let loggedIn : boolean = false;

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        const user : iUser = await getUserById(1);
        const cookie = req.headers.cookie;
        const queryParam = req.query.loggedIn === "false";
        if(typeof(cookie) !== 'undefined'){
            const cookies = cookie.split(';').map((cookieString) => cookieString.trim());
            const userIdCookie = cookies.find((cookieString) => cookieString.startsWith('userid='));
            if(!userIdCookie){
                loggedIn = false;
            }else{
                loggedIn = true;
            }
        }else{
            loggedIn = false;
        }
        const getBuddy = await getBuddyFromUser(1);
        const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
        console.log(cookie);
        console.log(loggedIn);
        
        res.render('index',{buddy:apiFetchBuddy,user:user, getBuddyFromUser, loggedIn, queryParam}); 
        /*Buddy has to be send to avoid the page from crashing. This is due the template requesting a buddy.*/
    },
    post: async (req: express.Request, res: express.Response) => {
        const username = req.body.username;
        const password = req.body.password;

        console.log(username);
        console.log(password);

        let inputPasswordHash = crypto.SHA1(password).toString(); /*turns the given password into a hashed SHA1 version of itself.*/

        console.log(inputPasswordHash);
        
        const allUsers: iUser[] = await getAllUsers();
        /* loop through all users, if username is found in the array, he looks at the password, if this matches, loggedIn is given value true*/
        for (let i = 0; i < allUsers.length; i++) {
            const user : iUser = allUsers[i];

            if (username == user.username){
                if (inputPasswordHash == user.password){
                    loggedIn = true;
                    console.log("goedzo, da werikt");
                    res.cookie('userid',user.id,{
                        path: '/',
                        maxAge: 864000000, /*alive for 10 days.*/
                    })
                    const getBuddy = await getBuddyFromUser(user.id);
                    const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
                    res.redirect('/');
                    /*Buddy has to be send to avoid the page from crashing. This is due the template requesting a buddy.*/
                }
            }
            
        }

    }
}

export default controller;