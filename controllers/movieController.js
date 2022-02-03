const fetch = require("node-fetch")
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const wishlistDB = prisma.wishlist

module.exports = {
    showMovies: async (req, res) => {
        if (res.locals.user) {
            if (req.query.title) {
                await fetch(
                    "https://api.themoviedb.org/3/search/movie?api_key=8da85a40aec5b3ee7fb116f3feba09a9&query=" + req.query.title
                    )
                    .then((resp) => resp.json())
                    .then((resp) => resp.results)
                    .then(async (resp) => {
                        const movieIds = await wishlistDB.findMany({
                            where: {
                                userId: res.locals.user.id
                            },
                            select: {
                                movieId: true
                            }
                        })

                        if (movieIds) {
                            resp.forEach(element => {
                                const contain = movieIds.some(el => {
                                    return JSON.stringify({ movieId: element.id }) == JSON.stringify(el)
                                })

                                if (contain) {
                                    element.wishlist = true
                                    // console.log("included")
                                }
                            });
                        }

                        res.render("home", { movie: true , movies: resp  })
                    });
            } else {  
                res.render("home", { movie: false })
            }
        } else {
            res.redirect("/login")
        }
    },

    showMovieDetail: async (req, res) => {
        if (res.locals.user) {
            await fetch(
                "http://api.themoviedb.org/3/movie/" + req.params.id + "?api_key=8da85a40aec5b3ee7fb116f3feba09a9"
                )
                .then((resp) => resp.json())
                .then((resp) => {
                    res.render("detail", { detail: resp })
                });
        } else {
            res.redirect("/login")
        }
    }
}