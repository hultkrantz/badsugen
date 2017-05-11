

class InfoApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			adress: '',
			distance: null,
			id: null,
			currentObjId: '',
			lat: null,
			lng: null,
			weatherText: '',
			userName: '',
			userURL: '',
			owWind: null,
             owTemp: null,
             owIcon: null,
			temperatureCarl: "Ingen väderlek idag"
		};
		this.streetViewImg = this.streetViewImg.bind(this);
		this.showWeather = this.showWeather.bind(this);
		this.updateCurrentObj = this.updateCurrentObj.bind(this);
		this.superfunction = this.superfunction.bind(this);
		this.openWeather = this.openWeather.bind(this);
		this.ApixuApi = this.ApixuApi.bind(this);
	}
	componentDidMount() {
		//this.superfunction();
		
	}
	
	updateCurrentObj(objId){
		let userName = localStorage.getItem('currentUserName');
		let userURL = localStorage.getItem('currentUserURL');
		
		this.setState({
			currentObjId: objId,
			userName: userName,
			userURL: userURL
		});
		
		this.superfunction();
	}
	
	streetViewImg() {
       let url = `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${this.state.lat},${this.state.lng}&fov=90&heading=235&pitch=10&key=AIzaSyDjN2L8aBzBXjy_atERRLKEiikp1EWuJUQ`;
		return url;
    }
	
	getAccumulateKey() {
            let url1 = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=jcsBwFjECEb5T6Us3Wyb2kzXiVFI3hAG&q=57.5807435%2C11.931910099999982&language=sv";
            
            let req1= new XMLHttpRequest();
            req1.onreadystatechange=() => {
                if(req1.status == 200 && req1.readyState == 4){
                    let json1= JSON.parse(req1.responseText);
                    let key= json1.Key;
                    this.showWeather(key);
                }
            }
        req1.open('get', url1);
        req1.send(); 
    }
	
	showWeather(x) {
		
        let url1 = `https://api.darksky.net/forecast/ef36185dcebeeab8faf395e307f6ac6b/${this.state.lat},${this.state.lng}`;
            
            let req1= new XMLHttpRequest();
            req1.onreadystatechange=() => {
                if(req1.status == 200 && req1.readyState == 4){
                    let json1= JSON.parse(req1.responseText);

                    let temp = json1.currently.temperature 
                    let tempC = (temp-32)*(5/9); 
                    let text = json1.currently.summary;
                    this.setState({ temperature: tempC.toFixed(1) + '°c', weatherText:text });
                }else{
					this.setState({
						weatherText: "Ingen väderdata tillgänglig"	
					})
				}
            }
        req1.open('get', url1);
        req1.send(); 
    }
	
	openWeather(){
		let long, latt;
			long = this.state.lng.toFixed(4);
			latt = this.state.lat.toFixed(4);
		return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latt}&lon=${long}&APPID=2d3055ddb7941ccc16f48f3aaeb29121&units=metric`)
         .then(function(res){
           return res.json();
         }) //chain
         .then(function(data){
           var iconUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon+ ".png";
           let vind = data.wind.speed + "m/s";
           let temp = data.main.temp + "°C";
           return this.setState({
             owWind: vind,
             owTemp: temp,
             owIcon: iconUrl
           }) ;
         }.bind(this));
	}
	
	ApixuApi() {
		let long, latt;
		 if(!this.state.lng) {
			 long = 0;
			 latt = 0;
		 } else {
			long = this.state.lng.toFixed(4);
			latt = this.state.lat.toFixed(4);
		 }
			let url1 = `http://api.apixu.com/v1/current.json?key=670e240b3e15413496a82430171105&q=${latt},${long}`;
			
            
            let req1= new XMLHttpRequest();
            req1.onreadystatechange=() => {
                if(req1.status == 200 && req1.readyState == 4){
                    let json1= JSON.parse(req1.responseText);
                    let temperature = json1.current.temp_c;
                    let conditionText = json1.current.condition.text;
                    let conditionIcon = json1.current.condition.icon;

                    this.setState({
                        weatherTextEmma: conditionText,
                        temperatureEmma: temperature,
                        iconEmma: conditionIcon
                    })
                }
            }
        req1.open('get', url1);
        req1.send(); 
        }
	
	 DarkskyWeatherApi(){
		 let long, latt;
		 if(!this.state.lng) {
			 long = 0;
			 latt = 0;
		 } else {

			long = this.state.lng.toFixed(4);
			latt = this.state.lat.toFixed(4);
		 }
		let self = this;
 		return fetch(`https://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/${long}/lat/${latt}/data.json`)
		.then(function(res){
			return res.json();
		})
		.then(function(data){
			let temp = data.timeSeries[0].parameters[1].values[0] 
			return self.setState({
				temperatureCarl: temp.toFixed(1)
			});
		}).catch(function(error){
			console.log('DarkSky ',error)
		});//.bind(this));
	}
	
	superfunction(){
		let name = '';
		
		
		firebase.database().ref('badplatser/').on('value', function (snapshot) {
			
			let allData = snapshot.val();
			let list = [];
			
			let newstate = null;
			for (let obj in allData) {
				
				if (allData[obj].id === this.state.currentObjId){ // Kontrollerar vilket objekt som klickats på
					let object = allData[obj];
					
					let distanceKm = object.distance/1000;
					let distanceRound = distanceKm.toFixed(1);
					newstate = {
						name: object.name,
						adress: object.adress,
						distance: distanceRound,
						id: object.id,
						hasBeenPressed: true,
						lat: object.lat,
						lng: object.lng
					};
				}
			}
			
			
			if( newstate != null )
				this.setState(newstate);
				this.DarkskyWeatherApi();
				this.openWeather();
				this.ApixuApi();
				this.showWeather();

		}.bind(this));
		

		this.streetViewImg();

	}
	
