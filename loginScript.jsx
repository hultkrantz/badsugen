
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
		console.log('this:',this)
		let self = this;
		let provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function (result) {
			//console.log(result.user.displayName);
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
		console.log("result.user.displayName" ,result.user.displayName)
		localStorage.setItem("currentUserName", result.user.displayName);
		localStorage.setItem("currentUserURL", result.user.photoURL);
		console.log('self.state.user: ', self.state.user)
			console.log('userProfilePic', self.state.userProfileUrl )
	}).catch(function (error) {
		console.log("Login error")
		alert("Kunde inte logga in ," + error);
	})
};

updateDisplay(){
	mapRoot.style.display = 'block';
	logoutButton.style.display = 'block';
	//console.log(isLoggedIn);
}
	


render() {
	let loginComp;
	console.log('theOne',this.state.theOne)
	console.log('currentUserName',localStorage.getItem("currentUserName"));
	
	//check if user is authenticated
	
	if( firebase.auth().currentUser) {
		//localStorage.getItem("currentUserName") === this.state.theOne){ 
		loginComp =<p id="nameHolder"></p>;
		console.log("Inloggad, Gå vidare till sidan")
		console.log('state.user', this.state.user)
		console.log(firebase.auth().currentUser)
		//<button id=logoutButton" onClick={this.logoutFunction}>Logout</button>
		//mapRoot.style.display = 'block';
		localStorage.setItem("currentUserPicture", this.state.userProfileUrl);
		this.updateDisplay();
		initMap();
		//console.log(updateUser);
		
	} else{
        // User not signed in.
        console.log("Ej inloggad, Meddelande till användare on inloggning")
        loginComp = <div><p id="nameHolder"></p><button className="loginBtn loginBtn--facebook" id="loginButton" onClick={this.loginFunction} >Logga in med Facebook <i className="fa fa-facebook fa-lg" aria-hidden="true"></i></button><br /> eller <br /><button className="loginBtn loginBtn--google" id="googleLogin" onClick={this.googleFunction}> Logga in med Google <i className="fa fa-google-plus fa-lg" aria-hidden="true"></i></button> </div>  
    }
	console.log("current user from firebase ",firebase.auth().currentUser);

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