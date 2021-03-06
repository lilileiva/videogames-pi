export const GET_VIDEOGAMES = "GET_VIDEOGAMES";
export const GET_VIDEOGAMES_LOADED = "GET_VIDEOGAMES_LOADED";
export const ALL_VIDEOGAMES = "ALL_VIDEOGAMES";
export const ADDED_VIDEOGAMES = "ADDED_VIDEOGAMES";
export const GET_VIDEOGAMES_BY_NAME = "GET_VIDEOGAMES_BY_NAME";
export const GET_VIDEOGAME_BY_ID = "GET_VIDEOGAME_BY_ID";
export const CREATE_VIDEOGAME = "CREATE_VIDEOGAME";
export const GET_GENRES = "GET_GENRES";
export const FILTER_GENRES = "FILTER_GENRES";
export const ORDER_RATING = "ORDER_RATING";
export const ORDER_ALPHABET = "ORDER_ALPHABET";
export const RESET = "RESET";
export const SEARCH_NAME = "SEARCH_NAME";


export function getVideogamesLoaded() {
    return async function (dispatch) {
        try {
            return await fetch('http://localhost:3001/videogames')
                .then(res => res.json())
                .then(data => {
                    dispatch({
                        type: "GET_VIDEOGAMES_LOADED",
                        payload: data
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }
};
export function getVideogames() {
    return async function (dispatch) {
        try {
            return await fetch('http://localhost:3001/videogames')
                .then(res => res.json())
                .then(data => {
                    dispatch({
                        type: "GET_VIDEOGAMES",
                        payload: data
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }
};


export function allVideogames() {
    return {
        type: "ALL_VIDEOGAMES"
    }
}


export function getVideogamesByName(name) {
    return async function (dispatch) {
        try {
            return await fetch(`http://localhost:3001/videogames?name=${name}`)
                .then(res => res.json())
                .then(data => {
                    dispatch({
                        type: "GET_VIDEOGAMES_BY_NAME",
                        payload: data.length >= 15 ? data.slice(0, 15) : data
                    })
                })
        } catch (error) {
            return console.log(error)
        }
    }
};


export function addedVideogames() {
    return async function (dispatch) {
        try {
            return await fetch('http://localhost:3001/videogames/added')
                .then(res => res.json())
                .then(data => {
                    dispatch({
                        type: "ADDED_VIDEOGAMES",
                        payload: data
                    })
                })
        } catch (error) {
            return console.log(error)
        }
    }
};


export function getVideogameById(id) {
    return async function (dispatch) {
        try {
            return await fetch(`http://localhost:3001/videogames/${id}`)
                .then(res => res.json())
                .then(data => {
                    dispatch({
                        type: "GET_VIDEOGAME_BY_ID",
                        payload: data
                    })
                })
        } catch (error) {
            return console.log(error)
        }
    }
};


export function createVideogame(form) {
    return async function (dispatch) {
        try {
            return await fetch('http://localhost:3001/videogame', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            })
                .then((res) => res.json())
                .then((data) => {
                    dispatch({
                        type: "CREATE_VIDEOGAME",
                        payload: data
                    })
                });
        } catch (error) {
            return console.log(error)
        }
    }
};

export function getGenres() {
    return async function (dispatch) {
        try {
            return await fetch('http://localhost:3001/genres')
                .then(res => res.json())
                .then(data => {
                    dispatch({
                        type: "GET_GENRES",
                        payload: data
                    })
                })
        } catch (error) {
            return console.log(error)
        }
    }
};


export function filterGenres(payload) {
    return {
        type: "FILTER_GENRES",
        payload
    }
}

export function orderRating(payload) {
    return {
        type: "ORDER_RATING",
        payload
    }
}

export function orderAlphabet(payload) {
    return {
        type: "ORDER_ALPHABET",
        payload
    }
}


export function reset(payload) {
    return {
        type: "RESET",
        payload
    }
}

export function searchName(payload) {
    return {
        type: "SEARCH_NAME",
        payload
    }
}


