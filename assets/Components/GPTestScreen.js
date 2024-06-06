import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image,BackHandler, 
        TouchableOpacity, ScrollView, Modal, TextInput,
		TouchableWithoutFeedback, KeyboardAvoidingView, 
		Alert, ImageBackground, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import APIManager from './Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import DocumentPicker from 'react-native-document-picker';
var RNFS = require('react-native-fs');
   
      
global.GPTestScreen;
export default class GPTestScreen extends Component {
  	
     constructor(props) {  
     super(props);       
      this.state = { 
	    testModalVisible:false,   
        testname:'',
		observation:'',    
		uatStatus:null,    
		test:[],
		image:[],
		imageData:null,
		type:'', 
        video:"",
		isDisabled:false,
		isRefreshing:false,
        vendorDetails:this.props.navigation.state.params.vendorDetails,
        pickerModalVisible:false		
	 }
	 // alert(JSON.stringify(this.props.navigation.state.params.materialDetails))   
	 global.GPTestScreen = this;
	}	            
	static navigationOptions = {
       header: <Image source={require('../Images/Header3.png')} style={{width:'100%',marginTop:(Platform.OS === 'ios')?24:0 }} />,
        headerLeft:null 	   
    };
	
	componentDidMount(){
		 BackHandler.addEventListener('hardwareBackPress', global.GPTestScreen.handleAndroidBackButton);
	}
	componentWillUnmount() {
		 BackHandler.removeEventListener('hardwareBackPress', global.GPTestScreen.handleAndroidBackButton);
     }
	      
	handleAndroidBackButton(){
		// Alert.alert(
		//   'Are you sure you want to go back ?',
		//   'It will clear all your test data ',
		//   [
		// 	{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
		// 	{text: 'OK', onPress: () =>   global.GPTestScreen.props.navigation.goBack()},
		//   ],
		//   { cancelable: true }  
        //)
        global.GPTestScreen.props.navigation.goBack()
	    return true;	  
	}    
	  

	  
	onSubmit(type){
		if(this.state.image.length == 0){
         Alert.alert("Document required")
         return
		}else if(this.state.observation == null || this.state.observation.trim() == ""){
         Alert.alert("Observation required")
         return
		}
		Alert.alert(
	      "Hold on!",		
		  'Are you sure you want to submit inspection ?',
		  [
			{text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'Yes', onPress: () => this.uploadGPTest(type)},
		  ],
		  { cancelable: true }  
        )
      
	}      
	


	 uploadGPTest(type){
	
	   this.setState({isDisabled:true, isRefreshing:true})
	     let Details= {
						"inspctSiteGpAiId":this.state.vendorDetails.inspectionSiteAiId,
						 "nominationGpAiId":this.state.vendorDetails.nominationGpAiId,
						"inspResult":type,
						"inspGpDocPath":this.state.image[0].imageData,
						"inspObserRemark":this.state.observation,
						"extn":this.state.image[0].type
						};
		console.log(JSON.stringify(Details));
	   APIManager.uploadGPTest(Details, 
	      (responseJson)=> {
	        console.log(JSON.stringify(responseJson));
		   if(responseJson.status=="SUCCESS"){
		    this.setState({isDisabled:false, isRefreshing:false, image:[], observation:null})
			 const { navigation } = this.props;
	         navigation.push("HomeScreen");
	         Alert.alert("Success", responseJson.message)
		   }
		   else{
			 this.setState({isDisabled:false, isRefreshing:false})  
			 Alert.alert("Failed to Submit", responseJson.message)
		
		   }  
       },(error)=>{
       	   this.setState({isRefreshing:false})
       	   console.log(JSON.stringify(error))
       	   Alert.alert("Failed to Submit", error.message)	   
       })  

	}   

async onDocPress(){
	   if(this.state.image.length > 0){
       Alert.alert("Only one document allowed")
       return	
     } 	
     try {
		  const res = await DocumentPicker.pick({
		    type: [DocumentPicker.types.pdf, DocumentPicker.types.images],		    
		  });
		  console.log('Response = ', res);
		  RNFS.readFile(res.uri, "base64").then(result =>
			{
			    console.log(result)
			    const imgData = {          
						  imageData:result,
						  type:res.type.split("/")[1]
						}  
			    	  this.setState({image:[...this.state.image, imgData]});
			})
		} catch (err) {
		  if (DocumentPicker.isCancel(err)) {
		    // User cancelled the picker, exit any dialogs or menus and move on
		  } else {
		    throw err;
		  }
		}	 	
		
	}       
	  
	
  async	onCamera(){
     if(this.state.image.length > 0){
       Alert.alert("Only one document allowed")
       return	
     } 	
     var options = {
		  title: 'Select Avatar',
		  quality: 0.3,
		  storageOptions: {  
		    path: 'images'
		  }  
		};
		ImagePicker.launchCamera(options, (response) => {
		  console.log('Response = ', response);
          //alert(JSON.stringify(response))  
		  if (response.didCancel) {
		    console.log('User cancelled image picker');
		  }
		  else if (response.error) {
		    console.log('ImagePicker Error: ', response.error);
		  }
		 
		  else { 
		    let source =  response.uri    
           // let type = response.type.slice(6, 10)  
		    const imgData = {      
			  imageData:response.data,
			  type:"jpeg"  
			}  
	     this.setState({image:[...this.state.image, imgData]});		      
		  }
		}); 		
	}

