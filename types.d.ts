export interface iPokemonAttack {
    id: number;
    name: string;
    power: number;
}

export interface iCaughtPokemon {
    pokemon_id: number;
    pokemon_name: string;
    pokemon_hp: number;
    pokemon_attack: number;
    pokemon_defense: number;
    pokemon_special_attack: number;
    pokemon_special_defense: number;
    pokemon_speed: number;
    isBuddy: boolean;
}

export interface iPokemon {
    id: number;
    name: string;
    sprites: iSprites;
    height?: number;
    weight?: number;
    ability?: iAbility[];
    types?: iType[];
    baseStats?: iBaseStats[];
}

export interface iBaseStats {
    statName: string;
    statValue: number;
}

export interface iType {
    name: string;
}

export interface iAbility {
    name: string;
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
    home: iHome;
    "official-artwork": iOfficialArtwork;
}