import type { MetadataRoute } from "next";
export default function manifest():MetadataRoute.Manifest {
 return {name:"KitaFlow",short_name:"KitaFlow",lang:"de",description:"Kita-Management und Notfallplanung",start_url:"/",display:"standalone",background_color:"#f5f7f4",theme_color:"#18382f",icons:[{src:"/icon.svg",sizes:"any",type:"image/svg+xml",purpose:"any"}]};
}