	removeDoc(index){
	   	Alert.alert(
	      "Hold on!",		
		  'Do you want to remove this document ?',
		  [
			{text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'Yes', onPress: () => {
               const docs = this.state.image
               docs.splice(index, 1)
               this.setState({image:docs});	
			}},
		  ],
		  { cancelable: true }  
        )
	}


	onCameraPress(){
     if(this.state.image.length > 0){
       Alert.alert("Only one document allowed")
       return	
     } 	
      this.setState({pickerModalVisible:true})
  
 	}	

	
	                 
		        
  render() {
    return ( 
     <ImageBackground source={require('../Images/background.png')} style={{flex:1}}>
	   <Loader loading={this.state.isRefreshing} color="#40a7ab" />
		<ScrollView contentContainerStyle={{flexGrow: 1}}
		  keyboardShouldPersistTaps='handled'
		>
	    <KeyboardAvoidingView
	        behavior='position'
	        keyboardVerticalOffset={(Platform.OS === 'ios') ? 40 : 50}
	      >
     <View style={{width:'20%'}} style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>global.GPTestScreen.handleAndroidBackButton()}>
	   <Icon name="chevron-left" size={20} color="#000000" style={{margin:15}}   />
      </TouchableOpacity>
      <View style={{width:'80%'}}> 
       <Text style={{fontSize:18, fontFamily:'GoogleSans-Medium', color:'black', paddingTop:15, textAlign:'center' }}>GP Test</Text>
      </View>  
     </View> 
	    
		<View style={{borderWidth:0,borderRadius:5, margin:15, padding:15, backgroundColor:'#FEC1A5', width:'90%', elevation:8}}>
		    	  
		  <View style={{flexDirection:'row', marginVertical:5}}>
	         <Icon name="user" size={16} color="black" style={{}}   />
	         <Text style={{color:'#000000',fontFamily:'GoogleSans-Medium', fontSize:15, paddingLeft:5}}  selectable={true} >{this.state.vendorDetails.vendorFirmName}</Text>
	      </View> 
		  
		  <View style={{flexDirection:'row', marginTop:15}}>
		   <View style={{width:"50%"}}>
		   	<Text style={{color:'#000000'}}>Material Name</Text>
		    <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', paddingTop:5}}>{this.state.vendorDetails.materialName}</Text>
		   </View> 
		    <View style={{width:"50%"}}>
		   	<Text style={{color:'#000000', textAlign:"right"}}>Subcategory Name</Text>
		    <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', paddingTop:5, textAlign:"right"}}>{this.state.vendorDetails.materialScName}</Text>
		   </View> 
		  </View>  
		  
	    </View> 
     		
            
       <View style={{borderWidth:0,borderRadius:5, marginHorizontal:15, padding:10, backgroundColor:'#FEC1A5', width:'90%'}}>
	    <View style={{ alignItems:'center'}}>
			<Text style={{fontSize:15, fontFamily:'GoogleSans-Medium', paddingTop:10, color:'black', textAlign:'center'}}>Click to Scan and Upload Observation Documents (if any)</Text>
			<View style={{flexDirection:"row"}}>	
				<TouchableOpacity onPress={()=>this.onCamera()} style={{padding:10, borderRadius:5, backgroundColor:'brown', marginVertical:10}}>
				 <Icon name="camera" size={20} color="white" />  
				</TouchableOpacity>
				<TouchableOpacity onPress={()=>this.onDocPress()} style={{padding:10, borderRadius:5, backgroundColor:'brown', marginVertical:10, marginLeft:10}}>
				 <Icon name="image" size={20} color="white" />  
				</TouchableOpacity>
		   </View>		
	    </View>  
		
		  
		<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
		    {this.state.image.map((item, index)=>
			<TouchableOpacity key={index} onPress={()=>this.removeDoc(index)} style={{paddingLeft:5}}>
			  <Icon name="file-text" size={30} color="#141F25" />
			</TouchableOpacity>  
		     )}  
	   	</View> 
     		
	   </View> 

      <View style={{ width:'90%',alignSelf:"center", marginTop:20}}>
		  <Text style={styles.text}>Observation</Text>  
		  <TextInput
			 style={[styles.textInput,{height:100}]}
			 onChangeText={(observation) => this.setState({observation})}
			 value={this.state.observation}
			 multiline={true}
  			 //underlineColorAndroid='orange'
		  />                   
        </View>	    
	 </KeyboardAvoidingView>  
		  	          
 	   <View style={{flexDirection:'row', marginTop:50, justifyContent:'space-between', width:'90%', alignSelf:"center"}}>	       
        <TouchableOpacity  disabled={this.state.isDisabled} onPress={()=>this.onSubmit(1)} style={styles.button}>
		  <Text style={styles.buttonText}>PASS</Text>
		</TouchableOpacity> 
		
		 <TouchableOpacity  disabled={this.state.isDisabled} onPress={()=>this.onSubmit(2)} style={{...styles.button, backgroundColor: '#fb0102'}}>
		  <Text style={styles.buttonText}>FAIL</Text>
		</TouchableOpacity>  
	   </View>   
            
       
         <Modal      
          transparent={true}  
          visible={this.state.pickerModalVisible}
          onRequestClose={() => this.setState({pickerModalVisible:false})}>
            <TouchableOpacity onPress={()=>this.setState({pickerModalVisible:false})} style={{ flex: 1,  justifyContent: 'center', alignItems: 'center',backgroundColor:'#00000080'}}>
			<TouchableWithoutFeedback>
			  <View style={{ width: "80%", backgroundColor:'#ffffff',padding:10,borderRadius:10}}>
				<TouchableOpacity style={{margin:10}} onPress={()=>this.onCamera(0)}>
				  <Text style={{color:"#000"}}>Take Picture</Text>
				</TouchableOpacity>
			    <TouchableOpacity style={{margin:10}} onPress={()=>this.onCamera(1)}>
				  <Text style={{color:"#000"}}>Select from Gallary</Text>
				</TouchableOpacity>				   
			  </View>
           </TouchableWithoutFeedback>			
		   </TouchableOpacity>  
          </Modal>  
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
	 flexDirection:'row', backgroundColor:'#141F25', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableHeaderText:{
     padding:10, fontFamily:'GoogleSans-Medium', color:'#ffffff', textAlign:'center',  borderRightColor:'lightgrey', borderRightWidth:1, 
	},
	tableContent:{
	 flexDirection:'row', backgroundColor:'#ffffff', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableContentText:{
	color:'#1b6379', borderRightColor:'lightgrey', textAlign:'center', borderRightWidth:1, fontSize:15, paddingVertical:10, fontFamily:'GoogleSans-Medium',
	},
	linkText:{
	 paddingTop:10,paddingBottom:10,  color:'#1b6379', textAlign:'center', textDecorationLine: 'underline', width:'40%'	
	},
    button:{
     borderRadius: 5, backgroundColor: '#3CB043', elevation:6		
	},
	buttonText:{
     fontSize:15, color:'#ffffff',fontFamily:'GoogleSans-Medium', paddingVertical:10, paddingHorizontal:20, textAlign:'center'	
	},
	text:{
		color:'black', fontSize:15, fontFamily:'GoogleSans-Medium',
	},  
	textInput:{  
	  borderWidth:1, backgroundColor:"#fff"
	},    
    acceptButton:{
     borderRadius: 5, backgroundColor: '#ff7f00', marginTop:20		
	},
	
	rejectButton:{
     borderRadius: 5, backgroundColor: '#fb0102', marginTop:20		
	},	
});
