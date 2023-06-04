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
        /* checks if a cookie already exists or not, if so, the user is logged in*/
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

        
        res.render('index',{user:user, getBuddyFromUser, loggedIn, queryParam}); 
    },
    post: async (req: express.Request, res: express.Response) => {
        const username = req.body.username;
        const password = req.body.password;
        let inputPasswordHash = crypto.SHA1(password).toString(); /*turns the given password into a hashed SHA1 version of itself.*/
        const allUsers: iUser[] = await getAllUsers();
        /* loop through all users, if username is found in the array, he looks at the password, if this matches, loggedIn is given value true*/
        for (let i = 0; i < allUsers.length; i++) {
            const user : iUser = allUsers[i];

            if (username == user.username){
                if (inputPasswordHash == user.password){
                    loggedIn = true;
                    res.cookie('userid',user.id,{
                        path: '/',
                        maxAge: 864000000, /*alive for 10 days.*/
                    })
                    res.redirect('/');
                }
            }
            
        }

    }
}

export default controller;
