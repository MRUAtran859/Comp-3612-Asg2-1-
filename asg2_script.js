const storage = localStorage // So we can switch between session/local easier ()

// https://www.w3schools.com/js/js_array_sort.asp

function cmpString(a, b) {
    if (a < b) {return -1;}
    if (a > b) {return 1;}
    return 0;
}

function cmpNum(a,b) {
    return a - b
}



function getAllJson(year){
    let races_string = storage.getItem("races"+year);
    let races_json = JSON.parse(races_string)
    let qual_string = storage.getItem("qualifying"+year);
    let qual_json = JSON.parse(qual_string)
    let results_string = storage.getItem("results"+year);
    let results_json = JSON.parse(results_string)
    let ret_object = {};
    ret_object.races = races_json;
    ret_object.quals = qual_json;
    ret_object.results = results_json;

    return ret_object;
}







// almost all loops in this file are variations of the three loops in this function
function setResultTable(id,year,cmpFun){
    let allResults =  getAllJson(year)["results"]
    let table = document.querySelector(".race-results table")
    let results = [];

    //filter
    for (let result of allResults) {
        if (result.race.id == id ) {
            results.push(result);
        }
    }


    //delete all but header row
    for(var i = 1; i < table.rows.length ;){
        table.deleteRow(i);
    }


    results.sort(cmpFun);
    for (let result of results) {
        let tr = table.insertRow(-1);
        let pos = tr.insertCell(-1);
        let name = tr.insertCell(-1);
        let constructor = tr.insertCell(-1);
        let laps = tr.insertCell(-1);
        let pts = tr.insertCell(-1);

        name.style.textDecoration = "underline"
        constructor.style.textDecoration = "underline"
        
        pos.textContent = result.position;
        name.textContent = result.driver.forename + " " + result.driver.surname;
        name.dataset.id=result.driver.id;
        name.setAttribute("class", "driver");
        constructor.textContent = result.constructor.name;
        constructor.dataset.id=result.constructor.id;
        constructor.setAttribute("class", "constructor");
        laps.textContent = result.laps;
        pts.textContent = result.points;
        tr.dataset.id = result.id;
    }
    //podium stuff, but no access to pictures.
    results.sort((a,b) => cmpNum(a.position, b.position))
    document.querySelector(".race-result-1").textContent = results[0].driver.ref;
    document.querySelector(".race-result-2").textContent = results[1].driver.ref;
    document.querySelector(".race-result-3").textContent = results[2].driver.ref;

}






function setQualTable(id, year, cmpFun){
    let allQuals =  getAllJson(year)["quals"]
    let table = document.querySelector(".race-qualifying > table")
    let quals = [];

    for (let qual of allQuals) {
        if (qual.race.id == id) {
            quals.push(qual);
        }
    }

    for(var i = 1; i < table.rows.length ;){
        table.deleteRow(i);
    }

    quals.sort(cmpFun)

    for (let qual of quals) {
        let tr = table.insertRow(-1);
        let pos = tr.insertCell(-1);
        let name = tr.insertCell(-1);
        let constructor = tr.insertCell(-1);
        let q1 = tr.insertCell(-1);
        let q2 = tr.insertCell(-1);
        let q3 = tr.insertCell(-1);

        name.style.textDecoration = "underline"
        constructor.style.textDecoration = "underline"
        
        

        pos.textContent = qual.position;
        name.textContent = qual.driver.forename + " " + qual.driver.surname;
        name.dataset.id=qual.driver.id;
        name.setAttribute("class", "driver")
        constructor.textContent = qual.constructor.name;
        constructor.dataset.id=qual.constructor.id;
        constructor.setAttribute("class", "constructor")
        q1.textContent = qual.q1;
        q2.textContent = qual.q2;
        q3.textContent = qual.q3;
        tr.dataset.id = qual.id;
        

    }

}


function displayQualResult(id, year){
    let root = document.querySelector(".race-qualifying-results")
    let race = getAllJson(year)["races"].find(item=>item.id == id);
    let circuit = root.querySelector("#circuit-name");

    circuit.textContent=race.circuit.name;
    circuit.dataset.id = race.circuit.id;
    root.querySelector("#race-name").textContent = race.name;
    root.querySelector("#circuit-name").textContent = race.circuit.name;
    root.querySelector("#round-number").textContent = "Round " + race.round;
    root.querySelector("#race-date").textContent = race.date;
    root.querySelector("#race-url a").setAttribute("href",race.url)

    setQualTable(id, year,(a,b) => cmpNum(a.position, b.position))
    setResultTable(id,year,(a,b) => cmpNum(a.position, b.position))

    root.style.display = "block"

}











