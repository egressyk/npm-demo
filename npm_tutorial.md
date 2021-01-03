# NPM csomagok

## Mi az NPM?

Node Package Manager, egyfelől egy szoftver repó, Javascript modulok, könyvtárak, keretrendszerek megosztására, másfelől egy alkalmazás ezen csomagok kezelésére.

A megosztott csomagok elérhetőségüket tekintve lehetnek publikusak, amelyeket bárki telepíthet magának, és privátok, melyeket csak mi és a felvett kollaborálók használhatnak.
___

## Egyszerű NPM csomag létrehozása és közzététele

### **Hozzunk létre accountot**
Ha szeretnénk a világháló teleszemeteléséhez fokozottan hozzájárulni egy saját kis npm csomaggal, akkor az első elengedhetetlen lépés, hogy létrehozzunk egy npm accountot magunknak az alábbi oldalon: https://www.npmjs.com/

*Megjegyzés: Ingyenes accounttal csak publikus packageket hozhatunk létre.*

Ha ezzel megvagyunk, akkor az alábbi paranccsal azonosíthatjuk magunkat a terminálban:
``` bash
npm login
```

### **Inicializáljuk a csomagot**

A második előfeltétele egy [package.json](https://docs.npmjs.com/files/package.json) file. Ez a csomagunk manifesztje, ez tartalmazza a rá vonatkozó legfontosabb adatokat és beállításokat. Parancssorból az alábbi paranccsal hozhatjuk létre:
``` bash
npm init
```

Amennyiben a csomagunkat publikálni szeretnénk, akkor a `package.json` két elengedhetetlen mezeje a name és a version. Ez a két mező együttesen egyedi azonosítót alkot a csomagot illetően.

A csomagunk neve meg kell, hogy feleljen néhány [kritériumnak](https://docs.npmjs.com/package-name-guidelines), a közzététel minimális előfeltételeként például annak, hogy egyedi legyen. Amennyiben a megálmodott név már foglalt, vagy szeretnénk valamiképpen a különféle csomagjainkat szemantikailag is összekapcsolni, akkor használhatunk a névben úgynevezett [scope](https://docs.npmjs.com/misc/scope)-ot. Evvel egy saját “namespace” alá rendelhetjük a megosztott csomagokat, így eztán nem kell aggódnunk, hogy valaki már szintén használja a “my-awesome-utils” nevet.

A scope-ozott név formátuma:
`@\<scope neve>/\<csomag neve>`

### **Tegyük bele a cuccot**

A frissen inicializált csomagunkban egy árva package.json fájl van még csupán, ideje hát hozzárakni a remek kis tartalmunkat. Hozzunk hát létre az alábbi struktúrát:
```
📂src
 |--📝index.js
📝package.json
```

Majd az `index.js`-be írjuk bele valami frappánsat és eredetit, amivel megkönnyíthetjük mások életét:

``` javascript
exports.hello = function (name = 'World') {
    console.log(`Hello ${name}!`);
}
```
A `package.json`-ban állítsuk be az index fájlunk elérési útját:
``` json
"main": "./src/index.js"
```

### **Kóstoljunk pudingot**

Most, hogy elkészült a hasznos kis csomagunk ideje kipróbálni, hogy nem rontottuk-e ezt is el, mint ezelőtt már oly sok mindent az életben. Egészítsük ki a könyvtárszerkezetünket: 

```
📂src
 |--📝index.js
📂devtest
 |--📝index.js
📝package.json
```

Majd futtassuk az alábbiakat:
``` bash
cd devtest
npm init -y
```

Inicializáltuk hát a `devtest` projektünket, ideje telepíteni a csomagunkat. Publikálás nélkül az alábbi opcióink vannak erre. Az egyik a jólmegszokott `npm install` használata, a másik az `npm link` parancsé. Ha csupán helyben szeretnénk tesztelni a csomagunkat, akkor személy szerint az elsőt explicitebbnek érzem, és elkerülhetjük vele, hogy  bele piszkáljunk a globális node modulba, cserébe beégetjük a fájl elérési útvonalát a függőségek közé. Ha jobban el akartok merülni ebben a kérdésben, akkor [íme](https://medium.com/@the1mills/how-to-test-your-npm-module-without-publishing-it-every-5-minutes-1c4cb4b369be).

A két mód tehát:

* A `devtest` mappában állva és írjuk be az alábbi parancsot:
    ``` bash
    npm install ../
    ```

    A megszokott módon telepítettük evvel a csomagunkat. A `package.json`-ban meg is jelenik a függőség.

* Álljunk a csomagunk mappájába majd írjuk be az alábbi parancsokat:
    ``` bash
    npm link
    cd devtest
    npm link <csomag neve>
    ```

    Ezáltal symbolic linkekkel kötjük össze a dolgokat, a package.json pedig változatlan marad. A linkeket a npm unlink paranccsal szüntethetjük meg, a megfelelő mappában állva a megfelelő paranccsal:
    ``` bash
    npm unlink <csomag neve>
    npm unlink
    ```

Miután sikeresen elérhetővé tettük a csomagunkat a tesztelő projektünkben ideje felhasználnunk azt. Írjuk hát a `devtest` mappákban lévő `index.js`-be a következőket:

``` javascript
const npmDemo = require('@egressyk/npm-demo');
npmDemo.hello('cica');
```

Majd futtassuk az alábbi parancsot a devtest mappánkban állva:
``` bash
node .
```

Ha minden jól ment, akkor a “Hello cica!” felirat köszön vissza a konzolon.

### **Ignorációk**

Ezen a ponton eljött az ideje, hogy hozzácsapjunk a projektünkhöz egy `.gitignore`-t és egy `.npmignore`-t. 

```
📂src
 |--📝index.js
📂devtest
 |--📂node_modules
 |--📝index.js
 |--📝package-lock.json
 |--📝package.json
📝.gitignore
📝.npmignore
📝package.json
```

Amennyiben az utóbbit nem hozzuk létre, akkor az npm csomagunkra is a `.gitignore` lesz érvényes, azonban, ha létezik `.npmignore` fájl, akkor annak a tartalma lesz a döntő a csomag publikálásakor. Ezt jó ha észben tartjuk, nehogy úgy járjunk, mint a [kissé frusztrált kolléga](https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d).

Érdemes végiggondolni, hogy mit hova szeretnénk elmenteni. Adott esetben például a git-re talán fel szeretnénk tenni a kis `devtest` projektünket is, viszont annak `node_modules` mappáját nem. Míg az npm repójából teljes egészében szeretnénk kihagyni a `devtest` mappát.

### **Publikáció**

Elértünk oda, hogy közszemlére tehessük a kis csúnyánkat. Ennek előfeltétele, hogy a ne legyenek nem committolt változtatásaink. Ha minden változást mentettünk a publikálás előtt be kell állítanunk a verziót. Ezt szintén a `package.json`-ban találjuk.
Ha akarjunk természetesen átírhatjuk közvetlenül a fájlban is, használhatjuk az alábbi parancsot is:

``` bash
npm version <verzió>
```

Jelentős különbség, hogy ez útóbbi automatikusan commitolni is fog a git repónkba. Illetve van lehetőség a verzió számok léptetésére is az alábbiakkal:

``` bash
npm version patch
npm version minor
npm version major
```

Ezek a parancsok eggyel léptetik a szemantikus verziószámunk megfelelő számjegyét, és szintén committolnak. [További részletek](https://docs.npmjs.com/cli/version).

Minden készen áll, hogy kiadjuk a végső parancsot:

```
npm publish
```

Amennyiben scope-olt csomagot kívánunk létrehozni, annak a láthatósága alapból private, ezért ha megpróbáljuk a fenti paranccsal simán közzétenni, akkor egy `“402 Payment Required”`  hibaüzenetet kapunk.
Az ilyen csomagok esetében az első publikálásnál ezért (amennyiben nem fizetünk a szolgáltatásért) paraméterként meg kell adnunk, hogy nyilvános csomagnak szánjuk őket:

``` bash
npm publish --access=public
```
___

## Futtatható csomag létrehozása
Az megosztani kívánt csomagjainkat azt hiszem nagyjából két típusba sorolhatjuk. Az egyik a futtatható eszközök köre. Ez esetben nem hasznos kis függvényeket,
pofás web komponenseket akarunk elérhetővé tenni mások számára, hanem valamilyen parancssorból futtatható programot, ami felszámolja az éhezést a világban.

### **Futatható parancs implementálása**
Ha szeretnénk egy konzolból futtatható parancsot kreálni, akkor először is a `package.json`-t kell kiegészítenünk, ugyanis a module telepítése során innen tudja az npm, hogy mi szeretnénk futtatható parancsot létrehozni, és ehhez ő megcsinálja a szükséges fájlokat a `node_modules\.bin` mappában (a fájlok a parancsunk nevét viselik).

A `package.json`-ban tehát beállítjuk a következőt, ahol a kulcs a parancsunk, az érték pedig a parancs meghívásakor futtatandó javascript fájl elérési útja:

``` json
"bin": {
    "hello-cica": "./bin/cli.js"
},
```

Adjuk hozzá a megadott fájlt az eddigiekhez:

```
📂bin
 |--📝cli.js
📂src
 |--📝index.js
📂devtest
 |--📂node_modules
 |--📝index.js
 |--📝package-lock.json
 |--📝package.json
📝.gitignore
📝.npmignore
📝package.json
```

És töltsük meg tartalommal:

``` javascript
#! /usr/bin/env node
const { hello } = require('../src/index.js');

if (!process.argv[2]) {
    console.log('Add meg paraméternek a nevedet!');
    return;
}

hello(`${process.argv[2]}-cica`);
```

A fájl első sora egy úgynevezett shebang, ami a Unix alapú operációs rendszereknél azt árulja el, hogy mivel kell futtatni az adott fájlt. Ami esetünkben a node.
A Windowsnález az adott kiterjesztéshez társított beállítástól függ, ezért az npm modul installálásakor létrejön a parancsunkból egy cmd fájl is, ami ebben segít.

A feltétel természetesen nem szüksésgszerű kelléke a dolognak, rögtön hívhatnánk az importált függvényünket, de sokszor szükség lehet valamilyen paraméterre a futtatáshoz, ezért most itt is elvárjuk azt.

A csomag telepítése után pedig máris futtatható a programunk.

Globális telepítés esetén:
``` bash
hello-cica <név>
```

Lokális telepítés esetén:
``` bash
npx hello-cica <név>
```

### **Futtatás megadott paraméterekkel**

Amennyiben általánosságban bizonyos pőaraméterekkel szeretnénk futtatni a programunkat, úgy a `package.json`-ban természetesen ennek is létrehozhatunk egy parancsot, ami a megszokott módon futtathatunk pl.:

``` json
"scripts": {
    "hello-foo": "npx hello-cica foo"
},
```
___

## Angular csomag létrehozása
A másik típus, amikor újra felhasználható elemeket szeretnénk közzétenni a világban. Ennek egy speciális esete, amikor mindezt Angularos keretek között tennénk.

___

## Megszabadulás az NPM csomagunktól
Ha immáron kijátszadoztuk magunkat, és nem szeretnénk a szerencsétlen kis npm package-ünkkel tovább terhelni a világhálót, akkor amennyiben 72 órán belül vagyunk az első publikálástól, úgy az:
``` bash
npm unpublish <csomag neve> -f
```
paranccsal törölhetjük az egész csomagot.

Ha lecsúsztunk az esemény utáni tablettáról, akkor bizony nem kívánt produktumunk eltűntetésével már szakemberhez kell fordulnunk amit a support@npmjs.com címen tehetünk meg.

Ha nem ragaszkodunk hozzá, hogy a szégyenfoltot kitörüljük a szájbertérből (vagy ha erre nincs mód, mert például már más npm csomagok is függnek tőle), akkor a 
``` bash
npm deprecate <csomag neve>@<verzió> "<üzenet>"
```
parancsot használva tudathatjuk a világgal, hogy elhatárolódunk a kreálmányunktól, ha pedig szeretnénk még jobban eldobni őt magunktól, akkor örökbeadhatjuk őt az npm-es csávóknak imígyen:
``` bash
npm owner add npm <package-name>
npm owner rm <user> <package-name>
```

Érdemes mindezek mellett tudni, hogy még ha unpublish-eltük is a csomagunkat, az egyszer közzétett név + verzió soha többé nem használható. Ha újból szeretnénk megosztani, akkor kénytelenek vagyunk új verziót kitenni belőle.



## Egyéb érdekességek

Nagyobb projekteknél a különféle modulok egy csokorba fogása céljából létrejöttek az úgynevezett monorepok. Ezzel a struktúrával való ismerkedéshez itt egy kiindulópont: https://blog.npmjs.org/post/186494959890/monorepos-and-npm