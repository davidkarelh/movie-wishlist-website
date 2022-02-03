const fetch = require("node-fetch")
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const wishlistDB = prisma.wishlist

module.exports = {
    index: async (req, res) => {
        if (res.locals.user) {
            const movieIds = await wishlistDB.findMany({
                where: {
                    userId: res.locals.user.id
                },
                select: {
                    movieId: true
                },
                distinct: ["movieId"]
            })

            const movieWishlist = [];
            const promises = []
            movieIds.forEach(async element => {
                promises.push(
                    fetch(
                        "http://api.themoviedb.org/3/movie/" + element.movieId + "?api_key=8da85a40aec5b3ee7fb116f3feba09a9"
                        )
                        .then((resp) => resp.json())
                        .then((resp) => {
                            // console.log("pushed")
                            movieWishlist.push(resp)
                        })
                )
            })

            await Promise.all(promises)

            if (movieWishlist.length !== 0) {
                // console.log("confirm")
                res.render("wishlist", { confirm: true, wishlist: movieWishlist } )
            } else {
                // console.log("not confirm")
                res.render("wishlist", { confirm: false } )
            }
         
        } else {
            res.redirect("/login")
        }
    },

    store: async (req, res) => {
        if (res.locals.user) {
            const wishlist = await wishlistDB.create({
                data: {
                    userId: res.locals.user.id,
                    movieId: req.body.movieId
                }
            })
            // console.log("stored")
            res.sendStatus(201)
        } else {
            res.redirect("/login")
        }
    }

    
}