const { Videogame, Genre } = require("../db.js");
const axios = require('axios');
const { Sequelize, Op } = require("sequelize");

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

// const { API_KEY } = process.env;
// const API_KEY = 'a6c41594b31847f4a1ccae2383e45fee';
const API_KEY = '6bcb2db2bdaa45649f761187d112082d';


/*--------------------------( /videogames y /videogames?name="..." )---------------------------*/
const getVideogames = async (req, res) => {
    const { name } = req.query;

    if (name) {
        try {
            let gamesByName = [];

            const apiVideogames = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`)
            let apiVideogamesRes = apiVideogames.data.results;
            apiVideogamesRes = apiVideogamesRes.map((game) => {
                return {
                    id: game.id,
                    name: game.name,
                    genres: game.genres ? game.genres.map((genre) => genre.name).join(', ') : null,
                    img: game.background_image,
                    rating: game.rating,
                    platforms: game.platforms ? game.platforms.map((p) => p.platform.name).join(', ') : null
                }
            })

            const bdVideogames = await Videogame.findAll({
                where: {
                    name: name.toLowerCase()
                },
                include: {
                    model: Genre
                }
            })
            let bdVideogamesRes = bdVideogames.map(game => {
                return {
                    id: game.id,
                    name: game.name,
                    // genres: game.genres.map((genre) => genre.name).join(', '),
                    genres: game.genres,
                    img: game.img,
                    rating: game.rating,
                    // platforms: game.platforms.map((p) => p.platform.name).join(', ')
                    platforms: game.platforms
                }
            })

            gamesByName = [...apiVideogamesRes, bdVideogamesRes]

            if (gamesByName) {
                return res.status(200).json(gamesByName)
            } else {
                return res.json('Videogames by name not found.')
            }
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error: 'There was an error...' })
        }
    } else {
        try {
            let games = [];

            let pages = 8;
            for (let i = 1; i < pages; i++) {
                const apiVideogames = await axios.get(`https://api.rawg.io/api/games?page=${i}&key=${API_KEY}`)
                let apiVideogamesRes = apiVideogames.data.results;

                apiVideogamesRes = apiVideogamesRes.map(game => {
                    games.push({
                        id: game.id,
                        name: game.name,
                        genres: game.genres.map((genre) => genre.name).join(', '),
                        img: game.background_image,
                        rating: game.rating,
                        platforms: game.platforms.map((p) => p.platform.name).join(', ')
                    })
                })
            }
            const bdVideogames = await Videogame.findAll({
                include: {
                    model: Genre
                }
            });
            const bdVideogamesRes = bdVideogames.map(game => {
                return {
                    id: game.id,
                    name: game.name,
                    // genres: [game.genres].map((genre) => genre.name).join(', '), //
                    genres: game.genres,
                    img: game.img,
                    rating: game.rating,
                    platforms: game.platforms
                }
            })
            games = [...games, bdVideogamesRes]
            return res.status(200).json(games)
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error: 'There was an error...' })
        }
    }
}

/*--------------------------------( /videogames/:id )--------------------------------*/
const getVideogameById = async (req, res) => {
    const { id } = req.params;

    if (id.length < 36) {
        try {
            const apiVideogame = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
            let apiVideogameRes = apiVideogame.data;

            apiVideogameRes = {
                name: apiVideogameRes.name,
                description: apiVideogameRes.description_raw,
                released: apiVideogameRes.released,
                genres: apiVideogameRes.genres.map((genre) => genre.name).join(', '),
                img: apiVideogameRes.background_image,
                rating: apiVideogameRes.rating,
                platforms: apiVideogameRes.platforms.map((e) => e.platform.name).join(', ')
            };
            return res.status(200).json(apiVideogameRes);
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error: "Videogame not found. Invalid ID." });
        }
    } else {
        try {
            let bdVideogame = await Videogame.findOne({
                where: {
                    id: id,
                },
                include: {
                    model: Genre,
                    attributes: ["id", "name"],
                    through: { attributes: [] },
                },
            });
            let bdVideogameRes = {
                img: bdVideogame.img ? bdVideogame.img : null,
                name: bdVideogame.name,
                genres: bdVideogame.Genres.map((genre) => genre.name).join(', '), //
                // genres: bdVideogame.genres,
                description: bdVideogame.description,
                released: bdVideogame.released,
                rating: bdVideogame.rating,
                platforms: bdVideogame.platforms,
            };
            return res.status(200).json(bdVideogameRes);
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error: "Videogame not found. Invalid ID." });
        }
    }
}

/*--------------------------------( /videogames/added )--------------------------------*/
const addedVideogames = async (req, res) => {
    try {
        let bdVideogames = await Videogame.findAll({
            include: [
                {
                    model: Genre,
                    attributes: ["id", "name"]
                }
            ]
        });
        bdVideogames.forEach((game) => {
            return {
                id: game.id,
                name: game.name,
                genres: game.Genres.map(genre => genre.name).join(', '),
                img: game.img,
                platforms: game.platforms,
                rating: game.rating
            }
        })
        if (bdVideogames) return res.status(200).json(bdVideogames)
        else return res.json('No videogames added.')
    } catch (error) {
        return res.status(404).json({ error: 'There was an error...' })
    }
}

/*--------------------------------( /videogame )--------------------------------*/
const createVideogame = async (req, res) => {
    let { name, description, released, rating, platforms, genres, img } = req.body;
    platforms = platforms.toString()
    rating = Number(rating)

    if (!name || typeof name !== "string") {
        return res.status(404).json({ error: "Invalid Name" });
    }
    if (!description || typeof description !== "string") {
        return res.status(404).json({ error: "Invalid description" });
    }
    if (!platforms || typeof platforms !== "string") {
        return res.status(404).json({ error: "Invalid platforms" });
    }
    if (!genres || typeof genres !== "object") {
        return res.json({ error: "Invalid genres" });
    }
    if (rating) {
        if (typeof rating !== "number") {
            return res.status(404).json({ error: "Invalid rating" });
        }
    }
    if (img) {
        if (typeof img !== "string") {
            return res.status(404).json({ error: "Invalid image" });
        }
    }

    try {
        let newGame = await Videogame.create({
            name,
            description,
            released,
            rating,
            platforms,
            img
        })
        // let genresNewGame = genres.map(async (genre) => {
        //     return (await Genre.findAll({
        //         where: {
        //             // name: genre
        //             name: { [Sequelize.Op.iLike]: `${genre}` }
        //         }
        //     }))
        // })

        let genresNewGame = await Genre.findAll({
            where: {
                name: genres
                // name: { [Sequelize.Op.iLike]: `${genres}` }
            }
        });

        await newGame.setGenres(genresNewGame);
        res.status(200).send("Videogame created succesfully!");
    } catch (error) {
        console.error(error)
        return res.status(404).json({ error: "There was an error..." })
    }
}

/*--------------------------------( /genres )--------------------------------*/
const getGenres = async (req, res) => {
    try {
        const apiGenres = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
        let apiGenresRes = await apiGenres.data.results;

        apiGenresRes.map((genre) => {
            Genre.findOrCreate({
                where: {
                    name: genre.name
                }
            })
        })
        const genres = await Genre.findAll();

        return res.status(200).json(genres);
    } catch (error) {
        return res.status(404).json({ error: 'There was an error...' });
    }
}


module.exports = {
    getVideogames,
    addedVideogames,
    getVideogameById,
    createVideogame,
    getGenres
}