function createResultButton() {
    let span = document.createElement("span")
    span.textContent = "Results"
    span.classList.add("results-click")
    return span;
}

function displayHomeView() {
    document.querySelector(".home").style.display = "flex";
    document.querySelector(".race-view, favorite-button").style.display = "none";
    document.querySelector(".favorite-button").style.display = "none";
    document.querySelector(".home-button").style.display = "none";
    document.querySelector("select").value = "default";
}


function setRaceViewTable(year, cmpFun) {
    let races = getAllJson(year)["races"]
    let table = document.querySelector(".races-list > table")

    for(var i = 1; i < table.rows.length ;){
        table.deleteRow(i);
    }


    races.sort(cmpFun);

    /*https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/insertRow */
    // using technique of (-1), and also i didn't know/forgot about insertRow/insertCell
    // was getting annoyed by table element having a 'tbody' as an element instead of 'tr's
    for (let race of races) {
        let tr = table.insertRow(-1);
        let round = tr.insertCell(-1);
        let name = tr.insertCell(-1);
        let result_button = tr.insertCell(-1);

        round.textContent = race.round;
        round.classList.add("races-list-round")
        name.textContent = race.name;
        result_button.appendChild(createResultButton())
        tr.dataset.id = race.id;
        result_button.addEventListener("click",  event => {
            let id = event.currentTarget.parentElement.dataset.id
            document.querySelector(".race-qualifying-results").dataset.id =  id;
            displayQualResult(id, year);
        })
    }

}



function displayRaceView(year) {
    let view = document.querySelector(".race-view");
    document.querySelector(".home").style.display = "none"
    document.querySelector(".favorite-button").style.display = "inline";
    document.querySelector(".home-button").style.display = "inline";
    view.style.display = "flex"
    view.dataset.year = year;

    setRaceViewTable(year,(a,b) => cmpNum(a.round, b.round))
}

function responseHandle(response){
    return response.json();
}

function getData(year){
    const domain = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/";
    let racesURL = domain+"races.php?season=" + year;
    let resultsURL = domain+"results.php?season=" + year;
    let qualifierURL = domain+"qualifying.php?season=" + year;


    /*https://stackoverflow.com/questions/40981040/using-a-fetch-inside-another-fetch-in-javascript*/
    // I'm just using the technique of returning a fetch (small snippet).
    document.querySelector(".loader").style.display = "block";
    fetch(racesURL)
        .then(responseHandle)
        .then(jsonItem => {storage.setItem("races"+year,JSON.stringify(jsonItem));return fetch(resultsURL);})
        .then(responseHandle)
        .then(jsonItem => {storage.setItem("results"+year,JSON.stringify(jsonItem));return fetch(qualifierURL);})
        .then(responseHandle)
        .then(jsonItem => {
            storage.setItem("qualifying"+year,JSON.stringify(jsonItem));
            document.querySelector(".loader").style.display = "none";
            displayRaceView(year);
        })

}

function getRaceID() {
    return document.querySelector(".race-qualifying-results").dataset.id;
}
function getYear() {
    return document.querySelector(".race-view").dataset.year;
}



function showCircuitPopup(){
    
    let popup = document.querySelector(".circuit-popup");
    let circuit =  getAllJson(getYear())["races"].find(item=>item.id == getRaceID()).circuit
    popup.querySelector(".circuit-popup-name").textContent = circuit.name;
    popup.querySelector(".circuit-popup-location").textContent = circuit.location + ", " + circuit.country;
    popup.querySelector(".circuit-popup-url > a").setAttribute("href",circuit.url)

    popup.showModal();

    
}

