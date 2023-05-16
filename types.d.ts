export interface iPokemonAttack {
    id: number,
    name: string,
    power: number,
}

export interface iCaughtPokemon {
    pokemon_id: number,
    pokemon_hp: number,
    pokemon_attack: number,
    isBuddy: boolean, 
}

export interface iPokemon {
    id: number;
    name: string;
    sprites: iSprites;
    caught: boolean,
}

export interface iSprites {
    front_default: string;
    front_female: null;
    front_shiny: string;
    front_shiny_female: null;
    other?: iOther;
}

export interface iOfficialArtwork {
    front_default: string;
    front_shiny: string;
}

export interface iHome {
    front_default: string;
    front_female: null;
    front_shiny: string;
    front_shiny_female: null;
}


export interface iOther {
    home: Home;
    "official-artwork": iOfficialArtwork;
}