import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableOpacity,Alert,
        BackHandler, Modal, TouchableWithoutFeedback,ImageBackground, 
		ActivityIndicator, AsyncStorage, ScrollView, FlatList, ToastAndroid} from 'react-native';
import APIManager from './Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';

          
global.InspectorConfirmationScreen;    
type Props = {};  
export default class InspectorConfirmationScreen extends Component<Props> {
	  
	   constructor(props) {  
       super(props);     
		  this.state = {  
		  details:[], 		   
          woDetails:[],
          vendId:'',
          isRefreshing:false,
          error:false
		   }    
		  global.InspectorConfirmationScreen = this;
	   }   
	
	 
	
   static navigationOptions = {
       header: <Image source={require('../Images/Header3.png')} style={{width:'100%', marginTop:(Platform.OS === 'ios')?24:0 }} />,
       headerLeft:null  	   
    };	  
	

  componentDidMount(){
	
	 this.getInspId();  
	 
	  BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}  
	  
  async getInspId(){  
		 await AsyncStorage.getItem('InspId').then((value) => 
			this.setState({vendId:value},()=>{this.getInspectorConfirmationDetails()} )	
		 )         
	 } 
 
   
  getInspectorConfirmationDetails(){  

      
      APIManager.getInspectorConfirmationDetails(this.state.vendId, 
        (responseJson)=> { 
	     // alert(JSON.stringify(responseJson));  
	        if (responseJson.status == 'SUCCESS'){ 
	         this.setState({details:responseJson.data, isRefreshing:false})
	        } 
	        else{
	         this.setState({error:true, isRefreshing:false})	
	        }
	      }, (error)=>{
            this.setState({isRefreshing:false})
            console.log(JSON.stringify(error)); 
	     })            
	     }   
	     
     
	      
 
  onConfirm(item){
   
       const  Details = {
           "inspectionCnfrmAiId":item.inspectionCnfrmAiId,
			"nominationAiId" :item.nominationAiId,
			"pdiOfferAiId" :item.pdiOfferAiId,
			"vendorConfirmStatus" : 1,
			"vendorConfirmRemarks" : "thanks"
         }
        // alert( JSON.stringify(Details) )
        APIManager.onConfirmByVendor(Details,
        (responseJson)=> {
	        //alert(JSON.stringify(responseJson));  
	        if (responseJson.status == 'SUCCESS'){
             this.props.navigation.navigate('HomeScreen')
	        }
	        else{
             // ToastAndroid.show('Please Try Again !', ToastAndroid.CENTER);
                Alert.alert("Failed", responseJson.message)
	        }
	       //this.setState({offerDetails:responseJson.data})
	      }, (error)=>{
            this.setState({isRefreshing:false})
            console.log(JSON.stringify(error)); 
	     }) 

	 } 	 

      
  onCnfm(item){
    Alert.alert(
		  'Please Confirm',
		  'Are you sure you want to confirm Inspector for Inspection ?',
		  [
			{text: 'NO', onPress: () => {console.log('Cancel Pressed')}, style: 'cancel'},
			{text: 'Yes', onPress: () =>  global.InspectorConfirmationScreen.onConfirm(item)},
		  ],
		  { cancelable: true }  
      )
	    return true;	

    

  }    
	   	 
	   	    
	    
  render() {    
	
    return (
	  <ImageBackground source={require('../Images/background.png')} style={{width: '100%', height: '100%'}}> 
      <ScrollView>
	  <View style={styles.container}>
	    <Loader loading={this.state.isRefreshing} color="#40a7ab" />
        <Text style={{fontSize:18, fontFamily:'GoogleSans-Medium', marginTop:25, color:'black'}}>Confirmation By Inspector</Text>
        
        
       
      {(this.state.error==false)?
        <FlatList    
				  data={this.state.details}
				  keyExtractor={item => item.index}
                  renderItem={({item, index}) =>       
			      
			<View style={{margin:15, borderRadius:5, elevation:8, backgroundColor:'#ffffff', padding:15}}>
			
			<View style={{flexDirection:'row'}}>
			  <View style={{width:'50%'}}>
			    <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>Inspector Id</Text>
			    <Text style={{color:'#000000',  fontSize:13}}>{item.inspectionCnfrmAiId}</Text>
			  </View> 
			   
			  <View  style={{width:'50%'}}>
			    <Text  style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15, textAlign:'right'}}>Inspector Name</Text>
			    <Text  style={{color:'#000000', fontSize:13, textAlign:'right'}}>{item.inspectorName}</Text>
			  </View> 
			</View>

			<View style={{flexDirection:'row', marginTop:10}}>
			  <View style={{width:'50%'}}>
			    <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>Proposed Inspection Date</Text>
			    <Text style={{color:'#000000',  fontSize:13}}>{item.tenderNumber}</Text>
			  </View> 
			  
			  <View  style={{width:'50%'}}>
			    <Text  style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15, textAlign:'right'}}>Time of Arival</Text>
			    <Text  style={{color:'#000000', fontSize:13, textAlign:'right'}}>{item.inspectionDate}</Text>
			  </View> 
			</View>
  
			<View style={{flexDirection:'row', marginTop:10}}>
			  <View style={{width:'50%'}}>
			    <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>Pick Up Location</Text>
			    <Text style={{color:'#000000',  fontSize:13}}>{item.pickUpLocation}</Text>
			  </View> 
			  
			  <View  style={{width:'50%'}}>
			    <Text  style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15, textAlign:'right'}}>Mode of Travel</Text>
			    <Text  style={{color:'#000000', fontSize:13, textAlign:'right'}}>{item.travelMode}</Text>
			  </View> 
			</View>  

			<View style={{flexDirection:'row', marginTop:15}}>
			  <View style={{width:'50%'}}>
			    <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>Inspector Contact Number</Text>
			    <Text style={{color:'#000000',  fontSize:13}}>{item.inspectorContactNo}</Text>
			  </View> 
			  
			  <View  style={{width:'50%'}}>
			     
			  </View> 
			</View>     
     
             <TouchableOpacity onPress={()=>{this.onCnfm(item)}}   style={{borderRadius: 5, backgroundColor: '#418bca', marginVertical:15}}>
				<Text style={{fontSize:18, color:'#ffffff', fontFamily:'GoogleSans-Medium', paddingVertical:10, textAlign:'center', elevation:5}}>CONFIRM</Text>
			 </TouchableOpacity> 	


            </View>			          
					                    
			  }         
		   />:
		   <View style={{justifyContent:'center', height:100}}>                     
            <Text style={{fontFamily:'GoogleSans-Medium', fontSize:15}}>No Data Found</Text>	        
	       </View> }   
            



		</View>   
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
	 flexDirection:'row', backgroundColor:'#000000', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableHeaderText:{
     paddingVertical:10, fontFamily:'GoogleSans-Medium', color:'#ffffff', textAlign:'center',  borderRightColor:'lightgrey', borderRightWidth:1, 
	},
	tableContent:{
	 flexDirection:'row', backgroundColor:'#ffffff', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableContentText:{
	  color:'black', borderRightColor:'lightgrey', textAlign:'center', borderRightWidth:1,	fontSize:14,paddingVertical:10,
	},      
	button:{
    borderRadius: 5, backgroundColor: '#ff7f00', marginTop:20, paddingVertical:10, paddingHorizontal:20	
	},
	buttonText:{
     fontSize:18, color:'#ffffff', fontFamily:'GoogleSans-Medium',	
	},
	detailsView:{
	  borderWidth:1, margin:15, padding:15, backgroundColor:'#FEC1A5', elevation:8, borderColor:'transparent'
	}
});  
  