render() {
 
        currentObj = this.updateCurrentObj;
 
        return <div id="badplatsInfo">
                 <a href="https://hultkrantz.github.io/badsugen/index.html" className="arrowLink"><i className="fa fa-angle-double-left  fa-3x" aria-hidden="true"></i></a><br />
                <h2>{this.state.name}</h2> 
                <p> {this.state.adress}.<br></br>
                    {this.state.distance} km från din position</p>
                <img src={this.streetViewImg()}></img>
                <div className="weatherApis">
                <Accuweather weatherText={this.state.weatherText}
                    temperature={this.state.temperature} />
            <OpenWeather icon={this.state.owIcon}
            wind={this.state.owWind}
                temp={this.state.owTemp} />
            <EmmaApixuWeather weatherTextEmma={this.state.weatherTextEmma} temperatureEmma={this.state.temperatureEmma} iconEmma={this.state.iconEmma} />
                 <CarlSmhiWeather temperatureCarl={this.state.temperatureCarl}/>
                 </div>
            </div>
    }
}


class Accuweather extends React.Component {
        render(){
            return  (
                <div className="weatherRow" id="weather1"> 
                    <h4>Väder från <br />DarkSky</h4>
                    <p>
                    {this.props.weatherText},    {this.props.temperature}°C</p>
                </div>
                );
        }
}
class OpenWeather extends React.Component{
    render(){
      return (
           <div className="weatherRow" id="weather2">
                <h4>Väder från <br />OpenWeather</h4>
                <p>Vindstyrka:{this.props.wind}, {this.props.temp}</p>
            </div>
      );
    }
}
class EmmaApixuWeather extends React.Component {
        render(){
            return ( 
                <div className="weatherRow"  id="weather3">
                    <h4>Väder från <br />Apixu</h4>
                    <p>
                    {this.props.weatherTextEmma},   {this.props.temperatureEmma}°C</p>
                </div>
                    );
        }
}
class CarlSmhiWeather extends React.Component {
        render(){
            return (
                <div className="weatherRow" id="weather4">
                    <h4>Väder från <br />SMHI</h4>
                    <p>
                    {this.props.temperatureCarl}°C</p>
                </div>
                );
                    
                    
        }
}


ReactDOM.render( 
	<div>
	<InfoApp />
		<FormComponent /></div>,
	document.getElementById('badplatsPage')
);