function showDriverPopup(driver_id){
    let popup = document.querySelector(".driver-popup");
    let allResults =  getAllJson(getYear())["results"]
    let driver = allResults.find(item=>item.driver.id == driver_id).driver;
    popup.querySelector(".driver-name").textContent = driver.forename + " " + driver.surname;
    popup.querySelector(".driver-country").textContent = driver.nationality;
    popup.querySelector(".driver-dob").textContent = driver.dob;
    popup.querySelector(".driver-popup-url > a").setAttribute("href",constructor.url);

    let table = document.querySelector(".driver-popup  table")
    let results = allResults;
    let filteredResults = [];

    for (let result of results) {
        if (result.driver.id == driver_id) {
            filteredResults.push(result)
        }
    }


    for(var i = 1; i < table.rows.length ;){
        table.deleteRow(i);
    }

    filteredResults.sort((a,b)=> cmpNum(a.race.round,b.race.round));
    for (let result of filteredResults) {
        let tr = table.insertRow(-1);
        let round = tr.insertCell(-1);
        let name = tr.insertCell(-1);
        let pos = tr.insertCell(-1);
        let pts = tr.insertCell(-1);

        pos.textContent = result.position;
        round.textContent = result.race.round;
        name.textContent = result.race.name;
        pts.textContent = result.points
        tr.dataset.id = result.id;
        

    }
    popup.showModal();
}

function showConstructorPopup(constructor_id){
    let popup = document.querySelector(".constructor-popup");
    let allResults =  getAllJson(getYear())["results"]
    let constructor = allResults.find(item=>item.constructor.id == constructor_id).constructor;
    popup.querySelector(".constructor-popup-name").textContent = constructor.name;
    popup.querySelector(".constructor-popup-country").textContent = constructor.country;
    popup.querySelector(".constructor-popup-url > a").setAttribute("href",constructor.url);

    let table = document.querySelector(".constructor-popup  table")
    let results = allResults;
    let filteredResults = [];

    for (let result of results) {
        if (result.constructor.id == constructor_id) {
            filteredResults.push(result)
        }
    }


    for(var i = 1; i < table.rows.length ;){
        table.deleteRow(i);
    }

    filteredResults.sort((a,b)=> cmpNum(a.race.round,b.race.round));
    for (let result of filteredResults) {
        let tr = table.insertRow(-1);
        let round = tr.insertCell(-1);
        let name = tr.insertCell(-1);
        let driver = tr.insertCell(-1);
        let pos = tr.insertCell(-1);

        pos.textContent = result.position;
        driver.textContent = result.driver.forename + " " + result.driver.surname;
        round.textContent = result.race.round;
        name.textContent = result.race.name;
        tr.dataset.id = result.id;
        

    }
    popup.showModal();
}

