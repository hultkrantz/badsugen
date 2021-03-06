
var mapRoot = document.getElementById('mapRoot'),
	logoutButton = document.getElementById('logoutButton'),
	updateUser;

class LoginApp extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user: firebase.auth().currentUser,
            userProfileUrl:'',
        };
        //bind us together forever and ever
        this.loginFunction = this.loginFunction.bind(this);
        this.googleFunction = this.googleFunction.bind(this);
    }
	loginFunction() {
	
		let self = this;
		let provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function (result) {
			
			 self.setState({
				user: result.user,
				 userProfileUrl : firebase.auth().currentUser.providerData[0].photoURL
			})
			localStorage.setItem("currentUserName", result.user.displayName);
			localStorage.setItem("currentUserURL", result.user.photoURL);

		}).catch(function (error) {
			console.log("Login error")
			alert("Kunde inte logga in ," + error);
		});
	};
googleFunction() {
let self = this;
	let googleProvider = new firebase.auth.GoogleAuthProvider();
	
	firebase.auth().signInWithPopup(googleProvider).then(function (result) {
		
		self.setState({
		user : result.user,
		userProfileUrl : firebase.auth().currentUser.providerData[0].photoURL,
		theOne : result.user.displayName
		})

		localStorage.setItem("currentUserName", result.user.displayName);
		localStorage.setItem("currentUserURL", result.user.photoURL);
	}).catch(function (error) {
		alert("Kunde inte logga in ," + error);
	})
};

updateDisplay(){
	mapRoot.style.display = 'block';
	logoutButton.style.display = 'block';
	
}
	


render() {
	let loginComp;

	
	//check if user is authenticated
	
	console.log(firebase.auth().currentUser)
	if(firebase.auth().currentUser){
		loginComp =<p id="nameHolder"></p>;
		this.updateDisplay();
		initMap();
	} else{
        // User not signed in.
        console.log("Ej inloggad")
        loginComp = <div><p id="nameHolder"></p><button className="loginBtn loginBtn--facebook" id="loginButton" onClick={this.loginFunction} >Logga in med Facebook <i className="fa fa-facebook fa-lg" aria-hidden="true"></i></button><br /> eller <br /><button className="loginBtn loginBtn--google" id="googleLogin" onClick={this.googleFunction}> Logga in med Google <i className="fa fa-google-plus fa-lg" aria-hidden="true"></i></button> </div>  
    }

    return (
		<div id="divContaienr">
			{loginComp}
    	</div>
        )
}//render
}// component
ReactDOM.render(
        <LoginApp />,
        document.getElementById('loginRoot')
      );