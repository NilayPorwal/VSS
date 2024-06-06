import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, BackHandler,TouchableOpacity, Alert,ScrollView, Modal, TextInput,TouchableWithoutFeedback, KeyboardAvoidingView, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import APIManager from '../Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';      
type Props = {};
export default class ObservationsScreen extends Component<Props> {
  	
     constructor(props) {  
     super(props);         
      this.state = {   
	    testModalVisible:false,          
	    observation:'',
		image:[],
        video:'',  
		imageData:[],
		photoExtension:'',
		status:'',
		isRefreshing:false,
        siteOfferDetails:this.props.navigation.state.params.siteOfferDetails,			
         materialDetails:this.props.navigation.state.params.materialDetails,		
	 }
	  global.ObservationsScreen = this;
	 // alert(JSON.stringify(this.props.navigation.state.params.siteOfferDetails)) 
	}	
	static navigationOptions = {
       header: <Image source={require('../../Images/Header3.png')} style={{width:'100%',marginTop:(Platform.OS === 'ios')?24:0 }} />,
        headerLeft:null 	   
    };
	componentDidMount(){
		 BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
	}
	componentWillUnmount() {
		 BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
     }  
	        
	handleAndroidBackButton(){  
		Alert.alert(
		  'Are you sure you want to go back ?',
		  'It will clear all your test data ',
		  [
			{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'OK', onPress: () =>    global.ObservationsScreen.props.navigation.goBack()},
		  ],
		  { cancelable: true }    
      )
	    return true;	  
	}  
	  
	onPassTest(){
	  this.setState({status:"0", isRefreshing:true},()=>{ this.uploadObservations()})
	  if(this.state.isRefreshing==true){
	   setTimeout(()=>{		
	    this.setState({isDisabled:false, isRefreshing:false})
		alert('Please Try Again to Submit Test')
	   },20000)
	  }	
	}  
	
	onFailTest(){
	  this.setState({status:"1",  isRefreshing:true},()=>{ this.uploadObservations()})
     if(this.state.isRefreshing==true){      
	  setTimeout(()=>{		
	    this.setState({isDisabled:false, isRefreshing:false})
		alert('Please Try Again to Submit Test')
	   },20000)	  
	 }
	}        
	  
