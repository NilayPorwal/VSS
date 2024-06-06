
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Linking, Image, TouchableOpacity,ToastAndroid, Dimensions, ActionSheetIOS, 
        BackHandler,ImageBackground,KeyboardAvoidingView, ScrollView,TextInput,Alert,Picker, 
		    Modal, TouchableWithoutFeedback, AsyncStorage, ActivityIndicator,CheckBox, Button} from 'react-native';
import LocalStorageManager from './Managers/LocalStorageManager';
import APIManager from './Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/Feather';  
  

  const {height, width} = Dimensions.get('window');
type Props = {};  
export default class ComplaintsScreen extends Component<Props> {
  
     constructor(props) {  
     super(props);         
      this.state = { 
	   		feedbackType:'---Select Type---',
        description:null   
	 }        
	   global.logInScreen= this;
	 }  
      
    static navigationOptions = {
		   header: <Image source={require('../Images/Header3.png')} style={{width:'100%',marginTop:(Platform.OS === 'ios')?24:0 }} />,
		   
           headerLeft:null   
	 };	  

    componentDidMount(){ 
        
     BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);  
   }  

   onSubmit(){
   if(this.state.feedbackType != "---Select Type---"){
    const details = {
                   feedbackType:this.state.feedbackType,
                   feedbackDescription:this.state.description
              }

    APIManager.feedback(details, 
    (responseJson)=>{
      //alert(JSON.stringify(respones))
        if(responseJson.status === 'SUCCESS'){ 
           Alert.alert("Your complaint has been forwarded")
           this.setState({feedbackType:"---Select Type---", description:null})
          }

    })
  }
 else {
    Alert.alert("Please select Complaint type")
  }
   }           
   		                     
   feedbackType(){
     ActionSheetIOS.showActionSheetWithOptions({
                options: ['---Select Type---', 'General Complaint', 'App Related Complaint' ],
            },
                (buttonIndex) => {
                  if(buttonIndex === 0){
                   this.setState({feedbackType: "---Select Type---"})
                  }
                 else if(buttonIndex === 1){
                   this.setState({feedbackType: "General Complaint"})
                  }
                 else{
                   this.setState({feedbackType: "App Related Complaint"})
                  }
              
                  
                })
   }           
	          
   render() {    
    return (      
     <ImageBackground source={require('../Images/background.png')} style={{width: '100%', height: '100%'}}>    
      <View style={styles.container} >

       <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
            <Icon name="chevron-left" size={20} color="#000000" style={{margin:15}}   />
          </TouchableOpacity>
          <View style={{width:'80%'}}> 
           <Text style={{fontSize:18, fontFamily:'GoogleSans-Medium', color:'black', paddingTop:15, textAlign:'center' }}>Complaint</Text>
          </View>  
         </View> 

         {   
         (Platform.OS === 'ios') ?
              <TouchableOpacity style={{ height: 45, backgroundColor:"#ffffff", margin:15,  borderColor:"#D3D3D3", borderWidth:1, justifyContent:"center"}} onPress={() => {this.feedbackType() }}>
                <Text style={{paddingLeft:10}}>{this.state.feedbackType}</Text>
              </TouchableOpacity> :   
         
       <View style={{backgroundColor:"#ffffff", margin:15,  borderColor:"#D3D3D3", borderWidth:1}}> 
        <Picker  
        selectedValue={this.state.feedbackType}
        style={{width:"100%"}}
        mode="dropdown"
        onValueChange={(itemValue, itemIndex) =>
          this.setState({feedbackType: itemValue})
        }>
        <Picker.Item label="---Select Type---" value="---Select Type---" />
        <Picker.Item label="General Complaint" value="General Complaint" />
        <Picker.Item label="App Related Complaint" value="App Related Complaint" />

      </Picker>  
	   </View>
     }
      <View style={{padding:15}}>
       <Text style={{color:"#000000", fontSize:15, paddingBottom:10}}>Description</Text>
       <TextInput
        style={{backgroundColor:"#ffffff", borderColor:"#D3D3D3", borderWidth:1, height:150, paddingLeft:10}}
        onChangeText={(description) => this.setState({description})}
        value={this.state.description}
        numberOfLines = {8}
      />
     </View> 

     
   
     <TouchableOpacity style={{backgroundColor:"#3CB043", margin:15}} onPress={()=>this.onSubmit()}>
      <Text style={{textAlign:"center", fontSize:15, color:"#ffffff", padding:10}}>Submit</Text>
     </TouchableOpacity>
  
	   </View>               
	 </ImageBackground>  
	);                    
  }         
}           
  
const styles = StyleSheet.create({
  container: { 
     flex:1,
  	
    },
 
 });
