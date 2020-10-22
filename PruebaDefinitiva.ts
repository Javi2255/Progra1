import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { MongoClient} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
const client = new MongoClient();
client.connectWithUri("mongodb+srv://Javi2255:Javi2255@cluster0.e0vqg.gcp.mongodb.net/Practica?retryWrites=true&w=majority");
const db = client.database("Practica");

interface CharacterSchema {
    _id: { $oid: string };
    id: number,
    name:string,
    status: string,
    species: string,
    type: string,
    gender: string,
    origin: number|string,
    location: number|string,
    image: string,
    episode: number[],
  }
  
  interface LocationSchema {
    _id: { $oid: string };
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: number[];
  }
  
  interface EpisodeSchema {
    _id: { $oid: string };
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: number[];
  }
const charactersCollection = db.collection<CharacterSchema>("CharactersCollection");
const episodesCollection = db.collection<EpisodeSchema>("EpisodesCollection");
const locationsCollection = db.collection<LocationSchema>("LocationsCollection");

const Episodios = await episodesCollection.find()
const Localizaciones = await locationsCollection.find()
const InfoPersonaje2= await charactersCollection.find()


//Funciones para modificar Arrays
const PersonajeAPlaneta=(ep:any):string=>{
    let c=""
    Episodios.forEach((elem:any):any=>{
        if(ep===elem["id"]){
             c= elem["name"]         
        }
      })
      return c
}
const EpisodioAPersonaje=(ep:any):string=>{
    let c=""
    InfoPersonaje2.forEach((elem:any):any=>{
        if(ep===elem["id"]){
             c= elem["name"]         
        }
      })
      return c
}

const PlanetaAPersonaje=(ep:any):string=>{
    let c=""
    InfoPersonaje2.forEach((elem:any):any=>{
        if(ep===elem["id"]){
             c= elem["name"]         
        }
      })
      return c
}

//Hasta aqui


const ModificarPersonajes =  InfoPersonaje2.map((elem)=>{
    return {
        ...elem,
        episode: (elem.episode as number[]).map((elem) => String(PersonajeAPlaneta(elem))),
      }
})

const ModificarCapitulos =  Episodios.map((elem)=>{
    return {
        ...elem,    
        characters: (elem.characters as number[]).map((elem) => String(EpisodioAPersonaje(elem))),
      }
})

const ModificarPlanetas =  Localizaciones.map((elem)=>{
    return {
        ...elem,    
        residents: (elem.residents as number[]).map((elem) => String(EpisodioAPersonaje(elem))),
      }
})

//ForEach para variables que no son Arrays
ModificarPersonajes.forEach((elem)=>{
    Localizaciones.forEach((elem2)=>{
        if(elem["origin"]===elem2["id"]){ //number   1 ---1
            elem["origin"]=elem2["name"]  //string  "1"---> "Earth"
        }
    })
})
ModificarPersonajes.forEach((elem)=>{
    Localizaciones.forEach((elem2)=>{
        if(elem["location"]===elem2["id"]){
            elem["location"]=elem2["name"]
        }
    })
})

//Hasta aqui

const InfoPersonaje=async(ctx:any)=>{
    ctx.response.body= ModificarPersonajes

}
const InfoEpisodios=async(ctx:any)=>{
    ctx.response.body= ModificarCapitulos

}
const InfoPlanetas=async(ctx:any)=>{
    ctx.response.body= ModificarPlanetas

}

const port = 8000;
const app = new Application();
 
const router = new Router();
 
router.get('/Per', InfoPersonaje);
router.get('/Epi', InfoEpisodios);
router.get('/Pla', InfoPlanetas);

 
 
app.use(router.allowedMethods());
app.use(router.routes());
 
app.addEventListener('listen', () => {
  console.log(`Listening on: localhost:${port}`);
});
 
await app.listen({ port });