	onCamera(){    
	      
     var options = {
		  title: 'Select Avatar',
		  quality: 0.3,
		  storageOptions: {
		    path: 'images'
		  }  
		};
		ImagePicker.showImagePicker(options, (response) => {
		  console.log('Response = ', response);

		  if (response.didCancel) {
		    console.log('User cancelled image picker');
		  }
		  else if (response.error) {
		    console.log('ImagePicker Error: ', response.error);
		  }
		 
		  else {
			//  let type = response.type.slice(6, 10)
		   // You can also display the image using data:
		   //let source = 'data:image/jpeg;base64,' + response.data ;

		  this.setState({  
			  image: [...this.state.image,{image:response.uri  }],    
			  imageData:[...this.state.imageData, response.data],
			  photoExtension:"png"
			});     
		  }
		});    	  
		         
	}  
	
	
	uploadObservations(){  
		let Details=  {
					"inspactMatAiId":this.state.materialDetails.inspectionMatAiId,
					"obsStatus":this.state.status,
					"obsRemarks":this.state.observation,
					"observationPhoto":this.state.imageData,
					"photoExtension":this.state.photoExtension,
					"observationVideo":[],
					"videoExtension":""    
                   }  
	    //alert(JSON.stringify(Details))  
	  APIManager.uploadObservations(Details, 
      (responseJson)=> { 
	   if(responseJson.status=="SUCCESS"){
       //alert(JSON.stringify(responseJson));
	   this.setState({isRefreshing:false})
	     const { navigation } = this.props;
         navigation.goBack();
         navigation.state.params.onSelect();	  
	  } 
	  else{      
		 alert('PLEASE TRY AGAIN')
         this.setState({isRefreshing:false})		 
	  }
      },(error)=>{
       	   this.setState({isRefreshing:false})
       	   console.log(JSON.stringify(error))
       	   alert('Please try again')	   
       }) 
	}  
		  
		
	render() {
    return (  
    <ImageBackground source={require('../../Images/background.png')} style={{width: '100%', height: '100%'}}> 	
    <ScrollView>	  
     <KeyboardAvoidingView  behavior='padding' style={styles.container}>
	    <Loader loading={this.state.isRefreshing} color="#40a7ab" />
		
		 <View style={{width:'10%'}} style={{flexDirection:'row'}}>
	      <TouchableOpacity onPress={()=>this.handleAndroidBackButton()}>
		   <Icon name="chevron-left" size={20} color="#000000" style={{margin:15}}   />
	      </TouchableOpacity>
	      <View style={{width:'90%'}}> 
	       <Text style={{fontSize:18, fontFamily:'GoogleSans-Medium', color:'black', paddingTop:15, textAlign:'center' }}>OBSERVATIONS</Text>
	      </View>  
	     </View> 
         
            
		<View style={{borderWidth:0,borderRadius:5, margin:15, padding:15, backgroundColor:'#141F25', width:'90%'}}>
		 <View style={{flexDirection:'row'}}>
		   <Text style={{color:'white', fontFamily:'GoogleSans-Medium', width:'50%'}}>SITE OFFER ID</Text>
		   <Text style={{color:'white', flex:1,  flexWrap: 'wrap', textAlign:'right', width:'50%'}}>{this.state.siteOfferDetails.siteOfferUnqId}</Text>
		 </View>
		  
		  <View style={{flexDirection:'row',  marginTop:20}}>
    	   <Text style={{color:'white', fontFamily:'GoogleSans-Medium', width:'50%'}}>Materials Name</Text>
		   <Text style={{color:'white', flex:1,  flexWrap: 'wrap', textAlign:'right', width:'50%'}}>{this.state.siteOfferDetails.materialName}</Text>
		  </View>  
		  
		  <View style={{flexDirection:'row',  marginTop:20, justifyContent:'space-between',}}>
    	   <Text style={{color:'white', fontFamily:'GoogleSans-Medium',}}>Materials Serial No.</Text>
		   <Text style={{color:'white'}}>{this.state.materialDetails.materialSrNo}</Text>
		  </View>
	   </View>            
	     
	   <View style={{borderWidth:0,borderRadius:5, marginHorizontal:15,padding:15, backgroundColor:'#FEC1A5', width:'90%'}}>
	    <View style={{ alignItems:'center'}}>
		<Text style={{fontSize:15, fontFamily:'GoogleSans-Medium', paddingTop:10, color:'black', textAlign:'center'}}>Click to Scan and Upload Observation Documents (if any)</Text>
		<TouchableOpacity onPress={()=>this.onCamera()} style={{padding:10, borderRadius:5, backgroundColor:'brown', marginVertical:10}}>
		 <Icon name="camera" size={30} color="white" />  
		</TouchableOpacity>  
	    </View>  
		
		  
		<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
	    {this.state.image.map((item)=>
		  <Icon name="file-text" size={30} color="#141F25" />
	     )}  
	   	</View> 
     		
	   </View> 
           
		    
       	<View style={{ width:'100%', padding:15}}>
		  <Text style={{fontSize:18, fontFamily:'GoogleSans-Medium', paddingTop:10, color:'black', textAlign:'center'}}>REMARKS</Text>	 
		  <TextInput
			 style={[styles.textInput,{height:100, backgroundColor:'#ffffff'}]}
			 onChangeText={(observation) => this.setState({observation})}
			 value={this.state.observation}
			 multiline={true}
			 placeholder='My Observations Are'
			 //underlineColorAndroid='orange'
		  />                     
		</View>		       
		     
		<View style={{flexDirection:'row', justifyContent:'space-between', width:'90%', marginBottom:50}}>
			<TouchableOpacity onPress={()=>this.onPassTest()} style={styles.acceptButton}>
			  <Text style={styles.buttonText}>PASS</Text>
			</TouchableOpacity>
			
			<TouchableOpacity onPress={()=>this.onFailTest()} style={styles.rejectButton}>
			  <Text style={styles.buttonText}>FAIL</Text>
			</TouchableOpacity>
		</View>			   
	 		   
    </KeyboardAvoidingView>        
     </ScrollView> 
    </ImageBackground>	 
	);                      
  }              
}        
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
   },
	
	tableHeader:{
	 flexDirection:'row', backgroundColor:'#33a0ff', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableHeaderText:{
     padding:10, fontFamily:'GoogleSans-Medium', color:'black', textAlign:'center',  borderRightColor:'lightgrey', borderRightWidth:1, 
	},
	tableContent:{
	 flexDirection:'row', backgroundColor:'#f9cda0', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableContentText:{
	 padding:10,  color:'black', borderRightColor:'lightgrey', textAlign:'center', borderRightWidth:1,	fontSize:12
	},
	linkText:{
	 paddingTop:10,paddingBottom:10,  color:'#1b6379', textAlign:'center', textDecorationLine: 'underline', width:'40%'	
	},
    button:{
      borderRadius: 5, backgroundColor: '#3CB043'		
	},
	buttonText:{
     fontSize:18, color:'#ffffff', fontFamily:'GoogleSans-Medium', paddingVertical:10, paddingHorizontal:25			
	},
	text:{
		color:'black', fontSize:15, fontFamily:'GoogleSans-Medium',
	},  
	textInput:{    
	  borderWidth:1    
	},  
    acceptButton:{
     borderRadius: 5, backgroundColor: '#3CB043', marginTop:20		
	},
	
	rejectButton:{
     borderRadius: 5, backgroundColor: '#fb0102',  marginTop:20		
	},	
});
