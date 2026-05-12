import { useState, useMemo, useEffect } from "react";

const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const TVA = 0.20;
const STORAGE_KEY_CLIENTS = "d2s_clients";
const STORAGE_KEY_FACTURES = "d2s_factures";
const STORAGE_KEY_PASSAGES = "d2s_passages";

function D2SLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="95" fill="#1a1a1a" stroke="#333" strokeWidth="2"/>
      <circle cx="100" cy="100" r="78" fill="none" stroke="#555" strokeWidth="1.5"/>
      <polygon points="100,18 182,158 18,158" fill="none" stroke="#e8e8e8" strokeWidth="7" strokeLinejoin="round"/>
      <polygon points="100,55 155,148 45,148" fill="#cc2222"/>
      <path d="M 18,158 Q 100,185 182,158" fill="none" stroke="#e8e8e8" strokeWidth="7"/>
    </svg>
  );
}

const CLIENTS_INIT = [{"id":1,"nom":"Carré Blanc - Lyon Saxe","adresse":"13 Av. Maréchal de Saxe, 69006 Lyon","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":2},{"id":2,"nom":"Casino Shop","adresse":"14 Rue Confort, 69002 Lyon","siret":"","email":"","tarifPassage":16.25,"passagesMoisDefaut":4},{"id":3,"nom":"Clinique Saint Charles - Lyon","adresse":"25 Rue de Flesselles, 69001 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":12},{"id":4,"nom":"Courir Lyon Republique","adresse":"32 Rue de la République, 69002 Lyon","siret":"","email":"","tarifPassage":11.25,"passagesMoisDefaut":8},{"id":5,"nom":"Slake Terreaux","adresse":"18 Rue de la Platière, 69001 Lyon","siret":"","email":"","tarifPassage":18.75,"passagesMoisDefaut":4},{"id":6,"nom":"Etam Lingerie et Prêt-à-porter","adresse":"67 Rue de la République, 69002 Lyon","siret":"","email":"","tarifPassage":25,"passagesMoisDefaut":16},{"id":7,"nom":"Pralus Lyon Monplaisir","adresse":"103 Av. des Frères Lumière, 69008 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":8},{"id":8,"nom":"Pralus Tassin","adresse":"77 Av. de la République, 69160 Tassin-la-Demi-Lune","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":8},{"id":9,"nom":"Pralus Lyon Presqu'île","adresse":"32 Rue de Brest, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":16},{"id":10,"nom":"Pralus Lyon Saint-Jean","adresse":"27 Rue Saint-Jean, 69005 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":12},{"id":11,"nom":"Pralus Croix Rousse","adresse":"3 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":8},{"id":12,"nom":"Pralus Quai Saint-Antoine","adresse":"18 Quai Saint-Antoine, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":13,"nom":"Pralus Lyon Vitton","adresse":"26 Cr Vitton, 69006 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":8},{"id":14,"nom":"Pralus Oullins","adresse":"107 Grande Rue, 69600 Oullins-Pierre-Bénite","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":8},{"id":15,"nom":"Alice Délice","adresse":"80 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":4},{"id":16,"nom":"Librairie Papeterie Fantasio","adresse":"33 Av. Henri Barbusse, 69100 Villeurbanne","siret":"","email":"","tarifPassage":33.75,"passagesMoisDefaut":4},{"id":17,"nom":"LANCEL Lyon Herriot","adresse":"81 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":10.0,"passagesMoisDefaut":20},{"id":18,"nom":"L'Institution","adresse":"24 Rue de la République, 69002 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":8},{"id":19,"nom":"Le Galopin Pub","adresse":"155 Bd de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":4},{"id":20,"nom":"Lindt","adresse":"53 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":21,"nom":"My Little Warung","adresse":"46 Rue Mercière, 69002 Lyon","siret":"","email":"","tarifPassage":26.0,"passagesMoisDefaut":4},{"id":22,"nom":"Nuage Café","adresse":"16 Rue des Capucins, 69001 Lyon","siret":"","email":"","tarifPassage":30.0,"passagesMoisDefaut":4},{"id":23,"nom":"New Balance","adresse":"44 Rue de la République, 69002 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":4},{"id":24,"nom":"Pizzeria No.900 Vitton","adresse":"25 Cr Vitton, 69006 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":2},{"id":25,"nom":"Pomme de Pain Bellecour","adresse":"87 Rue de la République 69002 Lyon","siret":"","email":"","tarifPassage":11.66,"passagesMoisDefaut":12},{"id":26,"nom":"Promod Lyon Jacobins","adresse":"9 Pl. des Jacobins 69002 Lyon","siret":"","email":"","tarifPassage":18.33,"passagesMoisDefaut":12},{"id":27,"nom":"Star's Music Lyon","adresse":"247 Rue Marcel Mérieux, 69007 Lyon","siret":"","email":"","tarifPassage":21.25,"passagesMoisDefaut":8},{"id":28,"nom":"Millet Lyon","adresse":"42 Rue de Brest, 69002 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":29,"nom":"Mangarake Lyon","adresse":"31 Rue Victor Hugo, 69002 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":4},{"id":30,"nom":"Mephisto Shop","adresse":"14 Rue Grenette, 69002 Lyon","siret":"","email":"","tarifPassage":23.0,"passagesMoisDefaut":2},{"id":31,"nom":"Street Bangkok Lyon Opéra","adresse":"15 Rue de l'Arbre Sec, 69001 Lyon","siret":"","email":"","tarifPassage":19.0,"passagesMoisDefaut":8},{"id":32,"nom":"Herboristerie des Jacobins","adresse":"9 Rue de l'ancienne préfecture 69002 Lyon","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":4},{"id":33,"nom":"Noucadémie","adresse":"9 Rue des Marronniers, 69002 Lyon","siret":"","email":"","tarifPassage":19.0,"passagesMoisDefaut":4},{"id":34,"nom":"Cyclable Villeurbanne","adresse":"34 Rue Michel Servet, 69100 Villeurbanne","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":2},{"id":35,"nom":"Boulangerie Les Artistes","adresse":"26 Rue Chevreul, 69007 Lyon","siret":"","email":"","tarifPassage":21.0,"passagesMoisDefaut":4},{"id":36,"nom":"Pharmacie Jean Macé","adresse":"73 Av. Jean Jaurès, 69007 Lyon","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":4},{"id":37,"nom":"Carla Raffi","adresse":"55 Rue Molière, 69006 Lyon","siret":"","email":"","tarifPassage":21.0,"passagesMoisDefaut":4},{"id":38,"nom":"Caroll Villeurbanne","adresse":"15 Av. Henri Barbusse, 69100 Villeurbanne","siret":"","email":"","tarifPassage":26.0,"passagesMoisDefaut":4},{"id":39,"nom":"Aux grimoires romantiques","adresse":"5 Rue du Plat, 69002 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":2},{"id":40,"nom":"Okaidi","adresse":"12 Rue de Brest 69002 Lyon","siret":"","email":"","tarifPassage":25,"passagesMoisDefaut":8},{"id":41,"nom":"Maison 123","adresse":"8 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":42,"nom":"A.P.C. Lyon","adresse":"6 Rue Gasparin 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":43,"nom":"Aesop République","adresse":"49 Rue de la République, 69002 Lyon","siret":"","email":"","tarifPassage":10.5,"passagesMoisDefaut":4},{"id":44,"nom":"Aesop Lyon Herriot","adresse":"69 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":2},{"id":45,"nom":"Aigle Lyon","adresse":"62 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":9.1,"passagesMoisDefaut":4},{"id":46,"nom":"Figaret Lyon","adresse":"98 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":9.1,"passagesMoisDefaut":4},{"id":47,"nom":"Salomon Store Lyon","adresse":"7 Rue du Président Carnot, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":48,"nom":"Antonelle Lyon Herriot","adresse":"73 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":8.33,"passagesMoisDefaut":4},{"id":49,"nom":"Antonelle Croix Rousse","adresse":"33 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":13.75,"passagesMoisDefaut":4},{"id":50,"nom":"Antonelle Villeurbanne","adresse":"40 Av. Henri Barbusse, 69100 Villeurbanne","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":51,"nom":"Antonelle Lyon Lumiere","adresse":"75 Av. des Frères Lumière 69008 Lyon","siret":"","email":"","tarifPassage":27.5,"passagesMoisDefaut":2},{"id":52,"nom":"Artiste Audio","adresse":"17 Rue Alsace Lorraine, 69001 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":53,"nom":"Maroquinerie Barret","adresse":"10 Rue Grenette, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":54,"nom":"Bexely Herriot","adresse":"38 Rue du Président Édouard Herriot, 69001 Lyon","siret":"","email":"","tarifPassage":8.75,"passagesMoisDefaut":4},{"id":55,"nom":"Bexely Childebert","adresse":"4 Rue Childebert, 69002 Lyon","siret":"","email":"","tarifPassage":8.75,"passagesMoisDefaut":4},{"id":56,"nom":"Bexely Roosevelt","adresse":"51 Cr Franklin Roosevelt, 69006 Lyon","siret":"","email":"","tarifPassage":8.75,"passagesMoisDefaut":4},{"id":57,"nom":"Boggi Milano","adresse":"17 Rue du Président Édouard Herriot, 69001 Lyon","siret":"","email":"","tarifPassage":13.75,"passagesMoisDefaut":4},{"id":58,"nom":"Boutique Le Guillou","adresse":"30 Rue du Président Édouard Herriot, 69001 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":59,"nom":"Brasserie Bouillon Baratte","adresse":"25 Rue du Bât d'Argent, 69001 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":8},{"id":60,"nom":"La Boutique du Coiffeur","adresse":"5 Rue Victor Hugo, 69002 Lyon","siret":"","email":"","tarifPassage":18.75,"passagesMoisDefaut":4},{"id":61,"nom":"Boutique Yves Delorme","adresse":"17 Rue des Archers, 69002 Lyon","siret":"","email":"","tarifPassage":16.66,"passagesMoisDefaut":2},{"id":62,"nom":"Café Coton","adresse":"45 Pass. de l'Argue 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":63,"nom":"Calzedonia","adresse":"28 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":64,"nom":"Carré Blanc Lyon Brest","adresse":"33 Rue de Brest, 69002 Lyon","siret":"","email":"","tarifPassage":10.0,"passagesMoisDefaut":4},{"id":65,"nom":"Carré Blanc Lyon Lumiere","adresse":"92 Av. des Frères Lumière, 69008 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":66,"nom":"Carré Blanc Croix Rousse","adresse":"51 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":67,"nom":"Galerie Carré d'artistes","adresse":"37 Rue de Brest, 69002 Lyon","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":2},{"id":68,"nom":"C'est deux euros Lyon","adresse":"6 Rue Joseph Serlin, 69001 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":69,"nom":"Cerfogli Sarl","adresse":"26 Av. Maréchal de Saxe, 69006 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":70,"nom":"Chez Micheline","adresse":"14 Pl. Carnot 69002 Lyon","siret":"","email":"","tarifPassage":20.8,"passagesMoisDefaut":4},{"id":71,"nom":"Chocolat Weiss Lyon","adresse":"50 Rue de Brest 69002 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":4},{"id":72,"nom":"Christine Laure","adresse":"10 Rue Victor Hugo 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":73,"nom":"Fusalp Lyon","adresse":"8 Rue Gasparin 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":74,"nom":"Best Bagels Croix-Rousse","adresse":"5 Rue Victor Fort, 69004 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":75,"nom":"DEVRED1902","adresse":"59 Gd Rue de la Croix-Rousse 69004 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":76,"nom":"Distance Running Store","adresse":"1 Rue de la Platière, 69001 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":77,"nom":"DJI Store Lyon","adresse":"4 Rue du Président Carnot, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":78,"nom":"Du Pareil au même Saxe","adresse":"17 Av. Maréchal de Saxe, 69006 Lyon","siret":"","email":"","tarifPassage":22.5,"passagesMoisDefaut":4},{"id":79,"nom":"Element Store","adresse":"1 Rue Lanterne, 69001 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":80,"nom":"Enjoy Store","adresse":"61 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":81,"nom":"Etam Lingerie Croix Rousse","adresse":"9 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":8.33,"passagesMoisDefaut":4},{"id":82,"nom":"Etam Lingerie République","adresse":"83 Rue de la République, 69002 Lyon","siret":"","email":"","tarifPassage":8.33,"passagesMoisDefaut":4},{"id":83,"nom":"Levi's Republique","adresse":"49 Rue de la République, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":84,"nom":"Caroll Boutique Lumière","adresse":"91 Av. des Frères Lumière, 69008 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":85,"nom":"Adopt Parfums","adresse":"33 Rue Victor Hugo, 69002 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":86,"nom":"Gio Gio Pizzeria Lyon 2","adresse":"4 Rue Confort, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":87,"nom":"Gloriette","adresse":"20 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":88,"nom":"Nocibé Lyon Rousse","adresse":"4 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":12.92,"passagesMoisDefaut":4},{"id":89,"nom":"Nocibé Villeurbanne","adresse":"37 Av. Henri Barbusse, 69100 Villeurbanne","siret":"","email":"","tarifPassage":12.92,"passagesMoisDefaut":4},{"id":90,"nom":"Heschung Lyon","adresse":"7 Rue Gasparin, 69002 Lyon","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":2},{"id":91,"nom":"Human and Tea Auguste Comte","adresse":"23 Rue Sainte-Hélène, 69002 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":4},{"id":92,"nom":"Human and Tea Cordeliers","adresse":"11 Rue des Quatre Chapeaux, 69002 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":4},{"id":93,"nom":"IKKS Junior","adresse":"35 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":94,"nom":"Gilari","adresse":"11 Rue Molière, 69006 Lyon","siret":"","email":"","tarifPassage":7.9,"passagesMoisDefaut":4},{"id":95,"nom":"Jacadi Maréchal de Saxe","adresse":"24 Av. Maréchal de Saxe, 69006 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":96,"nom":"Jacadi Lyon Herriot","adresse":"51 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":97,"nom":"Jaeger-LeCoultre Lyon","adresse":"79 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":98,"nom":"Des Petits Hauts","adresse":"15 Rue Gasparin, 69002 Lyon","siret":"","email":"","tarifPassage":10.0,"passagesMoisDefaut":4},{"id":99,"nom":"Jott Lyon","adresse":"9 Rue Gasparin, 69002 Lyon","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":4},{"id":100,"nom":"Krys Croix Rousse","adresse":"2 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":101,"nom":"La Baguetterie Lyon","adresse":"2 Pl. Tobie Robatel, 69001 Lyon","siret":"","email":"","tarifPassage":8.33,"passagesMoisDefaut":4},{"id":102,"nom":"Librairie La Bande Dessinée","adresse":"50 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":103,"nom":"La Papéthèque Herriot","adresse":"42 Rue du Président Édouard Herriot, 69001 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":8},{"id":104,"nom":"La Papéthèque Foch","adresse":"15 Cr Franklin Roosevelt, 69006 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":4},{"id":105,"nom":"Comptoir de Mathilde St-Jean","adresse":"15 ter Rue Saint-Jean, 69005 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":106,"nom":"Le petit Souk","adresse":"10 Rue de Brest, 69002 Lyon","siret":"","email":"","tarifPassage":9.6,"passagesMoisDefaut":8},{"id":107,"nom":"Le petit Souk Lyon 6","adresse":"13 Pl. Maréchal Lyautey, 69006 Lyon","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":2},{"id":108,"nom":"Leonis","adresse":"7 Rue Molière, 69006 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":109,"nom":"Mariées du Rhône","adresse":"8 Pl. des Jacobins, 69002 Lyon","siret":"","email":"","tarifPassage":7.5,"passagesMoisDefaut":4},{"id":110,"nom":"Krys Herriot","adresse":"68 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":111,"nom":"Librairie Vivement Dimanche","adresse":"4 Rue du Chariot d'Or, 69004 Lyon","siret":"","email":"","tarifPassage":8.33,"passagesMoisDefaut":4},{"id":112,"nom":"Lingerie Blain","adresse":"12 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":113,"nom":"Ludivine Passion","adresse":"5 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":114,"nom":"Panerai Boutique","adresse":"8 Rue des Archers, 69002 Lyon","siret":"","email":"","tarifPassage":18.0,"passagesMoisDefaut":4},{"id":115,"nom":"Tudor Boutique","adresse":"97 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":116,"nom":"Fred Boutique","adresse":"91 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":117,"nom":"Rolex Boutique","adresse":"93 Rue du Président Édouard Herriot 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":118,"nom":"G-Shock Store Lyon","adresse":"6 Rue Gasparin, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":119,"nom":"MAIER Horloger","adresse":"99 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":120,"nom":"MAIER Joaillier Breitling","adresse":"101 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":121,"nom":"MAIER Vintage","adresse":"16 Rue des Archers, 69002 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":122,"nom":"Maison Malleval","adresse":"11 Rue Émile Zola, 69002 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":123,"nom":"Manfield","adresse":"7 Rue des Archers, 69002 Lyon","siret":"","email":"","tarifPassage":10.8,"passagesMoisDefaut":4},{"id":124,"nom":"L'appartement du dos","adresse":"2 Quai Jules Courmont, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":125,"nom":"MISS CRI","adresse":"7 Rue Molière, 69006 Lyon","siret":"","email":"","tarifPassage":9.1,"passagesMoisDefaut":4},{"id":126,"nom":"Mod'Express","adresse":"54 Rue Molière, 69006 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":127,"nom":"Momie Mangas Lyon","adresse":"51 Rue Victor Hugo, 69002 Lyon","siret":"","email":"","tarifPassage":14.5,"passagesMoisDefaut":4},{"id":128,"nom":"Un Jour Ailleurs Lyon","adresse":"39 Rue de Brest, 69002 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":129,"nom":"Papeterie Temps Libre","adresse":"16 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":10.8,"passagesMoisDefaut":4},{"id":130,"nom":"Perreyon 1884","adresse":"1 Rue Victor Hugo, 69002 Lyon","siret":"","email":"","tarifPassage":5.0,"passagesMoisDefaut":4},{"id":131,"nom":"Petit Bateau","adresse":"41 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":132,"nom":"Pharmacie des Charpennes","adresse":"28 Bis Rue Gabriel Péri, 69100 Villeurbanne","siret":"","email":"","tarifPassage":15.8,"passagesMoisDefaut":4},{"id":133,"nom":"Pharmacie Gratte-Ciel","adresse":"28 Av. Henri Barbusse 69100 Villeurbanne","siret":"","email":"","tarifPassage":15.8,"passagesMoisDefaut":4},{"id":134,"nom":"Pharmacie des Lions","adresse":"9 Pl. de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":135,"nom":"Pharmacie Anton & Willem","adresse":"7 Rue des Archers 69002 Lyon","siret":"","email":"","tarifPassage":7.9,"passagesMoisDefaut":4},{"id":136,"nom":"IPLN Photo et Vidéo","adresse":"17 Pl. Bellecour, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":137,"nom":"Pronovias","adresse":"16 Rue des Archers, 69002 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":138,"nom":"Jacqueline RIU Villeurbanne","adresse":"10 Av. Henri Barbusse, 69100 Villeurbanne","siret":"","email":"","tarifPassage":8.33,"passagesMoisDefaut":4},{"id":139,"nom":"Jacqueline RIU Lyon","adresse":"17 Rue Victor Hugo, 69002 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":140,"nom":"Devernois Lyon Herriot","adresse":"97 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":9.16,"passagesMoisDefaut":4},{"id":141,"nom":"SAINT JAMES Lyon 2","adresse":"44 Rue de Brest, 69002 Lyon","siret":"","email":"","tarifPassage":8.33,"passagesMoisDefaut":4},{"id":142,"nom":"Lisette Pizzi","adresse":"38 Pass. de l'Argue, 69002 Lyon","siret":"","email":"","tarifPassage":9.58,"passagesMoisDefaut":4},{"id":143,"nom":"Shoez Gallery","adresse":"15 B Rue d'Algérie, 69001 Lyon","siret":"","email":"","tarifPassage":13.75,"passagesMoisDefaut":4},{"id":144,"nom":"Caroll Lyon","adresse":"14 Cr Vitton, 69006 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":145,"nom":"Bouchara Lyon","adresse":"43 Rue Grenette, 69002 Lyon","siret":"","email":"","tarifPassage":13.75,"passagesMoisDefaut":8},{"id":146,"nom":"La Bagagerie","adresse":"25 Rue Gasparin, 69002 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":147,"nom":"Sellerie Victor Hugo","adresse":"5 Rue Victor Hugo, 69002 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":148,"nom":"Celio Lyon","adresse":"52 Rue de la République, 69002 Lyon","siret":"","email":"","tarifPassage":6.66,"passagesMoisDefaut":8},{"id":149,"nom":"Celio Villeurbanne","adresse":"37 Av. Henri Barbusse, 69100 Villeurbanne","siret":"","email":"","tarifPassage":8.33,"passagesMoisDefaut":4},{"id":150,"nom":"Shan et Co","adresse":"56 Rue Greuze, 69100 Villeurbanne","siret":"","email":"","tarifPassage":13.75,"passagesMoisDefaut":4},{"id":151,"nom":"Slake Coffee Jacobins","adresse":"9 Rue de l'Ancienne Préfecture, 69002 Lyon","siret":"","email":"","tarifPassage":20.0,"passagesMoisDefaut":4},{"id":152,"nom":"Tape à l'oeil Villeurbanne","adresse":"29 Av. Henri Barbusse, 69100 Villeurbanne","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":153,"nom":"Terre de Running Lyon","adresse":"8 Rue de la Barre, 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":154,"nom":"The Kooples Herriot","adresse":"76 Rue du Président Édouard Herriot, 69002 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":155,"nom":"The Kooples Saxe","adresse":"16 Av. Maréchal de Saxe, 69006 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":156,"nom":"Tout l'Monde en Parle Roosevelt","adresse":"17 Cr Franklin Roosevelt, 69006 Lyon","siret":"","email":"","tarifPassage":13.33,"passagesMoisDefaut":4},{"id":157,"nom":"Tout l'Monde en Parle Victor Hugo","adresse":"50 Rue Victor Hugo, 69002 Lyon","siret":"","email":"","tarifPassage":13.33,"passagesMoisDefaut":4},{"id":158,"nom":"Tout l'Monde en Parle Quai","adresse":"10 Quai Saint-Antoine, 69002 Lyon","siret":"","email":"","tarifPassage":13.33,"passagesMoisDefaut":4},{"id":159,"nom":"Un Jour Ailleurs Villeurbanne","adresse":"37 Av. Henri Barbusse, 69100 Villeurbanne","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":160,"nom":"Timberland","adresse":"5 Rue Childebert, 69002 Lyon","siret":"","email":"","tarifPassage":8.33,"passagesMoisDefaut":4},{"id":161,"nom":"Wall Street Skateshop","adresse":"7 Rue de la Platière, 69001 Lyon","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":162,"nom":"Weekend Maréchal de Saxe","adresse":"19 Av. Maréchal de Saxe, 69006 Lyon","siret":"","email":"","tarifPassage":12.5,"passagesMoisDefaut":4},{"id":163,"nom":"SAGA COSMETICS Lyon","adresse":"15 Rue Victor Hugo, 69002 Lyon","siret":"","email":"","tarifPassage":13.33,"passagesMoisDefaut":4},{"id":164,"nom":"Yves Rocher République","adresse":"48 Rue de la République, 69002 Lyon","siret":"","email":"","tarifPassage":6.25,"passagesMoisDefaut":8},{"id":165,"nom":"Yves Rocher Croix Rousse","adresse":"23 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":8.33,"passagesMoisDefaut":4},{"id":166,"nom":"Yves Rocher Villeurbanne","adresse":"15 Av. Henri Barbusse 69100 Villeurbanne","siret":"","email":"","tarifPassage":17.5,"passagesMoisDefaut":4},{"id":167,"nom":"Modern Style Villeurbanne","adresse":"32 Av. Henri Barbusse, 69100 Villeurbanne","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":168,"nom":"La Brioche Dorée","adresse":"87 Rue de la République, 69002 Lyon","siret":"","email":"","tarifPassage":9.38,"passagesMoisDefaut":8},{"id":169,"nom":"School Rag","adresse":"1 Rue des Quatre Chapeaux, 69002 Lyon","siret":"","email":"","tarifPassage":25.0,"passagesMoisDefaut":4},{"id":170,"nom":"Undiz Lyon République","adresse":"45 Rue de la République 69002 Lyon","siret":"","email":"","tarifPassage":22.5,"passagesMoisDefaut":8},{"id":171,"nom":"Comptoir de Mathilde Brest","adresse":"54 Rue de Brest 69002 Lyon","siret":"","email":"","tarifPassage":15.0,"passagesMoisDefaut":4},{"id":172,"nom":"Maroquinerie Croix Roussienne","adresse":"14 Gd Rue de la Croix-Rousse, 69004 Lyon","siret":"","email":"","tarifPassage":7.5,"passagesMoisDefaut":4}];