function addToStorage(key,value) {
    let dataString = storage.getItem(key);
    let data = [];
    if (dataString) {
        data=JSON.parse(dataString)
    }
    if (data.includes(value)) {
        return;
    }
    data.push(value)
    storage.setItem(key,JSON.stringify(data));
    

    let toast = document.querySelector("#snackbar");
    toast.className = "show"
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

function showFavorites() {
    let driStr = storage.getItem("fav-dri")
    let favDri = driStr?JSON.parse(driStr):[];
    let conStr = storage.getItem("fav-con")
    let favCon = conStr?JSON.parse(conStr):[];
    let cirStr = storage.getItem("fav-cir")
    let favCir = cirStr?JSON.parse(cirStr):[];



    let popup = document.querySelector(".favorites-popup");
    let drivers = popup.querySelector(".fav-drivers-list > .list-container");
    let cons = popup.querySelector(".fav-constructors-list  > .list-container");
    let circs = popup.querySelector(".fav-circuits-list  > .list-container");
    drivers.innerHTML = ""
    cons.innerHTML = ""
    circs.innerHTML = ""

    for (let fav of favDri) {
        let p = document.createElement("p");
        p.textContent = fav;
        drivers.appendChild(p);
    }

    for (let fav of favCon) {
        let p = document.createElement("p");
        p.textContent = fav;
        cons.appendChild(p);
    }

    for (let fav of favCir) {
        let p = document.createElement("p");
        p.textContent = fav;
        circs.appendChild(p);
    }

    popup.showModal();



}



function addEventListenersToRaceHeaders() {
    document.querySelector(".race-round")
        .addEventListener("click", ()=>setRaceViewTable(getYear(),(a,b) => cmpNum(a.round, b.round)))
    document.querySelector(".races-list-header-name")
        .addEventListener("click", ()=>setRaceViewTable(getYear(),(a,b) => cmpString(a.name, b.name)))

    document.querySelector(".qualifying-pos")
        .addEventListener("click", ()=>
            setQualTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpNum(a.pos, b.pos)
            )
        )
    document.querySelector(".qualifying-name")
        .addEventListener("click", ()=>
            setQualTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpString(a.driver.forename, b.driver.forename)
            )   
        )
    document.querySelector(".qualifying-constructor")
        .addEventListener("click", ()=>
            setQualTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpString(a.constructor.name, b.constructor.name)
            )   
        )
    document.querySelector(".qualifying-q1")
        .addEventListener("click", ()=>
            setQualTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpString(a.q1, b.q1)
            )   
        )
    document.querySelector(".qualifying-q2")
        .addEventListener("click", ()=>
            setQualTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpString(a.q2, b.q2)
            )   
        )
    document.querySelector(".qualifying-q3")
        .addEventListener("click", ()=>
            setQualTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpString(a.q3, b.q3)
            )   
        )
    document.querySelector(".results-pos")
        .addEventListener("click", ()=>
            setResultTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpNum(a.position, b.position)
            )   
        )
    document.querySelector(".results-name")
        .addEventListener("click", ()=>
            setResultTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpString(a.driver.forename, b.driver.forename)
            )   
        )
    document.querySelector(".results-constructor")
        .addEventListener("click", ()=>
            setResultTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpString(a.constructor.name, b.constructor.name)
            )   
        )
    document.querySelector(".results-laps")
        .addEventListener("click", ()=>
            setResultTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpNum(a.laps, b.laps)
            )   
        )   
    document.querySelector(".results-pts")
        .addEventListener("click", ()=>
            setResultTable(
                getRaceID(),
                getYear(),
                (a,b) => cmpNum(a.points, b.points)
            )   
        )

    document.querySelector("#circuit-name")
        .addEventListener("click", ()=>{
            showCircuitPopup()})

    document.querySelector(".circuit-popup-close")
        .addEventListener("click", ()=>{
            document.querySelector(".circuit-popup").close()})

    document.querySelector(".race-qualifying-results")
        .addEventListener("click", event => {
            let target = event.target;
            
            if (target && target.classList.contains("constructor")) {
                showConstructorPopup(target.dataset.id);
            }
            else if (target && target.classList.contains("driver")) {
                showDriverPopup(target.dataset.id);
            }
        })

    document.querySelector(".constructor-popup-close")
        .addEventListener("click", ()=>{
            document.querySelector(".constructor-popup").close()})

    document.querySelector(".driver-popup-close")
        .addEventListener("click", ()=>{
            document.querySelector(".driver-popup").close()})

    document.querySelector(".favorites-popup-close")
        .addEventListener("click", ()=>{
            document.querySelector(".favorites-popup").close()})

    document.querySelector(".favorite-button")
        .addEventListener("click", () =>{showFavorites() })

    document.querySelector(".fav-empty-button")
        .addEventListener("click", ()=>{
            storage.setItem("fav-dri","");
            storage.setItem("fav-con","");
            storage.setItem("fav-cir","");
            showFavorites()
        })
    
    document.querySelector(".circuit-popup-fav")
        .addEventListener("click", ()=>{
            addToStorage("fav-cir",document.querySelector(".circuit-popup-name").textContent)
        })
    document.querySelector(".constructor-popup-fav")
        .addEventListener("click", ()=>{
            addToStorage("fav-con",document.querySelector(".constructor-popup-name").textContent)
        })  
        document.querySelector(".driver-popup-fav")
        .addEventListener("click", ()=>{
            addToStorage("fav-dri",document.querySelector(".driver-name").textContent)
        })  


            
    

}

document.addEventListener("DOMContentLoaded", ()=>{
    displayHomeView();
    let select = document.querySelector("select");
    let logo = document.querySelector(".logo-button");
    let home_button = document.querySelector(".home-button");


    logo.addEventListener("click", displayHomeView)
    home_button.addEventListener("click", displayHomeView)

    select.addEventListener("change", event =>{
        let year = event.target.value;

        if (year == "default") {
            return;
        }
        if (storage.getItem("races"+year) === null ||
            storage.getItem("results"+year) === null ||
            storage.getItem("qualifying"+year) === null){
            getData(year); //fetching -- only called here
            return;
        }
        document.querySelector(".race-view").dataset.year = year;
        displayRaceView(year);
        addEventListenersToRaceHeaders()
        return;
    })
})