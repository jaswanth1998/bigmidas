import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import passport from 'passport';
import { configureJWTStrategy } from './passport-jwt';



export const setGlobalMiddleware = app => {

    app.use(express.json());
app.use(express.urlencoded());
app.use(logger('dev'));
app.use(passport.initialize());
app.use(cors());
configureJWTStrategy();
}
