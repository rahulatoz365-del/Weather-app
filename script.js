const userweather=document.querySelector("[data-your-weather]");
const searchweather=document.querySelector("[data-search-weather]");
const searchform=document.querySelector("[data-search-form]");
const weathercontainer=document.querySelector(".weather-container");
const grantlocation=document.querySelector(".grant-location");
const loading=document.querySelector(".form-loading");
const userforminfo=document.querySelector(".form-info");
let tab=userweather;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
tab.classList.add("tab-your");
coordinates();
function switchtab(newtab){
    if(newtab != tab) {
        tab.classList.remove("tab-your");
        tab = newtab;
        tab.classList.add("tab-your");
        if(!searchform.classList.contains("active")){
            userforminfo.classList.remove("active");
            grantlocation.classList.remove("active");
            searchform.classList.add("active");
        }
        else {
            searchform.classList.remove("active");
            userforminfo.classList.remove("active");
            coordinates();
        }
    }
}
userweather.addEventListener("click",()=>{
    switchtab(userweather);
});
searchweather.addEventListener("click",()=>{
    switchtab(searchweather);
});
function coordinates(){
    const localcoordinates=sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        grantlocation.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localcoordinates);
        userweatherinfo(coordinates);
    }
}
async function userweatherinfo(coordinates){
    const {lat , lon}=coordinates;
    grantlocation.classList.remove("active");
    loading.classList.add("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loading.classList.remove("active");
        userforminfo.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        loading.classList.remove("active");
    }
}
function renderweatherinfo(data){
    const cityname=document.querySelector("[data-cityname]");
    const countryflag=document.querySelector("[data-image]");
    const weatherdesc=document.querySelector("[data-weather-desc]");
    const weathericon=document.querySelector("[data-weathericon]");
    const temp=document.querySelector("[data-temp]");
    const humidity=document.querySelector("[data-humidity]");
    const windspeed=document.querySelector("[data-windspeed]");
    const clouds=document.querySelector("[data-clouds]");
    console.log(data);
    cityname.innerText=data?.name;
    countryflag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherdesc.innerText = data?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    clouds.innerText = `${data?.clouds?.all}%`;
}
function getlocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(Showposition);
    }
    else {
        alert("Geolocation Not supported in this Browser!!");
    }
}
function Showposition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    userweatherinfo(userCoordinates);
}
const grantaccess=document.querySelector("[data-grant-button]");
grantaccess.addEventListener("click",getlocation);
const searchcity=document.querySelector("[data-search-city]");
searchform.addEventListener("submit",(u)=>{
    u.preventDefault();
    let cityname=searchcity.value;
    if(cityname===""){
        return;
    }
    else {
        cityweatherinfo(cityname);
    }
});
async function cityweatherinfo(city){
    loading.classList.add("active");
    userforminfo.classList.remove("active");
    grantlocation.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loading.classList.remove("active");
        userforminfo.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        loading.classList.remove("active");
    }
}