function formatEur(n) {
  return Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function saveData(key, data) {
  try { window.localStorage.setItem(key, JSON.stringify(data)); } catch(e) {}
}
function loadData(key, fallback) {
  try {
    const d = window.localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch(e) { return fallback; }
}

// Print invoice as PDF
function printFacture(f) {
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Facture ${f.numero}</title>
  <style>
    body{font-family:Arial,sans-serif;margin:0;padding:32px;color:#1a1a1a;max-width:680px;margin:auto}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #1a1a1a}
    .logo-area{display:flex;align-items:center;gap:14px}
    .company{font-size:20px;font-weight:900}.sub{font-size:12px;color:#666;margin-top:2px}
    .facture-title{text-align:right}.facture-num{font-size:22px;font-weight:900}.facture-ref{color:#3b9ddd;font-weight:700;font-size:14px}
    .addresses{display:grid;grid-template-columns:1fr 1fr;gap:24px;background:#f8fafc;padding:20px;border-radius:8px;margin-bottom:28px}
    .addr-label{font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
    .addr-name{font-weight:700;font-size:14px;margin-bottom:4px}
    .addr-detail{font-size:12px;color:#555;line-height:1.6}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    thead tr{background:#1a1a1a;color:white}
    th{padding:10px 12px;text-align:left;font-size:12px;font-weight:700}
    td{padding:12px;font-size:13px;border-bottom:1px solid #eee}
    .totals{float:right;width:240px}
    .total-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#555}
    .total-final{display:flex;justify-content:space-between;padding:10px 0 6px;font-size:17px;font-weight:900;color:#1a1a1a;border-top:2px solid #1a1a1a;margin-top:8px}
    .footer{margin-top:40px;padding:14px;background:#f0fdf4;border-radius:8px;font-size:12px;color:#166534}
    .red-triangle{width:0;height:0;border-left:18px solid transparent;border-right:18px solid transparent;border-bottom:32px solid #cc2222;display:inline-block;margin-right:4px;vertical-align:middle}
  </style></head><body>
  <div class="header">
    <div class="logo-area">
      <svg width="52" height="52" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="#1a1a1a"/><polygon points="100,18 182,158 18,158" fill="none" stroke="#fff" stroke-width="7"/><polygon points="100,55 155,148 45,148" fill="#cc2222"/><path d="M 18,158 Q 100,185 182,158" fill="none" stroke="#fff" stroke-width="7"/></svg>
      <div><div class="company">D2S Services</div><div class="sub">Collecte & Gestion des Déchets</div><div class="sub">SIRET : 922 583 679 00019 | TVA : FR94922583679</div></div>
    </div>
    <div class="facture-title">
      <div class="facture-num">FACTURE</div>
      <div class="facture-ref">${f.numero}</div>
      <div style="font-size:12px;color:#666;margin-top:4px">Émise le ${f.date}</div>
    </div>
  </div>
  <div class="addresses">
    <div><div class="addr-label">Émetteur</div><div class="addr-name">D2S Services SASU</div><div class="addr-detail">Paris, France<br>SIRET : 922 583 679 00019</div></div>
    <div><div class="addr-label">Destinataire</div><div class="addr-name">${f.client.nom}</div><div class="addr-detail">${f.client.adresse}${f.client.email ? '<br>' + f.client.email : ''}</div></div>
  </div>
  <table>
    <thead><tr><th>Description</th><th style="text-align:center">Qté</th><th style="text-align:right">PU HT</th><th style="text-align:right">Total HT</th></tr></thead>
    <tbody><tr>
      <td>Collecte de déchets — ${MONTHS[f.mois]} ${f.annee}</td>
      <td style="text-align:center;font-weight:700">${f.nbPassages}</td>
      <td style="text-align:right">${formatEur(f.tarifPassage)}</td>
      <td style="text-align:right;font-weight:700">${formatEur(f.ht)}</td>
    </tr></tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span>Montant HT</span><span>${formatEur(f.ht)}</span></div>
    <div class="total-row"><span>TVA (20%)</span><span>${formatEur(f.tva)}</span></div>
    <div class="total-final"><span>Total TTC</span><span>${formatEur(f.ttc)}</span></div>
  </div>
  <div style="clear:both"></div>
  <div class="footer"><strong>Paiement :</strong> Virement bancaire sous 30 jours à réception de facture</div>
  <script>window.onload=()=>{window.print();}</script>
  </body></html>`);
  w.document.close();
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [clients, setClients] = useState(() => loadData(STORAGE_KEY_CLIENTS, CLIENTS_INIT));
  const [factures, setFactures] = useState(() => loadData(STORAGE_KEY_FACTURES, []));
  const [passages, setPassages] = useState(() => loadData(STORAGE_KEY_PASSAGES, {}));
  const [moisSel, setMoisSel] = useState(new Date().getMonth());
  const [anneeSel, setAnneeSel] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [viewFacture, setViewFacture] = useState(null);
  const [form, setForm] = useState({ nom:"", adresse:"", siret:"", email:"", tarifPassage:"" });
  const [toast, setToast] = useState(null);
  const [nextId, setNextId] = useState(() => loadData("d2s_nextid", 173));
  const [nextNum, setNextNum] = useState(() => loadData("d2s_nextnum", 1001));

  // Auto-save
  useEffect(() => { saveData(STORAGE_KEY_CLIENTS, clients); }, [clients]);
  useEffect(() => { saveData(STORAGE_KEY_FACTURES, factures); }, [factures]);
  useEffect(() => { saveData(STORAGE_KEY_PASSAGES, passages); }, [passages]);
  useEffect(() => { saveData("d2s_nextid", nextId); }, [nextId]);
  useEffect(() => { saveData("d2s_nextnum", nextNum); }, [nextNum]);

  function showToast(msg, type="success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const passageKey = (id) => `${anneeSel}-${moisSel}-${id}`;
  function getPassages(id) { return passages[passageKey(id)] ?? ""; }
  function setPassage(id, val) {
    const v = val === "" ? "" : Math.max(0, parseInt(val) || 0);
    setPassages(prev => ({ ...prev, [passageKey(id)]: v }));
  }

  const filteredClients = useMemo(() =>
    clients.filter(c => c.nom.toLowerCase().includes(search.toLowerCase()) || c.adresse.toLowerCase().includes(search.toLowerCase())),
    [clients, search]
  );

  function genererFactures() {
    const nouvelles = [];
    let num = nextNum;
    clients.forEach(c => {
      const nb = parseInt(getPassages(c.id)) || 0;
      if (nb === 0) return;
      const ht = nb * c.tarifPassage;
      const tva = ht * TVA;
      nouvelles.push({
        id: num,
        numero: `D2S-${anneeSel}-${String(num).padStart(4,"0")}`,
        client: { ...c },
        mois: moisSel, annee: anneeSel,
        nbPassages: nb, tarifPassage: c.tarifPassage,
        ht, tva, ttc: ht + tva,
        date: new Date().toLocaleDateString("fr-FR"),
        statut: "En attente",
      });
      num++;
    });
    if (nouvelles.length === 0) { showToast("Aucun passage saisi.", "error"); return; }
    setNextNum(num);
    setFactures(prev => [...prev, ...nouvelles]);
    showToast(`${nouvelles.length} facture(s) générée(s) !`);
    setPage("factures");
  }

  function toggleStatut(id) {
    setFactures(prev => prev.map(f => f.id === id ? { ...f, statut: f.statut === "En attente" ? "Payée" : "En attente" } : f));
  }

  function submitClient(e) {
    e.preventDefault();
    if (editClient) {
      setClients(prev => prev.map(c => c.id === editClient.id ? { ...c, ...form, tarifPassage: parseFloat(form.tarifPassage) } : c));
      showToast("Client modifié !");
    } else {
      const newId = nextId;
      setClients(prev => [...prev, { id: newId, ...form, tarifPassage: parseFloat(form.tarifPassage) }]);
      setNextId(newId + 1);
      showToast("Client ajouté !");
    }
    setShowClientForm(false); setEditClient(null);
    setForm({ nom:"", adresse:"", siret:"", email:"", tarifPassage:"" });
  }

  const totalMoisEstime = clients.reduce((acc, c) => {
    const nb = parseInt(getPassages(c.id)) || 0;
    return acc + nb * c.tarifPassage * (1 + TVA);
  }, 0);

  const facturesEnAttente = factures.filter(f => f.statut === "En attente");
  const caEncaisse = factures.filter(f => f.statut === "Payée").reduce((a,f) => a+f.ttc, 0);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const bg = "#0c1220", card = "#101828", border = "#1a2740", accent = "#3b9ddd", text = "#dde4f0", muted = "#4a6a9a";
  const isMobile = window.innerWidth < 700;

  const S = {
    wrap: { fontFamily:"'DM Sans','Segoe UI',sans-serif", minHeight:"100vh", background:bg, color:text, paddingBottom: isMobile ? 72 : 0 },
    sidebar: { position:"fixed", left:0, top:0, bottom:0, width:220, background:card, borderRight:`1px solid ${border}`, display:"flex", flexDirection:"column", padding:"20px 0", zIndex:100 },
    bottomNav: { position:"fixed", bottom:0, left:0, right:0, background:card, borderTop:`1px solid ${border}`, display:"flex", zIndex:100 },
    main: { padding: isMobile ? "20px 16px 24px" : "28px 32px", marginLeft: isMobile ? 0 : 220 },
    card: { background:card, borderRadius:12, border:`1px solid ${border}` },
    btn: (bg2, color2) => ({ background:bg2, color:color2, border:"none", borderRadius:8, padding:"10px 16px", fontWeight:700, cursor:"pointer", fontSize:13, WebkitTapHighlightColor:"transparent" }),
    input: { width:"100%", background:bg, color:text, border:`1px solid ${border}`, borderRadius:8, padding:"10px 12px", fontSize:16, boxSizing:"border-box" },
    th: { padding:"10px 14px", textAlign:"left", fontSize:10, fontWeight:700, letterSpacing:1, color:muted, textTransform:"uppercase", background:bg },
    td: { padding:"12px 14px", borderTop:`1px solid ${border}20`, fontSize:13 },
  };

  const navItems = [
    { id:"dashboard", label:"Accueil", icon:"◈" },
    { id:"passages", label:"Passages", icon:"✎" },
    { id:"clients", label:"Clients", icon:"◉" },
    { id:"factures", label:"Factures", icon:"⊞" },
  ];

  return (
    <div style={S.wrap}>
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:16, right:16, left:16, zIndex:9999, background: toast.type==="error"?"#ef4444":"#22c55e", color:"white", padding:"12px 18px", borderRadius:10, fontWeight:700, fontSize:14, boxShadow:"0 8px 24px rgba(0,0,0,0.4)", textAlign:"center" }}>
          {toast.msg}
        </div>
      )}

      {/* SIDEBAR desktop */}
      {!isMobile && (
        <div style={S.sidebar}>
          <div style={{ padding:"0 18px 20px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${border}` }}>
            <D2SLogo size={40} />
            <div>
              <div style={{ fontSize:14, fontWeight:900, color:"#f1f5f9" }}>D2S Services</div>
              <div style={{ fontSize:10, color:muted, fontWeight:600, letterSpacing:1 }}>FACTURATION</div>
            </div>
          </div>
          <div style={{ padding:"12px 0" }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                display:"flex", alignItems:"center", gap:10, width:"100%",
                padding:"11px 18px", border:"none", cursor:"pointer",
                background: page===item.id ? `linear-gradient(90deg,#1a3a60,${bg})` : "transparent",
                color: page===item.id ? accent : muted,
                borderLeft: page===item.id ? `3px solid ${accent}` : "3px solid transparent",
                fontSize:13, fontWeight: page===item.id ? 700:500, textAlign:"left",
              }}>
                <span style={{ fontSize:16 }}>{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
          <div style={{ marginTop:"auto", padding:"14px 18px", borderTop:`1px solid ${border}`, fontSize:11, color:muted }}>
            <div>💾 Données sauvegardées</div>
            <div style={{ marginTop:3 }}>{clients.length} clients · {factures.length} factures</div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV mobile */}
      {isMobile && (
        <div style={S.bottomNav}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              flex:1, padding:"10px 0", border:"none", cursor:"pointer",
              background: page===item.id ? "#1a2740" : "transparent",
              color: page===item.id ? accent : muted,
              fontSize:10, fontWeight:700, display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              borderTop: page===item.id ? `2px solid ${accent}` : "2px solid transparent",
            }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* MAIN */}
      <div style={S.main}>

        {/* Header mobile */}
        {isMobile && (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <D2SLogo size={34} />
            <div>
              <div style={{ fontSize:16, fontWeight:900, color:"#f1f5f9" }}>D2S Services</div>
              <div style={{ fontSize:10, color:muted }}>Facturation · 💾 Auto-sauvegarde</div>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <div>
            {!isMobile && <h1 style={{ fontSize:22, fontWeight:900, marginBottom:20 }}>Tableau de bord</h1>}
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap:12, marginBottom:20 }}>
              {[
                { label:"Clients", val:clients.length, color:accent },
                { label:"Factures", val:factures.length, color:"#a78bfa" },
                { label:"En attente", val:facturesEnAttente.length, color:"#fbbf24" },
                { label:"CA encaissé", val:formatEur(caEncaisse), color:"#34d399" },
              ].map((s,i) => (
                <div key={i} style={{ ...S.card, padding:"16px" }}>
                  <div style={{ fontSize: isMobile ? 22 : 26, fontWeight:900, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11, color:muted, fontWeight:600, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {facturesEnAttente.length > 0 && (
              <div style={S.card}>
                <div style={{ padding:"13px 16px", borderBottom:`1px solid ${border}`, fontWeight:700, fontSize:14 }}>⏳ En attente de paiement</div>
                {facturesEnAttente.slice(0,5).map(f => (
                  <div key={f.id} style={{ padding:"12px 16px", borderTop:`1px solid ${border}20`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{f.client.nom}</div>
                      <div style={{ fontSize:11, color:muted }}>{f.numero} · {MONTHS[f.mois].slice(0,3)}. {f.annee}</div>
                    </div>
                    <div style={{ fontWeight:900, color:"#fbbf24", fontSize:15 }}>{formatEur(f.ttc)}</div>
                  </div>
                ))}
              </div>
            )}
            {factures.length === 0 && (
              <div style={{ textAlign:"center", padding:"40px 0", color:muted }}>
                <D2SLogo size={56} />
                <div style={{ marginTop:14, fontSize:15, fontWeight:600 }}>Saisissez les passages du mois</div>
                <button onClick={() => setPage("passages")} style={{ ...S.btn(accent,"#0c1220"), marginTop:14 }}>Commencer →</button>
              </div>
            )}
          </div>
        )}

        {/* PASSAGES */}
        {page === "passages" && (
          <div>
            <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight:900, marginBottom:16 }}>Saisie des passages</h1>
            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              <select value={moisSel} onChange={e=>setMoisSel(+e.target.value)} style={{ ...S.input, width:"auto", fontSize:14 }}>
                {MONTHS.map((m,i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select value={anneeSel} onChange={e=>setAnneeSel(+e.target.value)} style={{ ...S.input, width:90, fontSize:14 }}>
                {[2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <input placeholder="🔍 Rechercher…" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...S.input, flex:1, minWidth:140 }} />
            </div>
            {totalMoisEstime > 0 && (
              <div style={{ ...S.card, padding:"12px 16px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13, color:muted }}>Estimation TTC du mois</span>
                <span style={{ fontWeight:900, color:"#34d399", fontSize:18 }}>{formatEur(totalMoisEstime)}</span>
              </div>
            )}
            <div style={{ ...S.card, overflow:"hidden" }}>
              {filteredClients.map((c, i) => {
                const nb = parseInt(getPassages(c.id)) || 0;
                const ttc = nb * c.tarifPassage * (1 + TVA);
                return (
                  <div key={c.id} style={{ padding:"12px 14px", borderTop: i>0 ? `1px solid ${border}20` : "none", display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.nom}</div>
                      <div style={{ fontSize:11, color:muted }}>{formatEur(c.tarifPassage)}/passage</div>
                    </div>
                    <input type="number" min="0" inputMode="numeric" value={getPassages(c.id)} onChange={e=>setPassage(c.id,e.target.value)} placeholder="0"
                      style={{ width:60, background:bg, color:text, border:`1px solid ${border}`, borderRadius:8, padding:"8px", fontSize:18, fontWeight:900, textAlign:"center" }} />
                    <div style={{ width:80, textAlign:"right", fontWeight:800, color: nb>0 ? "#34d399":muted, fontSize:14 }}>
                      {nb > 0 ? formatEur(ttc) : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={genererFactures} style={{
              ...S.btn("linear-gradient(135deg,#3b9ddd,#7c4dff)", "white"),
              width:"100%", marginTop:16, padding:"15px", fontSize:15,
              boxShadow:"0 4px 20px rgba(59,157,221,0.35)", borderRadius:12,
            }}>⚡ Générer les factures — {MONTHS[moisSel]}</button>
          </div>
        )}

        {/* CLIENTS */}
        {page === "clients" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight:900 }}>Clients ({clients.length})</h1>
              <button onClick={() => { setEditClient(null); setForm({nom:"",adresse:"",siret:"",email:"",tarifPassage:""}); setShowClientForm(true); }} style={S.btn(accent,"#0c1220")}>+ Ajouter</button>
            </div>
            <input placeholder="🔍 Rechercher un client…" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...S.input, marginBottom:14 }} />
            <div style={S.card}>
              {filteredClients.map((c, i) => (
                <div key={c.id} style={{ padding:"12px 14px", borderTop: i>0 ? `1px solid ${border}20`:"none", display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:13 }}>{c.nom}</div>
                    <div style={{ fontSize:11, color:muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.adresse}</div>
                    {c.email && <div style={{ fontSize:11, color:accent }}>{c.email}</div>}
                  </div>
                  <div style={{ fontWeight:900, color:accent, fontSize:14, whiteSpace:"nowrap" }}>{formatEur(c.tarifPassage)}</div>
                  <button onClick={() => { setEditClient(c); setForm({nom:c.nom,adresse:c.adresse,siret:c.siret||"",email:c.email||"",tarifPassage:String(c.tarifPassage)}); setShowClientForm(true); }}
                    style={{ background:"#1a2740", color:"#60b4f0", border:"none", borderRadius:6, padding:"6px 10px", cursor:"pointer", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>✏️</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FACTURES */}
        {page === "factures" && (
          <div>
            <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight:900, marginBottom:14 }}>Factures ({factures.length})</h1>
            {factures.length === 0 ? (
              <div style={{ textAlign:"center", padding:"50px 0", color:muted }}>
                <div style={{ fontSize:36, marginBottom:12 }}>⊞</div>
                <div>Aucune facture générée</div>
              </div>
            ) : (
              <div style={S.card}>
                {[...factures].reverse().map((f, i) => (
                  <div key={f.id} style={{ padding:"13px 14px", borderTop: i>0 ? `1px solid ${border}20`:"none" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:13 }}>{f.client.nom}</div>
                        <div style={{ fontSize:11, color:muted }}>{f.numero} · {MONTHS[f.mois].slice(0,3)}. {f.annee} · {f.nbPassages} passages</div>
                      </div>
                      <div style={{ fontWeight:900, fontSize:16, marginLeft:10 }}>{formatEur(f.ttc)}</div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => toggleStatut(f.id)} style={{
                        background: f.statut==="Payée" ? "#14532d":"#78350f",
                        color: f.statut==="Payée" ? "#4ade80":"#fbbf24",
                        border:"none", borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, cursor:"pointer"
                      }}>{f.statut==="Payée" ? "✓ Payée":"⏳ En attente"}</button>
                      <button onClick={() => setViewFacture(f)} style={{ background:"#1a2740", color:"#60b4f0", border:"none", borderRadius:20, padding:"4px 12px", cursor:"pointer", fontSize:11, fontWeight:600 }}>👁 Voir</button>
                      <button onClick={() => printFacture(f)} style={{ background:"#1a2740", color:"#34d399", border:"none", borderRadius:20, padding:"4px 12px", cursor:"pointer", fontSize:11, fontWeight:600 }}>🖨 PDF</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL FACTURE */}
      {viewFacture && (
        <div onClick={() => setViewFacture(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:1000, padding: isMobile ? 0 : 24 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"white", color:"#1a1a1a", borderRadius: isMobile ? "16px 16px 0 0" : 14, padding: isMobile ? "24px 20px" : 36, width:"100%", maxWidth:600, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <D2SLogo size={44} />
                <div>
                  <div style={{ fontSize:17, fontWeight:900, color:"#0f172a" }}>D2S Services</div>
                  <div style={{ fontSize:11, color:"#6b7280" }}>SIRET : 922 583 679 00019</div>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:900 }}>FACTURE</div>
                <div style={{ fontSize:13, color:"#3b9ddd", fontWeight:700 }}>{viewFacture.numero}</div>
                <div style={{ fontSize:11, color:"#6b7280" }}>{viewFacture.date}</div>
              </div>
            </div>
            <div style={{ background:"#f8fafc", borderRadius:8, padding:"14px 16px", marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Destinataire</div>
              <div style={{ fontWeight:700, fontSize:14 }}>{viewFacture.client.nom}</div>
              <div style={{ fontSize:13, color:"#4b5563" }}>{viewFacture.client.adresse}</div>
              {viewFacture.client.email && <div style={{ fontSize:13, color:"#3b9ddd" }}>{viewFacture.client.email}</div>}
            </div>
            <div style={{ background:"#f8fafc", borderRadius:8, padding:"14px 16px", marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                <span>Collecte déchets — {MONTHS[viewFacture.mois]} {viewFacture.annee}</span>
                <span style={{ fontWeight:700 }}>{viewFacture.nbPassages} passages</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#6b7280" }}>
                <span>Prix unitaire HT</span><span>{formatEur(viewFacture.tarifPassage)}</span>
              </div>
            </div>
            <div style={{ borderTop:"1px solid #e5e7eb", paddingTop:12 }}>
              {[["Montant HT", formatEur(viewFacture.ht), false],["TVA 20%", formatEur(viewFacture.tva), false],["Total TTC", formatEur(viewFacture.ttc), true]].map(([l,v,b]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", fontWeight:b?900:500, fontSize:b?18:14, borderTop:b?"2px solid #0f172a":"none", marginTop:b?8:0 }}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, padding:"11px 14px", background:"#f0fdf4", borderRadius:8, fontSize:12, color:"#166534" }}>
              Paiement par virement sous 30 jours
            </div>
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button onClick={() => printFacture(viewFacture)} style={{ flex:1, background:"#0f172a", color:"white", border:"none", borderRadius:8, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer" }}>🖨 Imprimer / PDF</button>
              <button onClick={() => setViewFacture(null)} style={{ background:"#f1f5f9", color:"#334155", border:"none", borderRadius:8, padding:"12px 20px", cursor:"pointer", fontWeight:700, fontSize:14 }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CLIENT */}
      {showClientForm && (
        <div onClick={() => setShowClientForm(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:1000 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:card, borderRadius:"16px 16px 0 0", padding:"24px 20px", width:"100%", maxWidth:520, border:`1px solid ${border}`, maxHeight:"90vh", overflowY:"auto" }}>
            <h2 style={{ fontWeight:900, marginBottom:20, fontSize:17 }}>{editClient ? "Modifier le client":"Nouveau client"}</h2>
            <form onSubmit={submitClient}>
              {[["nom","Nom / Boutique","text"],["adresse","Adresse","text"],["siret","SIRET (optionnel)","text"],["email","Email (optionnel)","email"],["tarifPassage","Tarif par passage (€ HT)","number"]].map(([k,l,t]) => (
                <div key={k} style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:accent, display:"block", marginBottom:5 }}>{l}</label>
                  <input type={t} required={k!=="siret"&&k!=="email"} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={S.input} />
                </div>
              ))}
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                <button type="button" onClick={() => setShowClientForm(false)} style={{ ...S.btn("#1a2740",text), flex:1 }}>Annuler</button>
                <button type="submit" style={{ ...S.btn(accent,"#0c1220"), flex:2, padding:"13px" }}>{editClient ? "Enregistrer":"Ajouter"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
